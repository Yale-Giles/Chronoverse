// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ITimelockVault
 * @dev Interface for time-based vault locking mechanism
 */
interface ITimelockVault {
    
    event UnlockScheduled(
        uint256 indexed vaultId,
        uint256 unlockTime,
        uint256 unlockBlock
    );
    
    event UnlockTriggered(
        uint256 indexed vaultId,
        address indexed triggeredBy,
        uint256 timestamp
    );
    
    function scheduleUnlock(
        uint256 vaultId,
        uint256 unlockTime,
        uint256 unlockBlock
    ) external;
    
    function triggerUnlock(uint256 vaultId) external returns (bool);
    
    function isUnlockable(uint256 vaultId) external view returns (bool);
    
    function getUnlockTime(uint256 vaultId) external view returns (uint256);
    
    function getUnlockBlock(uint256 vaultId) external view returns (uint256);
}

