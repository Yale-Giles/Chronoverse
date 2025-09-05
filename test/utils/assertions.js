const { expect } = require("chai");

function expectRevert(promise, message) {
    return expect(promise).to.be.revertedWith(message);
}

function expectEvent(receipt, eventName) {
    return expect(receipt).to.emit(receipt.contract, eventName);
}

function expectBigNumberEqual(actual, expected) {
    return expect(actual.toString()).to.equal(expected.toString());
}

module.exports = {
    expectRevert,
    expectEvent,
    expectBigNumberEqual
};

