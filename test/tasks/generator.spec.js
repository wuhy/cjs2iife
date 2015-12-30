var expect = require('expect.js');
var helper = require('./helper');
var parser = require('../../lib/parser');
var generator = require('../../lib/generator');

describe('geneartor', function () {
    it('should return ns define', function () {
        var modules = [];
        expect(generator.getNamespaceDefine(modules)).to.eql({});

        modules = [
            {id: 'a'}
        ];
        expect(generator.getNamespaceDefine(modules)).to.eql({a: {}});

        modules = [
            {id: 'a/b'}
        ];
        expect(generator.getNamespaceDefine(modules)).to.eql({a: {b: {}}});

        modules = [
            {id: 'a'},
            {id: 'a/b'}
        ];
        expect(generator.getNamespaceDefine(modules)).to.eql({a: {b: {}}, a1: {}});

        modules = [
            {id: 'a/b'},
            {id: 'a'},
            {id: 'c/d/a'}
        ];
        expect(generator.getNamespaceDefine(modules)).to.eql({
            c: {d: {a: {}}},
            a: {b: {}}, a1: {}
        });
    });

    it('should rewrite moudle id path', function () {
        var ast = parser.getAst('require(\'..\/a\/b\'); // hello');
        var result = generator.rewriteRequireModulePath(ast, 'c/b');
        expect(result).to.eql('require(\'a/b\');    // hello\n');

        var ast = parser.getAst('require(\'.\/a\/b\'); // hello');
        var result = generator.rewriteRequireModulePath(ast, 'c');
        expect(result).to.eql('require(\'a/b\');    // hello\n');
    });

    it('should generate iffe codes', function () {
        var modules = [];
        expect(generator.getModuleIFFECodes(modules)).to.eql('');

        modules = [{
            id: 'a/b',
            data: 'exports.hello = function () {};'
        }];
        expect(generator.getModuleIFFECodes(modules)).to.eql('\n\nvar _exports = {};\nvar _module = {exports: _exports};\n\n(function (module, exports, require) {\n    exports.hello = function () {};\n})(_module, _exports, _require);\n_global[\'a\'][\'b\'] = _module.exports;\n\n');

        modules = [{
            id: 'a/b/c',
            data: 'require(\'../d\');'
        }, {
            id: 'a',
            data: 'require(\'./d\');require(\'util\');'
        }];
        expect(generator.getModuleIFFECodes(modules)).to.eql('\n\nvar _exports = {};\nvar _module = {exports: _exports};\n\n(function (module, exports, require) {\n    require(\'../d\');\n})(_module, _exports, _require);\n_global[\'a\'][\'b\'][\'c\'] = _module.exports;\n\n\n_exports = {};\n_module = {exports: _exports};\n\n(function (module, exports, require) {\n    require(\'./d\');require(\'util\');\n})(_module, _exports, _require);\n_global[\'a\'] = _module.exports;\n\n');
    });
});
