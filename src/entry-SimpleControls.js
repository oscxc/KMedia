var $ = require('./lib/Util');
var osrange = require('osrange');

window.SimpleControls = function (cfg) {
    var media = cfg.media;
    var container = media.container;

    //控制条容器
    var buttonPanel = $.create('div');
    $.css(buttonPanel,{
        position:'absolute',
        width:'inherit',
        height:'40px',
        background:'rgba(0,0,0,0.4)',
        bottom:0,
        'z-index':100
    });

    //播放暂停
    var playData = 'M8,5.14V19.14L19,12.14L8,5.14Z';
    var pauseData = 'M14,19H18V5H14M6,19H10V5H6V19Z';
    var playOrPause = $.createSvgIcon({
        data:playData,
        className:'playOrPause'
    });
    if(cfg.autoplay){
        $.setSvgData(playOrPause,pauseData);
        media.play();
    }
    $.click(playOrPause,function () {
        if(media.playing){
            media.pause();
            $.setSvgData(playOrPause,playData);
        }
        else{
            media.play();
            $.setSvgData(playOrPause,pauseData);
        }
    });

    //音量
    var volumeOnData = 'M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z';
    var volumeOffData = 'M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z';
    var volumeOnOrOff = $.createSvgIcon({
        data:volumeOnData,
        className:'volumeOnOrOff'
    });
    var volumeRange = $.create('input',{
        type:'range',
        'class':'volumeRange',
        value:100
    });
    $.addEvent(volumeRange,'change',function () {
        media.volume(this.value/100);
    });

    //全屏
    var fullScreenData = 'M5,5H10V7H7V10H5V5M14,5H19V10H17V7H14V5M17,14H19V19H14V17H17V14M10,17V19H5V14H7V17H10Z';
    var exitFullScreenData = 'M14,14H19V16H16V19H14V14M5,14H10V19H8V16H5V14M8,5H10V10H5V8H8V5M19,8V10H14V5H16V8H19Z';
    var fullScreen = $.createSvgIcon({
        data: fullScreenData,
        className: 'fullScreen'
    });
    $.click(fullScreen,function () {
        if(media.isFullScreen){
            media.exitFullScreen();
            $.setSvgData(fullScreen,fullScreenData);
        }
        else{
            media.fullScreen();
            $.setSvgData(fullScreen,exitFullScreenData);
        }
    });
    media.escClick = function () {
        $.setSvgData(fullScreen,fullScreenData);
    };

    //进度条
    var progressPanel = $.create('div');
    $.css(progressPanel,{
        position:'absolute',
        width:'inherit',
        height:'4px',
        bottom:'40px',
        'z-index':100
    });
    var progress = $.create('div',{
        'class':'kmediaProgress',
    });


    media.onload = function () {
        $.createTree({
            el:container,
            childs:[
                {
                    el:buttonPanel,
                    childs:[
                        {
                            el:playOrPause
                        },
                        {
                            el:volumeOnOrOff
                        },
                        {
                            el:volumeRange
                        },
                        {
                            el:fullScreen
                        }
                    ]
                },
                {
                    el:progressPanel,
                    childs:[
                        {
                            el:progress
                        }
                    ]
                }
            ]
        });
        var throttle = new $.Throttle(300,function (arg) {
            media.currentTime(arg[0]);
        });
        var range = new osrange({
            el:progress,
            range:[0,media.duration],
            value:0,
            callback:function (val) {
                throttle.filter(arguments);
            }
        });
        media.ontimeupdate = function (time) {
            range.setValue(time);
            if(media.currentTime() == media.duration){
                media.stop();
                $.setSvgData(playOrPause,playData);
            }
        };
    };
};
