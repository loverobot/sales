var expect = require('chai').expect;
var letter = require('../test/letter.js');

describe('测试字符长度：', function() {
    it('数字1的长度应该等于1', function() {
        expect(letter.len(1)).to.be.equal(1);
    });
    it('数字1314的长度应该等于4', function() {
        expect(letter.len(1314)).to.be.equal(4);
    });
    it('中文“我爱你”长度应该等于3', function() {
        expect(letter.len('我爱你')).to.be.equal(3);
    });
    it('love you长度应该等于7', function() {
        expect(letter.len('love you')).to.be.equal(7);
    });
});
