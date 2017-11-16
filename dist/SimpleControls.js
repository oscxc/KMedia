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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */,
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);
var osrange = __webpack_require__(8);

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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// osrange.js
// author：七八个星天怪
// LICENSE：MIT


(function (f) {
    if (typeof module === "object" && typeof module.exports === "object"){
        module.exports = f;
    }
    else{
        window.osrange = f;
    }
})(function (mycfg) {
    function extend(t,o) {
        for(var n in o){
            t[n]=o[n] ;
        }
    }
    function createDiv() {
        return document.createElement('div');
    }
    function css(el,obj) {
        for(var k in obj){
            el.style[k] = obj[k];
        }
    }

    var cfg = {
        el:null,
        range:[0,1],
        value:0,
        control:true,
        callback:null
    };
    extend(cfg,mycfg);

    var bg = cfg.el;
    bg.style.cursor = 'default';
    var min = cfg.range[0];
    var max = cfg.range[1];
    var value = cfg.value;
    var cb = cfg.callback;

    var dv = max - min;
    var p = (value - min) / dv;

    function getVal() {
        return (value = p * dv + min);
    }

    var progress = createDiv();

    function setW() {
        progress.style.width = p * 100 + '%';
    }
    css(progress,{
        position:'relative',
        height: 'inherit',
    });
    setW();
    cb && cb(getVal());

    if(cfg.control){
        bg.style.cursor = 'pointer';

        var ball = createDiv();
        var h = bg.clientHeight;
        var ballWH = h * 2;

        css(ball,{
            position:'absolute',
            width: ballWH + 'px',
            height: ballWH + 'px',
            right: -ballWH / 2 + 'px',
            top: (h - ballWH) / 2 + 'px'
        });

        progress.appendChild(ball);

        ball.onmousedown = bg.onmousedown = function (e) {
            e.stopPropagation();
            var rect = bg.getBoundingClientRect();

            document.onmousemove = (function handle(e) {
                p = (e.clientX - rect.left) / rect.width;
                p = p < 0 ? 0 : p > 1 ? 1 : p;
                setW();
                cb && cb(getVal());
                return handle;
            })(e);
            document.onmouseup = function () {
                document.onmousemove = null;
            };
        };
    }

    bg.appendChild(progress);

    this.setValue = function (val) {
        value = val < min ? min : val > max ? max : val;
        p = (value - min) / dv;
        setW();
    };
    this.getValue = function () {
        return value;
    };
});



/***/ })
/******/ ]);
//# sourceMappingURL=SimpleControls.js.map