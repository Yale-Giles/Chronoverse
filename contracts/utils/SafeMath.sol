// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SafeMath
 * @dev Additional math utilities for percentage calculations
 */
library SafeMath {
    
    /**
     * @dev Safely calculates percentage with rounding
     */
    function percentageOf(uint256 amount, uint256 bps) internal pure returns (uint256) {
        return (amount * bps) / 10000;
    }
    
    /**
     * @dev Checks if percentage sum equals 100%
     */
    function isValidPercentageSum(uint256[] memory percentages) internal pure returns (bool) {
        uint256 sum = 0;
        for (uint256 i = 0; i < percentages.length; i++) {
            sum += percentages[i];
        }
        return sum == 10000;
    }
    
    /**
     * @dev Calculates remaining percentage
     */
    function remainingPercentage(uint256[] memory allocated) internal pure returns (uint256) {
        uint256 sum = 0;
        for (uint256 i = 0; i < allocated.length; i++) {
            sum += allocated[i];
        }
        return 10000 - sum;
    }
}

