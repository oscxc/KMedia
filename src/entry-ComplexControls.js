var $ = require('./lib/Util');

window.VideoControls = function (cfg) {
    var media = cfg.media;
    var container = media.container;

    //控制条容器
    var panel = $.create('div');
    $.css(panel,{
        position:'absolute',
        width:'inherit',
        height:'40px',
        background:'rgba(0,0,0,0.4)',
        bottom:0
    });


    //中间7个按钮容器  停止、帧退、慢速、（播放|暂停）、快速、帧进、循环
    var centerPanel = $.create('div',{
        'class':'kmedia-center-panel'
    });
    var stop = $.createSvgIcon({
        data:'M18,18H6V6H18V18Z'
    });
    var previousFrame = $.createSvgIcon({
        data:'M6,18V6H8V18H6M9.5,12L18,6V18L9.5,12Z'
    });
    var lowSpeed = $.createSvgIcon({
        data:'M19,5V19H16V5M14,5V19L3,12'
    });
    var play_data = 'M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5L16,12L10,7.5V16.5Z';
    var pause_data = 'M13,16V8H15V16H13M9,16V8H11V16H9M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z';
    var playOrPause = $.createSvgIcon({
        data:play_data
    });
    var fastSpeed = $.createSvgIcon({
        data:'M5,5V19H8V5M10,5V19L21,12'
    });
    var nextFrame = $.createSvgIcon({
        data:'M16,18H18V6H16M6,18L14.5,12L6,6V18Z'
    });
    var loop = $.createSvgIcon({
        data:'M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z'
    });
    $.css(playOrPause,{
        width:'40px',
        height:'40px',
    });
    [stop,previousFrame,lowSpeed,fastSpeed,nextFrame,loop].forEach(function (t) {
        $.css(t,{
            width:'24px',
            height:'24px',
            top:'-8px'
        });
    });

    var rightPanel = $.create('div',{
        'class':'kmedia-right-panel'
    });

    //--------------------------------------------------事件
    //播放暂停
    $.click(playOrPause,function () {
        if(media.playing){
            media.pause();
            $.setSvgData(playOrPause,play_data);
        }
        else{
            media.play();
            $.setSvgData(playOrPause,pause_data);
        }
    });
    //停止
    $.click(stop,function () {
        media.stop();
        $.setSvgData(playOrPause,play_data);
    });

    //--------------------------------------------------show controls
    this.show = function () {
        $.createTree({
            el:container,
            childs:[
                {
                    el:panel,
                    childs:[
                        {
                            el:centerPanel,
                            childs:[
                                {
                                    el:stop
                                },
                                {
                                    el:previousFrame
                                },
                                {
                                    el:lowSpeed
                                },
                                {
                                    el:playOrPause
                                },
                                {
                                    el:fastSpeed
                                },
                                {
                                    el:nextFrame
                                },
                                {
                                    el:loop
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    };
};
