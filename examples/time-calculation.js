// Example: Time calculation helpers
const ONE_DAY = 24 * 60 * 60;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;

function calculateUnlockTime(daysFromNow) {
    const now = Math.floor(Date.now() / 1000);
    return now + (daysFromNow * ONE_DAY);
}

function getUnlockDate(unlockTimestamp) {
    return new Date(unlockTimestamp * 1000);
}

function formatTimeRemaining(seconds) {
    const days = Math.floor(seconds / ONE_DAY);
    const hours = Math.floor((seconds % ONE_DAY) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    
    return `${days}d ${hours}h ${minutes}m`;
}

// Examples
console.log("Time Calculation Examples");
console.log("========================\n");

const oneYearFromNow = calculateUnlockTime(365);
console.log(`1 year from now: ${getUnlockDate(oneYearFromNow).toLocaleString()}`);
console.log(`Unix timestamp: ${oneYearFromNow}\n`);

const remaining = ONE_YEAR;
console.log(`Format 1 year: ${formatTimeRemaining(remaining)}`);

module.exports = {
    calculateUnlockTime,
    getUnlockDate,
    formatTimeRemaining,
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    ONE_YEAR
};

