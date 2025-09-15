// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IProofOfLife.sol";
import "../libraries/VaultErrors.sol";

/**
 * @title ProofOfLife
 * @dev Manages proof-of-life verification to prevent premature vault unlocks
 */
contract ProofOfLife is IProofOfLife, AccessControl {
    
    bytes32 public constant VAULT_MANAGER_ROLE = keccak256("VAULT_MANAGER_ROLE");
    
    uint256 public constant DEFAULT_INACTIVITY_PERIOD = 90 days;
    uint256 public constant MIN_INACTIVITY_PERIOD = 30 days;
    uint256 public constant MAX_INACTIVITY_PERIOD = 730 days;
    uint256 public constant DEFAULT_GRACE_PERIOD = 7 days;
    
    mapping(uint256 => LifeStatus) private _lifeStatus;
    mapping(uint256 => address) private _vaultOwners;
    
    constructor(address vaultManager) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VAULT_MANAGER_ROLE, vaultManager);
    }
    
    /**
     * @dev Initializes proof-of-life for a vault
     */
    function initialize(uint256 vaultId, address owner, uint256 inactivityPeriod) 
        external 
        onlyRole(VAULT_MANAGER_ROLE) 
    {
        if (inactivityPeriod == 0) {
            inactivityPeriod = DEFAULT_INACTIVITY_PERIOD;
        }
        
        if (inactivityPeriod < MIN_INACTIVITY_PERIOD || inactivityPeriod > MAX_INACTIVITY_PERIOD) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        _vaultOwners[vaultId] = owner;
        _lifeStatus[vaultId] = LifeStatus({
            lastCheckIn: block.timestamp,
            inactivityPeriod: inactivityPeriod,
            isActive: true,
            gracePeriod: DEFAULT_GRACE_PERIOD
        });
    }
    
    /**
     * @dev Owner checks in to prove they are still active
     */
    function checkIn(uint256 vaultId) external override {
        LifeStatus storage status = _lifeStatus[vaultId];
        
        if (_vaultOwners[vaultId] != msg.sender) {
            revert VaultErrors.UnauthorizedAccess(msg.sender, vaultId);
        }
        
        if (!status.isActive) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        status.lastCheckIn = block.timestamp;
        
        emit CheckedIn(msg.sender, vaultId, block.timestamp);
    }
    
    /**
     * @dev Marks an owner as inactive after inactivity period
     */
    function markInactive(address owner, uint256 vaultId) external override {
        LifeStatus storage status = _lifeStatus[vaultId];
        
        if (_vaultOwners[vaultId] != owner) {
            revert VaultErrors.UnauthorizedAccess(owner, vaultId);
        }
        
        if (status.isActive && 
            block.timestamp >= status.lastCheckIn + status.inactivityPeriod + status.gracePeriod) {
            
            status.isActive = false;
            
            emit MarkedInactive(owner, vaultId, block.timestamp);
        } else {
            revert VaultErrors.ProofOfLifeStillActive(status.lastCheckIn);
        }
    }
    
    /**
     * @dev Checks if owner is still considered active
     */
    function isActive(uint256 vaultId) external view override returns (bool) {
        LifeStatus storage status = _lifeStatus[vaultId];
        
        if (!status.isActive) {
            return false;
        }
        
        return block.timestamp < status.lastCheckIn + status.inactivityPeriod + status.gracePeriod;
    }
    
    /**
     * @dev Sets or updates the inactivity period
     */
    function setInactivityPeriod(uint256 vaultId, uint256 period) external override {
        if (_vaultOwners[vaultId] != msg.sender) {
            revert VaultErrors.UnauthorizedAccess(msg.sender, vaultId);
        }
        
        if (period < MIN_INACTIVITY_PERIOD || period > MAX_INACTIVITY_PERIOD) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        LifeStatus storage status = _lifeStatus[vaultId];
        uint256 oldPeriod = status.inactivityPeriod;
        status.inactivityPeriod = period;
        
        emit InactivityPeriodUpdated(vaultId, oldPeriod, period);
    }
    
    /**
     * @dev Returns the last check-in timestamp
     */
    function getLastCheckIn(uint256 vaultId) external view override returns (uint256) {
        return _lifeStatus[vaultId].lastCheckIn;
    }
    
    /**
     * @dev Returns remaining time until inactivity
     */
    function getRemainingTime(uint256 vaultId) external view override returns (uint256) {
        LifeStatus storage status = _lifeStatus[vaultId];
        
        uint256 inactivityTime = status.lastCheckIn + status.inactivityPeriod + status.gracePeriod;
        
        if (block.timestamp >= inactivityTime) {
            return 0;
        }
        
        return inactivityTime - block.timestamp;
    }
    
    /**
     * @dev Returns complete life status for a vault
     */
    function getLifeStatus(uint256 vaultId) external view returns (LifeStatus memory) {
        return _lifeStatus[vaultId];
    }
    
    /**
     * @dev Returns vault owner
     */
    function getVaultOwner(uint256 vaultId) external view returns (address) {
        return _vaultOwners[vaultId];
    }
    
    /**
     * @dev Checks if grace period is active
     */
    function isGracePeriodActive(uint256 vaultId) external view returns (bool) {
        LifeStatus storage status = _lifeStatus[vaultId];
        uint256 inactiveTime = status.lastCheckIn + status.inactivityPeriod;
        return block.timestamp >= inactiveTime && block.timestamp < inactiveTime + status.gracePeriod;
    }
}

