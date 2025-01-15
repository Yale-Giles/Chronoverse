// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title TimeUtils
 * @dev Utility functions for time calculations
 */
library TimeUtils {
    
    uint256 private constant SECONDS_PER_DAY = 86400;
    uint256 private constant SECONDS_PER_HOUR = 3600;
    
    /**
     * @dev Converts days to seconds
     */
    function daysToSeconds(uint256 days) internal pure returns (uint256) {
        return days * SECONDS_PER_DAY;
    }
    
    /**
     * @dev Converts hours to seconds
     */
    function hoursToSeconds(uint256 hours) internal pure returns (uint256) {
        return hours * SECONDS_PER_HOUR;
    }
    
    /**
     * @dev Checks if a timestamp is in the past
     */
    function isPast(uint256 timestamp) internal view returns (bool) {
        return block.timestamp >= timestamp;
    }
    
    /**
     * @dev Checks if a timestamp is in the future
     */
    function isFuture(uint256 timestamp) internal view returns (bool) {
        return block.timestamp < timestamp;
    }
    
    /**
     * @dev Calculates time remaining until timestamp
     */
    function timeUntil(uint256 timestamp) internal view returns (uint256) {
        if (isPast(timestamp)) {
            return 0;
        }
        return timestamp - block.timestamp;
    }
    
    /**
     * @dev Calculates time elapsed since timestamp
     */
    function timeSince(uint256 timestamp) internal view returns (uint256) {
        if (isFuture(timestamp)) {
            return 0;
        }
        return block.timestamp - timestamp;
    }
}

