var $ = require('./lib/Util');
var Media = require('./lib/Media');
var MediaRT = require('./lib/MediaRT');


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