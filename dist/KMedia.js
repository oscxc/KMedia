/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {


var Ajax = __webpack_require__(1);

function type(v) {
    return Object.prototype.toString.apply(v).slice(8,-1);
}

function extend(t,o) {
    for(var n in o){
        t[n]=o[n] ;
    }
}

function each(v,f) {
    var t = type(v);
    if (t==="Array"||t==="NodeList"||t==='Arguments') {
        for (var i=0;i<v.length;i++) {
            f(i,v[i]);
        }
    }
    else if(t==="Object"){
        for (var key in v) {
            f(key,v[key]);
        }
    }
    else if(t==="Number"){
        for (var i=0;i<v;i++) {
            f(i,v);
        }
    }
    else{
        throw new TypeError("该对象不支持遍历");
    }
}

function createTree(obj) {
    var el = obj.el;
    var childs = obj.childs;
    if(childs){
        each(childs,function (k,v) {
            createTree(v);
            el.appendChild(v.el);
        });
    }
}

function Util(selector){
    if(type(selector)==="Function"){
        var tmp = function () {
            document.removeEventListener("DOMContentLoaded",tmp);
            selector();
        };
        document.addEventListener("DOMContentLoaded",tmp);
    }
    else{
        var els = document.querySelectorAll(selector);
        if(els.length === 0){
            throw new Error("选择器未选到元素");
        }
        return els.length>1?els:els[0];
    }
}

extend(Util,{

    //Tools
    type:type,
    extend:extend,
    each:each,
    log:function (s){
        console.log(s);
    },
    isEmptyObject:function (o) {
        for (var k in o)
            return false;
        return true;
    },
    download:function (src,name) {
        var a = create('a',{
            href:src,
            download:name?name:"defaultName"
        });
        var body = document.body;
        body.appendChild(a);
        a.click();
        body.removeChild(a);
    },
    cannotSelect:function () {
        window.getSelection().removeAllRanges();
    },

    //Element
    create:function (tagName,attrs) {
        var el;
        switch (tagName){
            case "text":
                el = document.createTextNode(attrs);
                break;
            case "comment":
                el = document.createComment(attrs);
                break;
            case "fragment":
                el = document.createDocumentFragment();
                break;
            default:
                el = document.createElement(tagName);
                if(attrs){
                    each(attrs,function (k,v) {
                        el.setAttribute(k,v);
                    });
                }
                break;
        }
        return el;
    },
    createTree:createTree,
    createSvgIcon:function (obj) {
        function create(name) {
            return document.createElementNS('http://www.w3.org/2000/svg',name);
        }
        function attr(el,p,v) {
            el.setAttribute(p,v);
        }
        var path = create('path');
        attr(path,'fill',obj.color?obj.color:'white');
        attr(path,'d',obj.data);
        var svg = create('svg');
        attr(svg,'viewBox',obj.viewBox?obj.viewBox:'0 0 24 24');
        if(obj.className){
            svg.setAttribute('class',obj.className);
        }
        svg.appendChild(path);
        return svg;
    },
    setSvgData:function (el,data) {
        el.children[0].setAttribute('d',data);
    },
    show:function (el) {
        el.style.display = 'block';
    },
    hide:function (el) {
        el.style.display = 'none';
    },
    setLT:function (el,L,T) {
        el.style.left = L + 'px';
        el.style.top = T + 'px';
    },
    setWH:function (el,W,H) {
        el.style.width = W + 'px';
        el.style.height = H + 'px';
    },

    //Events
    addEvent:function (el,name,cb) {
        el.addEventListener(name,cb);
    },
    delEvent:function (el,name,cb) {
        el.removeEventListener(name,cb);
    },
    click:function (el,cb) {
        el.addEventListener("click",cb);
    },

    //Style
    css:function (el,obj) {
        if(type(obj)==="String"){
            return window.getComputedStyle(el).getPropertyValue(obj);
        }
        else {
            each(obj,function (k,v) {
                el.style[k] = v;
            });
        }
    },
    WH:function (el,n) {
        el.style.width = el.style.height = n + 'px';
    },

    //Throttle
    Throttle:function(interval,callback) {
        var time;
        this.filter = function (args) {
            if(time&&new Date()-time<interval)
                return;
            time = new Date();
            args?callback(args):callback();
        };
    },

    //Ajax
    head:Ajax.head,
    get:Ajax.get,
    post:Ajax.post
});

module.exports = Util;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {


var Promise = __webpack_require__(2);

function each(v,f) {
    for (var k in v) {
        f(k,v[k]);
    }
}

// Ajax core
function ajax(method,obj) {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        obj.headers && each(obj.headers,function (k,v) {
            xhr.setRequestHeader(k,v);
        });
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4){
                resolve(xhr);
            }
        };
        xhr.open(method,obj.url);
        switch (method){
            case 'head':
            case 'get':
                xhr.send();break;
            case 'post':
                xhr.send(obj.body);break;
        }
    });
}

