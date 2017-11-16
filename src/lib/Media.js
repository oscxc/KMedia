var $ = require('./Util');
var TargetTrack = require('./TargetTrack');

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