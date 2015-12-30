var expect = require('expect.js');
var helper = require('./helper');
var util = require('../../lib/util');

describe('utilities', function () {
    it('should convert moudle id to array accessor', function () {
        expect(util.id2VarAccessor('')).to.eql('');
        expect(util.id2VarAccessor('a')).to.eql('[\'a\']');
        expect(util.id2VarAccessor('a/b')).to.eql('[\'a\'][\'b\']');
    });

});