module.exports = {
    head:function (obj) {
        return ajax('head',obj);
    },
    get:function (obj) {
        return ajax('get',obj);
    },
    post:function (obj) {
        return ajax('post',obj);
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {


(function (f) {
    if (typeof module === 'object' && typeof module.exports === 'object'){
        module.exports = f();
    }
    else{
        window.Promise = f();
    }
})(function () {
    if(typeof Promise != 'function'){
        var Promise = function(fn) {
            var state = 'pending';
            var callbacks = [];
            var result = null;
            function res_rej(a,b,c) {
                if(state !== 'pending'){
                    return;
                }
                if(b && b['then'] && typeof b['then'] === 'function'){
                    b['then'](resolve, reject);
                    return;
                }
                state = a;
                result = b;
                callbacks.forEach(function (obj) {
                    obj[c](result);
                });
            }
            function resolve(value) {
                res_rej('fulfilled',value,0);
            }
            function reject(reason) {
                res_rej('rejected',reason,1);
            }
            this.then = function (onFulfilled,onRejected) {
                return new Promise(function (resolve, reject) {
                    switch (state){
                        case 'pending':
                            callbacks.push([
                                function () {
                                    resolve(onFulfilled(result));
                                },
                                function () {
                                    reject(onRejected(result));
                                }
                            ]);
                            break;
                        case 'fulfilled':
                            resolve(onFulfilled(result));
                            break;
                        case 'rejected':
                            reject(onRejected(result));
                            break;
                    }
                });
            };
            this.catch = function (onRejected) {
                return this.then(null, onRejected);
            };
            fn(resolve,reject);
        };
        Promise.resolve = function (value) {
            return new Promise(function(resolve) {
                resolve(value);
            });
        };
        Promise.reject = function (reason) {
            return new Promise(function(resolve, reject) {
                reject(reason);
            });
        };
        Promise.all = function (promises) {
            return new Promise(function(resolve, reject) {
                var count = 0;
                var values = [];
                for (var i = 0; i < promises.length; i++) {
                    Promise.resolve(promises[i]).then(function(value) {
                        values.push(value);
                        if (count === promises.length-1) {
                            resolve(values);
                        }
                        else{
                            count++;
                        }
                    }, function(reason) {
                        reject(reason);
                    });
                }
            });
        };
        Promise.race = function (promises) {
            return new Promise(function(resolve, reject) {
                for (var i = 0; i < promises.length; i++) {
                    Promise.resolve(promises[i]).then(function(value) {
                        resolve(value);
                    }, function(reason) {
                        reject(reason);
                    })
                }
            });
        };
    }
    return Promise;
});


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);
var Media = __webpack_require__(4);
var MediaRT = __webpack_require__(6);


window.KMedia = function (cfg) {

    //直播配置
    var configRT = {
        realtime:true,
        el:null,
        url:'',
        stream:''
    };

    //点播配置
    var config = {
        realtime:false,
        el:null,
        src:null,
        edit:false
    };

    if(cfg.realtime){
        $.extend(configRT,cfg);
        return new MediaRT(configRT);
    }
    else {
        $.extend(config,cfg);
        return new Media(config);
    }
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);
var TargetTrack = __webpack_require__(5);

module.exports = function (cfg) {
    var el = cfg.el;
    el.style.overflow = 'hidden';
    if(window.getComputedStyle(el).getPropertyValue("position")==="static"){
        el.style.position = 'relative';
    }

    this.container = el;
    this.width = 0;
    this.height = 0;
    this.duration = 0;
    this.playing = false;
    this.isFullScreen = false;

    var video = $.create('video');
    this.video = video;

    video.style.width = 'inherit';


    video.src = cfg.src;
    el.appendChild(video);

    this.targetTrack = null;
    var _this = this;


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
    $.each(["", "webkit", "moz", "ms"],function (k,v) {
        $.addEvent(el,v+"fullscreenchange",function () {
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

        if(cfg.edit){
            _this.targetTrack = new TargetTrack(_this);
        }

        _this.onload && _this.onload(_this);
    });
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);

module.exports = function (media) {

    // 创建背景div
    var bg = $.create('div');
    $.css(bg,{
        position:'absolute',
        top:0,
        left:0,
        width:'inherit',
        height:'inherit',
        'z-index': 2
    });
    media.container.appendChild(bg);
    var bgRect = bg.getBoundingClientRect();

    // 需要的变量
    var tg,tgP;
    var elDownX,elDownY;
    var tgElL,tgElT,tgElW,tgElH;
    var tgElDownX,tgElDownY;
    var tgElMoveL,tgElMoveT;

    var minTime,maxTime,playTime;

    var animationList = [];

    var postObject = [];
    var postData;
    var previewObject = [];

    // 非线编核心类
    function TargetTrackCore() {
        function point() {
            this.x = 0;
            this.y = 0;
            this.time = 0;
            this.type = 'start';
        }
        function target() {
            this.width = 0;
            this.height = 0;
            this.isEllipse = true;
            this.track = [];
            this.el = null;
            this.name = null;
            this.addPoint = function () {
                var tmp = new point();
                this.track.push(tmp);
                return tmp;
            };
        }
        this.targets = [];
        this.createTarget = function () {
            var tmp = new target();
            this.targets.push(tmp);
            return tmp;
        };
    }

    // 创建非线编对象
    var targetTrack = new TargetTrackCore();

    // 新增目标
    this.addTarget = function (name,isEllipse) {
        if(tg && tg.el){
            $.hide(tg.el);
        }
        tg = targetTrack.createTarget();
        tg.name = name;
        tg.isEllipse = isEllipse;
    };

    // 新增目标确认
    this.addTargetOK = function () {
        $.each(targetTrack.targets,function (k,v) {
            var o = {};
            o.width = v.width / bgRect.width;
            o.height = v.height / bgRect.height;
            o.isEllipse = v.isEllipse;
            o.name = v.name;
            o.track = [];
            var _v = v;
            $.each(v.track,function (k,v) {
                var _o = {};
                _o.time = v.time;
                _o.x = (v.x + _v.width / 2)/ bgRect.width;
                _o.y = (v.y + _v.height / 2)/ bgRect.height;
                _o.type = v.type;
                o.track.push(_o);
            });
            postObject.push(o);
        });
        postData = JSON.stringify(postObject);
    };

    // 添加起点
    this.addStartPoint = function () {

        bgRect = bg.getBoundingClientRect();
        bg.style.cursor = 'crosshair';

        media.pause();

        tgP = tg.addPoint();
        tgP.time = media.currentTime();
        tgP.type = 'start';

        var throttle2 = new $.Throttle(30,function (arg) {
            var x = arg[0].clientX - bgRect.left,
                y = arg[0].clientY - bgRect.top;
            x = x>elDownX?x>=bgRect.width?bgRect.width-2:x:x<0?0:x;
            y = y>elDownY?y>=bgRect.height?bgRect.height-2:y:y<0?0:y;
            tgP.x = tgElL = x<elDownX?x:elDownX;
            tgP.y = tgElT = y<elDownY?y:elDownY;
            $.setLT(tg.el,tgElL,tgElT);
            tg.width = tgElW = Math.abs(x - elDownX);
            tg.height = tgElH = Math.abs(y - elDownY);
            $.setWH(tg.el,tgElW,tgElH);
        });
        var throttle3 = new $.Throttle(30,function (arg) {
            var x = arg[0].clientX - tgElDownX,
                y = arg[0].clientY - tgElDownY;
            tgP.x = tgElMoveL = tgElL + x;
            tgP.y = tgElMoveT = tgElT + y;
            $.setLT(tg.el,tgElMoveL,tgElMoveT);
        });

        $.addEvent(bg,'mousedown',function (e) {
            if(!tg.el){
                tg.el = $.create('div');
                $.css(tg.el,{
                    position:'absolute',
                    border:'1px solid #FF3838',
                    'border-radius':tg.isEllipse?'50%':0
                });

                bg.appendChild(tg.el);
                elDownX = e.clientX - bgRect.left;
                elDownY = e.clientY - bgRect.top;
                $.setLT(tg.el,elDownX,elDownY);
                function move(e) {
                    $.cannotSelect();
                    throttle2.filter(arguments);
                }
                function up() {
                    $.delEvent(document,'mousemove',move);
                    $.delEvent(document,'mouseup',up);
                    bg.style.cursor = 'default';
                    tg.el.style.cursor = 'move';
                    $.addEvent(tg.el,'mousedown',function (e) {
                        tgElDownX = e.clientX;
                        tgElDownY = e.clientY;
                        function move2(e) {
                            $.cannotSelect();
                            throttle3.filter(arguments);
                        }
                        function up2() {
                            $.delEvent(document,'mousemove',move2);
                            $.delEvent(document,'mouseup',up2);
                            tgElL = tgElMoveL;
                            tgElT = tgElMoveT;
                        }
                        $.addEvent(document,'mousemove',move2);
                        $.addEvent(document,'mouseup',up2);
                    });
                }
                $.addEvent(document,'mousemove',move);
                $.addEvent(document,'mouseup',up);
            }
        });
    };

    // 添加起点确认
    this.addStartPointOK = function () {
        $.hide(tg.el);
        media.play();
    };

    // 添加终点
    this.addEndPoint = function () {
        $.show(tg.el);
        media.pause();
        tgP = tg.addPoint();
        tgP.time = media.currentTime();
        tgP.type = 'end';
    };

    // 添加终点确认
    this.addEndPointOK = function () {
        $.hide(tg.el);
        media.play();
    };
    
    // 导出数据
    this.exportData = function () {
        return postData;
    };
    
    // 预览
    function makePreviewObject() {
        bgRect = bg.getBoundingClientRect();
        for(var i=0;i<postObject.length;i++){
            var o = {};
            o.width = postObject[i].width * bgRect.width;
            o.height = postObject[i].height * bgRect.height;
            o.isEllipse = postObject[i].isEllipse;
            o.name = postObject[i].isEllipse;

            o.el = targetTrack.targets[i].el;
            o.el.style.width = o.width + 'px';
            o.el.style.height = o.height + 'px';

            o.track = [];
            $.each(postObject[i].track,function (k,v) {
                var _o = {};
                _o.time = v.time;
                _o.x = v.x * bgRect.width - o.width / 2;
                _o.y = v.y * bgRect.height - o.height / 2;
                _o.type = v.type;
                o.track.push(_o);
            });
            previewObject.push(o);
        }
    }
    function LT2(el,bxy,exy,obj,prop,begin,end,callback) {

        var i;
        var dx = exy[0] - bxy[0];
        var dy = exy[1] - bxy[1];

        this.el = el;
        this.begin = begin;
        this.end = end;

        var tmp;
        this.run = function () {
            i = setInterval(function () {
                if(obj[prop]<begin){
                    return;
                }
                else if(obj[prop]<=end){
                    el.style.display = 'block';
                    tmp = (obj[prop] - begin)/(end - begin);
                    el.style.left = tmp * dx + bxy[0] + 'px';
                    el.style.top = tmp * dy + bxy[1] + 'px';
                }
                else{
                    //clearInterval(i);
                    callback && callback();
                }
            },50/3);
        };
        this.clear = function () {
            clearInterval(i);
        };
    }
    function Animation(el,pos1,pos2,obj,prop,begin,end,callback) {
        this.el = el;
        this.lt = new LT2(el,pos1,pos2,obj,prop,begin,end,callback);
    }
    function getAnimationList() {
        animationList = [];
        $.each(previewObject,function (k,v) {
            var el = v.el;
            var list = [];
            var tmp = false;
            $.each(v.track,function (k2,v2) {
                if(v2.type === 'start'){
                    tmp && list.push(tmp);
                    tmp = [];
                }
                tmp.push({
                    time:v2.time,
                    x:v2.x,
                    y:v2.y
                });
            });
            list.push(tmp);
            $.each(list,function (k3,v3) {
                $.each(v3.length - 1,function (k4,v4) {
                    animationList.push(new Animation(el,[v3[k4].x,v3[k4].y],[v3[k4 + 1].x,v3[k4 + 1].y],media.video,'currentTime',v3[k4].time,v3[k4 + 1].time,function () {
                        if(k4 === v3.length - 2){
                            $.hide(el);
                        }
                    }));
                });
            });
        });
    }
    function getTargetMinTime() {
        minTime = 1008601;
        if(targetTrack.targets.length === 0){
            return 0;
        }
        $.each(targetTrack.targets,function (k,v) {
            $.each(v.track,function (k2,v2) {
                if(v2.time < minTime){
                    minTime = v2.time;
                }
            });
        });
    }
    this.preview = function () {
        makePreviewObject();
        getAnimationList();
        getTargetMinTime();

        media.video.currentTime = minTime - 0.01 < 0? 0:minTime - 0.01 ;
        media.play();
        $.each(animationList,function (k,v) {
            v.lt.run();
        });
    };

    //重新编辑
    this.reEdit = function () {
        targetTrack.targets = [];
    };

};


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {


var $ = __webpack_require__(0);

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

/***/ })
/******/ ]);
//# sourceMappingURL=KMedia.js.map