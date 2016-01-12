var path = require('path');
var expect = require('expect.js');
var helper = require('./helper');
var converter = require('../../lib/converter');

describe('CommonJS Module to IFFE code', function () {
    it('should convert', function () {
        expect(converter({
            dir: path.join(__dirname, '..', 'fixtures', 'cjs1'),
            main: 'a' ,
            output: path.join(__dirname, '..', 'fixtures', 'combine.js')
        })).to.eql(helper.readFile('combine.js'));
    });

    it('should export globa variable', function () {
        expect(converter({
            dir: path.join(__dirname, '..', 'fixtures', 'cjs1'),
            main: 'a' ,
            exports: 'myGlobalObj' // ,
            // output: path.join(__dirname, '..', 'fixtures', 'combine_exports.js')
        })).to.eql(helper.readFile('combine_exports.js'));
    });

    it('should compress converted code', function () {
        expect(converter({
            dir: path.join(__dirname, '..', 'fixtures', 'cjs1'),
            main: 'a',
            compress: true // ,
            // output: path.join(__dirname, '..', 'fixtures', 'combine.min.js')
        })).to.eql(helper.readFile('combine.min.js'));
    });

    it('should throw exception when dep circle appear', function () {
        var fn = function () {
            converter({
                dir: path.join(__dirname, '..', 'fixtures', 'cjs1'),
                main: 'circle',
                compress: true
            })
        };
        expect(fn).to.throwException('Unexpected circle deps cannot resolve');
    });
});
