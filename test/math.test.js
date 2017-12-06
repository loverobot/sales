//var assert = require('chai').assert;
var expect = require('chai').expect;
//var should = require('chai').should();

var math = require('../test/math.js');

describe('四则运算方法测试：', function() {
    it('1 加 1 应该等于 2', function() {
        expect(math.add(1, 1)).to.be.equal(2);
    });
    it('2 减 1 应该等于 1', function() {
        expect(math.sub(2, 1)).to.be.equal(1);
    });
    it('2 乘 6 应该等于 12', function() {
        expect(math.mul(2, 6)).to.be.equal(12);
    });
    it('10 除 2 应该等于 5', function() {
        expect(math.div(10, 2)).to.be.equal(5);
    });
});
