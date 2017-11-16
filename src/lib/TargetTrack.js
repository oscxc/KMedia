var $ = require('./Util');

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
