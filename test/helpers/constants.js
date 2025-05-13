const ONE_DAY = 24 * 60 * 60;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 365 * ONE_DAY;

const PERCENTAGE_BASE = 10000;
const MAX_HEIRS = 50;

const VAULT_STATUS = {
    ACTIVE: 0,
    LOCKED: 1,
    UNLOCKED: 2,
    FINALIZED: 3,
    CANCELLED: 4
};

module.exports = {
    ONE_DAY,
    ONE_WEEK,
    ONE_MONTH,
    ONE_YEAR,
    PERCENTAGE_BASE,
    MAX_HEIRS,
    VAULT_STATUS
};

