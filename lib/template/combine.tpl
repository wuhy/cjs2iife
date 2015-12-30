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
        var value = ${{globalVarName}};
        for (var i = 0, len = segments.length; i < len; i++) {
            var key = segments[i];
            if (key) {
                value = value[key];
            }
        }
        return value;
    };

    // init the namespace
    var ${{globalVarName}} = ${{namespaceDefine|raw}};

    // all modules definition
    ${{moduleDefines|raw}}
})(window);
