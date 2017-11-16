
var $ = require('./Util');

module.exports = function (cfg) {
    var el = cfg.el;
    el.style.overflow = 'hidden';
    if(window.getComputedStyle(el).getPropertyValue('position')==='static'){
        el.style.position = 'relative';
    }

    this.container = el;
    this.width = 0;
    this.height = 0;

    this.playing = false;
    this.isFullScreen = false;

    var video = $.create('video');
    video.style.width = 'inherit';

    video.setAttribute('autoplay','autoplay');
    el.appendChild(video);

    var _this = this;


    //webrtc request

    var ws;
    var peerConnection;
    var CRLF = '\r\n';
    var requestId = 1;
    var endpoint_id = Math.floor(Math.random()*10000);
    function request(msgObj, method, path) {
        var options = {
            method: method,
            path: path,
            body: JSON.stringify(msgObj)
        };
        var text = "";
        if (options.method && options.path) {
            if (options.body) {
                text = 'request:' + requestId++ + CRLF + 'method:' + options.method + CRLF + 'path:' + options.path + CRLF + CRLF + options.body;
            } else {
                text = 'request:' + requestId++ + CRLF + 'method:' + options.method + CRLF + 'path:' + options.path + CRLF;
            }
        } else {
            throw new Error('\'method\' and \'path\' options are necessary');
        }
        if (text.length > 0) {
            ws.send(text);
        }
    }
    $.post({
        url:cfg.url + '/webmedia/livestream',
        body:JSON.stringify({
            source: {
                type: 'rtsp',
                options: {
                    rtsp: {
                        url: cfg.stream
                    }
                }
            }
        })
    }).then(function (xhr) {
        $.post({
            url:cfg.url + '/webmedia/livestream/viewer',
            body:JSON.stringify({
                type: 'webrtc',
                Id: JSON.parse(xhr.response).streamId,
                video: 'recvonly',
                audio: 'recvonly'
            })
        }).then(function (xhr) {
            var obj=JSON.parse(xhr.response);
            function createOffer() {
                var offerOptions = {
                    offerToReceiveAudio: 0,
                    offerToReceiveVideo: 1
                };
                peerConnection.createOffer(offerOptions).then(onCreateOfferSuccess, error => {});
                function onCreateOfferSuccess(desc) {
                    peerConnection.setLocalDescription(desc).then(function() {
                            var sdp = {
                                type: "offer",
                                offer: desc
                            };
                            var msgObj = {
                                endpoint: {
                                    type: 'offerer',
                                    connection: obj.viewerId.toString()
                                },
                                message: {
                                    sdp: desc
                                }
                            };
                            request(msgObj, 'PUT', '/webrtc/push');
                        }, error => {});
                }
            }
            function handleAnswer(answer) {
                peerConnection.setRemoteDescription(answer);
                var msgObj = {
                    endpoint: {
                        type: 'offerer',
                        connection: obj.viewerId.toString()
                    },
                    message: {
                        status: 'connected'
                    }
                };
                request(msgObj, 'PUT', '/webrtc/push');
            }
            function handleCandidate(candidate) {
                peerConnection.addIceCandidate(candidate).catch(function (e) {

                });
            }
            function notificationHandler(msg) {
                var data = JSON.parse(msg);
                if(data.message.status === 'connecting') {
                    if(peerConnection) {
                        createOffer();
                    }
                }
                if(data.message.sdp !== undefined) {
                    if(data.message.sdp.type === 'answer'){
                        handleAnswer(data.message.sdp);
                    }
                    if(data.message.sdp.candidate) {
                        handleCandidate(data.message.sdp);
                    }
                }
            }
            ws = new WebSocket(`${obj.signalingBridge}/endpoint${endpoint_id}`);
            ws.onopen = function(evt) {
                // create peerConnection
                peerConnection = new RTCPeerConnection();
                peerConnection.onaddstream = (e) => {
                    video.srcObject = e.stream;
                };
                peerConnection.onicecandidate = function (event) {
                    if (event.candidate) {
                        var msgObj = {
                            endpoint: {
                                type: 'offerer',
                                connection: obj.viewerId.toString()
                            },
                            message: {
                                sdp: event.candidate
                            }
                        };
                        request(msgObj, 'PUT', '/webrtc/push');
                    }
                };

                // subscribe
                var postObj = {
                    endpoint: [{
                        type: 'answerer',
                        connection: obj.viewerId.toString(),
                        topic: ['sdp', 'status']
                    }],
                    notify_addr: `endpoint${endpoint_id}`
                };
                request(postObj, 'POST', '/webrtc/subscription');
                var msgObj = {
                    endpoint: {
                        type: 'offerer',
                        connection: obj.viewerId.toString()
                    },
                    message: {
                        status: 'connecting'
                    }
                };
                request(msgObj, 'PUT', '/webrtc/push');
            };
            ws.onmessage = function(evt) {
                var ws_data = evt.data;
                var  index = ws_data.indexOf(`${CRLF}${CRLF}`);
                var cache = ws_data.slice(0, index + 2);
                var header = {};
                var start = 0;
                while (true) {
                    var pos = cache.indexOf(CRLF, start);
                    if (pos == -1) break;
                    var line = cache.slice(start, pos);
                    start = pos + 2;

                    var arr = line.split(':');
                    var key = arr[0].trim();
                    var value = arr[1].trim();

                    switch (key) {
                        case 'request':
                        {
                            header.request = parseInt(value);
                            break;
                        }
                        case 'method':
                        {
                            header.method = value;
                            break;
                        }
                        case 'path':
                        {
                            header.url = value;
                            break;
                        }
                        case 'response':
                        {
                            header.response = parseInt(value);
                            break;
                        }
                        case 'status_code':
                        {
                            header.status_code = parseInt(value);
                            break;
                        }
                    }
                }
                var data = ws_data.slice(index + 4);
                var reqRes = {
                    'header': header,
                    'body': data
                };
                if(reqRes.header.request) {
                    notificationHandler(reqRes.body);
                }
            };
        });
    });


    //播放
    this.play = function () {
        video.play();
        this.playing = true;
    };

    //暂停
    this.pause = function () {
        video.pause();
        this.playing = false;
    };

    //停止
    this.stop = function () {
        video.pause();
        video.currentTime = 0;
        this.playing = false;
    };

    //currentTime
    this.currentTime = function (time) {
        if(time){
            video.currentTime = time;
        }
        return video.currentTime;
    };

    //音量
    this.volume = function (val) {
        if(val){
            video.volume = val;
        }
        return video.volume
    };

    //全屏
    this.fullScreen = function () {
        $.css(el,{
            width:'100%',
            height:'100%'
        });
        if(el.requestFullscreen) {
            el.requestFullscreen();
        }
        else if(el.mozRequestFullScreen) {
            el.mozRequestFullScreen();
        }
        else if(el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen();
        }
        else if(el.msRequestFullscreen) {
            el.msRequestFullscreen();
        }
    };

    //退出全屏
    this.exitFullScreen = function () {
        $.css(el,{
            width:_this.width + 'px',
            height:_this.height + 'px'
        });
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    };

    //esc退出全屏
    this.escClick = null;
    $.each(["", 'webkit', 'moz', 'ms'],function (k,v) {
        $.addEvent(el,v+'fullscreenchange',function () {
            !(_this.isFullScreen = !_this.isFullScreen) && (_this.exitFullScreen(),(_this.escClick && _this.escClick()));
        });
    });

    //视频进度改变
    this.ontimeupdate = null;
    $.addEvent(video,'timeupdate',function () {
        _this.ontimeupdate && _this.ontimeupdate(video.currentTime);
    });

    //视频载入
    this.onload = null;
    $.addEvent(video,'loadeddata',function () {
        _this.width = video.clientWidth;
        _this.height = video.clientHeight;
        _this.duration = video.duration;

        el.style.height = _this.height + 'px';

        _this.onload && _this.onload(_this);
    });
};