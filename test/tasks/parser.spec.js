var expect = require('expect.js');
var helper = require('./helper');
var parser = require('../../lib/parser');

describe('parse cjs code', function () {
    it('should generate ast', function () {
        var ast = parser.getAst(helper.readFile('a.js'));
        expect(ast).to.be.ok();
    });

    it('sholud get empty deps', function () {
        var ast = parser.getAst(helper.readFile('a.js'));
        var deps = parser.parseDeps(ast);
        expect(deps).to.have.length(0);
    });

    it('sholud return require dep ids', function () {
        var ast = parser.getAst(helper.readFile('b.js'));
        var deps = parser.parseDeps(ast);
        expect(deps).to.eql(['./a', 'util', '../a/Person', 'fs']);
    });

    it('sholud return dep absolute ids', function () {
        var ast = parser.getAst(helper.readFile('b.js'));
        var deps = parser.parseDeps(ast, 'test/a');
        expect(deps).to.eql(['test/a', 'util', 'a/Person', 'fs']);

        var deps = parser.parseDeps(ast, 'main');
        expect(deps).to.eql(['a', 'util', '../a/Person', 'fs']);
    });
});
