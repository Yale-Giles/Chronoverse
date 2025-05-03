const { time } = require("@nomicfoundation/hardhat-network-helpers");

async function increaseTime(seconds) {
    await time.increase(seconds);
}

async function getLatestBlockTime() {
    return await time.latest();
}

async function setNextBlockTime(timestamp) {
    await time.setNextBlockTimestamp(timestamp);
}

module.exports = {
    increaseTime,
    getLatestBlockTime,
    setNextBlockTime
};

