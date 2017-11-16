
var Promise = require('./Promise');

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
