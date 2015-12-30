<!-- for: ${{modules}} as ${{item}}, ${{index}} -->
<!-- if: !${{index}} -->
var _exports = {};
var _module = {exports: _exports};
<!-- else -->
_exports = {};
_module = {exports: _exports};
<!-- /if -->
(function (module, exports, require) {
    ${{item.code|raw}}
})(_module, _exports, _require);
${{globalVarName}}${{item.namespace|raw}} = _module.exports;
<!-- /for -->
