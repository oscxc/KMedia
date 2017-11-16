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
/******/ 	return __webpack_require__(__webpack_require__.s = 9);
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
/* 7 */,
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var $ = __webpack_require__(0);

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


/***/ })
/******/ ]);
//# sourceMappingURL=ComplexControls.js.map