(function (window) {

    /**
     * get the given module id definition
     *
     * @param {string} id the absolute module id to require
     * @return {*}
     * @private
     */
    var _require = function (id) {
        var segments = id.split('/');
        var value = _global;
        for (var i = 0, len = segments.length; i < len; i++) {
            var key = segments[i];
            if (key) {
                value = value[key];
            }
        }
        return value;
    };

    // init the namespace
    var _global = {"common":{"c":{},"b":{}},"a":{}};
    
    window.myGlobalObj = _global;
    
    // all modules definition
    

var _exports = {};
var _module = {exports: _exports};

(function (module, exports, require) {
    var a = 33;
})(_module, _exports, _require);
_global['common']['c'] = _module.exports;


_exports = {};
_module = {exports: _exports};

(function (module, exports, require) {
    var c = require('common/c');
exports.hello = function () {
    var c = require('common/c');    // ...
};
})(_module, _exports, _require);
_global['common']['b'] = _module.exports;


_exports = {};
_module = {exports: _exports};

(function (module, exports, require) {
    /**
 * @file 入口模块
 */
exports.hello = function () {
    var b = require('common/b');
};
})(_module, _exports, _require);
_global['a'] = _module.exports;


})(window);
