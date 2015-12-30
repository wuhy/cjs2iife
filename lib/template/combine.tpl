(function (window) {

    /**
     * require 定义
     *
     * @param {string} id 要 require 的模块的绝对 id
     * @return {*}
     * @private
     */
    var _require = function (id) {
        var segments = id.split('/');
        var value = window;
        for (var i = 0, len = segments.length; i < len; i++) {
            var key = segments[i];
            if (key) {
                value = value[key];
            }
        }
        return value;
    };

    // 所有用到的名称空间定义
    var ${{globalVarName}} = ${{namespaceDefine|raw}};

    // 所有模块的定义
    ${{moduleDefines|raw}}
})(window);
