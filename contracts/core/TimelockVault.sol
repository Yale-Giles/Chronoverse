// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/ITimelockVault.sol";
import "../libraries/VaultLib.sol";
import "../libraries/VaultErrors.sol";

/**
 * @title TimelockVault
 * @dev Manages time-based and block-based unlock mechanisms
 */
contract TimelockVault is ITimelockVault, AccessControl, ReentrancyGuard {
    
    using VaultLib for *;
    
    bytes32 public constant VAULT_MANAGER_ROLE = keccak256("VAULT_MANAGER_ROLE");
    
    struct TimeLockConfig {
        uint256 unlockTime;
        uint256 unlockBlock;
        bool isTriggered;
        uint256 triggerTime;
        address triggeredBy;
    }
    
    mapping(uint256 => TimeLockConfig) private _timeLocks;
    
    constructor(address vaultManager) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VAULT_MANAGER_ROLE, vaultManager);
    }
    
    /**
     * @dev Schedules unlock for a vault
     */
    function scheduleUnlock(
        uint256 vaultId,
        uint256 unlockTime,
        uint256 unlockBlock
    ) external override onlyRole(VAULT_MANAGER_ROLE) {
        
        if (unlockTime == 0 && unlockBlock == 0) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        _timeLocks[vaultId] = TimeLockConfig({
            unlockTime: unlockTime,
            unlockBlock: unlockBlock,
            isTriggered: false,
            triggerTime: 0,
            triggeredBy: address(0)
        });
        
        emit UnlockScheduled(vaultId, unlockTime, unlockBlock);
    }
    
    /**
     * @dev Triggers unlock if conditions are met
     */
    function triggerUnlock(uint256 vaultId) external override nonReentrant returns (bool) {
        TimeLockConfig storage timeLock = _timeLocks[vaultId];
        
        if (timeLock.unlockTime == 0 && timeLock.unlockBlock == 0) {
            revert VaultErrors.VaultNotFound(vaultId);
        }
        
        if (timeLock.isTriggered) {
            return true;
        }
        
        if (!isUnlockable(vaultId)) {
            revert VaultErrors.VaultNotUnlockable(vaultId);
        }
        
        timeLock.isTriggered = true;
        timeLock.triggerTime = block.timestamp;
        timeLock.triggeredBy = msg.sender;
        
        emit UnlockTriggered(vaultId, msg.sender, block.timestamp);
        
        return true;
    }
    
    /**
     * @dev Checks if vault is unlockable based on time/block conditions
     */
    function isUnlockable(uint256 vaultId) public view override returns (bool) {
        TimeLockConfig storage timeLock = _timeLocks[vaultId];
        
        bool timeCondition = timeLock.unlockTime == 0 || VaultLib.isTimeUnlocked(timeLock.unlockTime);
        bool blockCondition = timeLock.unlockBlock == 0 || VaultLib.isBlockUnlocked(timeLock.unlockBlock);
        
        return timeCondition && blockCondition;
    }
    
    /**
     * @dev Returns the unlock time for a vault
     */
    function getUnlockTime(uint256 vaultId) external view override returns (uint256) {
        return _timeLocks[vaultId].unlockTime;
    }
    
    /**
     * @dev Returns the unlock block for a vault
     */
    function getUnlockBlock(uint256 vaultId) external view override returns (uint256) {
        return _timeLocks[vaultId].unlockBlock;
    }
    
    /**
     * @dev Returns complete timelock configuration
     */
    function getTimeLockConfig(uint256 vaultId) external view returns (TimeLockConfig memory) {
        return _timeLocks[vaultId];
    }
    
    /**
     * @dev Returns if unlock has been triggered
     */
    function isTriggered(uint256 vaultId) external view returns (bool) {
        return _timeLocks[vaultId].isTriggered;
    }
    
    /**
     * @dev Returns time remaining until unlock
     */
    function getTimeRemaining(uint256 vaultId) external view returns (uint256) {
        TimeLockConfig storage timeLock = _timeLocks[vaultId];
        if (timeLock.unlockTime == 0 || block.timestamp >= timeLock.unlockTime) {
            return 0;
        }
        return timeLock.unlockTime - block.timestamp;
    }
}

