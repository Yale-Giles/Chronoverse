// Math helper functions for tests

function percentageOf(amount, bps) {
    return (amount * bps) / 10000;
}

function toPercentage(bps) {
    return (bps / 100).toFixed(2) + "%";
}

function sumArray(arr) {
    return arr.reduce((a, b) => a + b, 0);
}

function validatePercentageSum(percentages) {
    return sumArray(percentages) === 10000;
}

module.exports = {
    percentageOf,
    toPercentage,
    sumArray,
    validatePercentageSum
};

