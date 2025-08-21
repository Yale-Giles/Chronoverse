// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Constants
 * @dev Protocol-wide constants
 */
library Constants {
    uint256 internal constant MIN_UNLOCK_DELAY = 1 days;
    uint256 internal constant MAX_UNLOCK_DELAY = 100 * 365 days;
    uint256 internal constant PERCENTAGE_BASE = 10000;
    uint256 internal constant MAX_HEIRS = 50;
    uint256 internal constant DEFAULT_INACTIVITY_PERIOD = 90 days;
    uint256 internal constant MIN_INACTIVITY_PERIOD = 30 days;
    uint256 internal constant MAX_INACTIVITY_PERIOD = 730 days;
    uint256 internal constant DEFAULT_GRACE_PERIOD = 7 days;
}

