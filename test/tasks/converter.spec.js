var path = require('path');
var expect = require('expect.js');
var helper = require('./helper');
var converter = require('../../lib/converter');

describe('CommonJS Module to IFFE code', function () {
    it('should convert', function () {
        expect(converter({
            dir: path.join(__dirname, '..', 'fixtures', 'cjs1'),
            main: 'a' // ,
            // output: path.join(__dirname, '..', 'fixtures', 'combine.js')
        })).to.eql(helper.readFile('combine.js'));
    });

    it('should compress converted code', function () {
        expect(converter({
            dir: path.join(__dirname, '..', 'fixtures', 'cjs1'),
            main: 'a',
            compress: true
        })).to.eql(helper.readFile('combine.min.js'));
    });
});
