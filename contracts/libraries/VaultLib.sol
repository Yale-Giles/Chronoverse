// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./VaultErrors.sol";

/**
 * @title VaultLib
 * @dev Library with utility functions for vault operations
 */
library VaultLib {
    
    uint256 private constant PERCENTAGE_BASE = 10000; // 100.00%
    uint256 private constant MAX_HEIRS = 50;
    
    /**
     * @dev Validates that percentages sum to 100%
     */
    function validatePercentages(uint256[] memory percentages) internal pure returns (bool) {
        uint256 total = 0;
        for (uint256 i = 0; i < percentages.length; i++) {
            total += percentages[i];
        }
        if (total != PERCENTAGE_BASE) {
            revert VaultErrors.InvalidPercentageSum(total);
        }
        return true;
    }
    
    /**
     * @dev Validates array lengths match
     */
    function validateArrayLengths(uint256 length1, uint256 length2) internal pure {
        if (length1 != length2) {
            revert VaultErrors.ArrayLengthMismatch(length1, length2);
        }
    }
    
    /**
     * @dev Validates address is not zero
     */
    function validateAddress(address addr) internal pure {
        if (addr == address(0)) {
            revert VaultErrors.ZeroAddress();
        }
    }
    
    /**
     * @dev Validates array is not empty
     */
    function validateNotEmpty(uint256 length) internal pure {
        if (length == 0) {
            revert VaultErrors.EmptyArray();
        }
    }
    
    /**
     * @dev Checks if unlock time has been reached
     */
    function isTimeUnlocked(uint256 unlockTime) internal view returns (bool) {
        return block.timestamp >= unlockTime;
    }
    
    /**
     * @dev Checks if unlock block has been reached
     */
    function isBlockUnlocked(uint256 unlockBlock) internal view returns (bool) {
        return block.number >= unlockBlock;
    }
    
    /**
     * @dev Calculates distribution amount based on percentage
     */
    function calculateDistribution(uint256 totalAmount, uint256 percentage) internal pure returns (uint256) {
        return (totalAmount * percentage) / PERCENTAGE_BASE;
    }
    
    /**
     * @dev Gets the percentage base constant
     */
    function getPercentageBase() internal pure returns (uint256) {
        return PERCENTAGE_BASE;
    }
    
    /**
     * @dev Gets the max heirs constant
     */
    function getMaxHeirs() internal pure returns (uint256) {
        return MAX_HEIRS;
    }
}

