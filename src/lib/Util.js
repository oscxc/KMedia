
var Ajax = require('./Ajax');

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
