// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "../interfaces/IVaultManager.sol";
import "../libraries/VaultLib.sol";
import "../libraries/VaultErrors.sol";

/**
 * @title VaultManager
 * @dev Main registry and interface for vault creation and management
 */
contract VaultManager is IVaultManager, Ownable, ReentrancyGuard {
    
    using VaultLib for *;
    
    // State variables
    uint256 private _vaultCounter;
    mapping(uint256 => VaultConfig) private _vaults;
    mapping(address => uint256[]) private _ownerVaults;
    
    // Constants
    uint256 public constant MIN_UNLOCK_DELAY = 1 days;
    uint256 public constant MAX_UNLOCK_DELAY = 100 * 365 days;
    
    // Events for better tracking
    event VaultUpdated(uint256 indexed vaultId, uint256 newUnlockTime);
    event VaultStatusChanged(uint256 indexed vaultId, VaultStatus oldStatus, VaultStatus newStatus);
    
    constructor() Ownable(msg.sender) {
        _vaultCounter = 0;
    }
    
    /**
     * @dev Creates a new vault with specified configuration
     */
    function createVault(
        uint256 unlockTime,
        uint256 unlockBlock,
        bool useProofOfLife,
        bool useOracle
    ) external override nonReentrant returns (uint256 vaultId) {
        // Validate unlock time
        if (unlockTime > 0) {
            if (unlockTime < block.timestamp + MIN_UNLOCK_DELAY) {
                revert VaultErrors.InvalidUnlockTime(unlockTime, block.timestamp);
            }
            if (unlockTime > block.timestamp + MAX_UNLOCK_DELAY) {
                revert VaultErrors.InvalidUnlockTime(unlockTime, block.timestamp);
            }
        }
        
        // Create new vault
        vaultId = ++_vaultCounter;
        
        _vaults[vaultId] = VaultConfig({
            owner: msg.sender,
            unlockTime: unlockTime,
            unlockBlock: unlockBlock,
            useProofOfLife: useProofOfLife,
            useOracle: useOracle,
            createdAt: block.timestamp,
            status: VaultStatus.Active
        });
        
        _ownerVaults[msg.sender].push(vaultId);
        
        emit VaultCreated(vaultId, msg.sender, unlockTime);
        
        return vaultId;
    }
    
    /**
     * @dev Closes an existing vault (only by owner before unlock)
     */
    function closeVault(uint256 vaultId) external override nonReentrant {
        VaultConfig storage vault = _vaults[vaultId];
        
        if (vault.owner == address(0)) {
            revert VaultErrors.VaultNotFound(vaultId);
        }
        
        if (vault.owner != msg.sender) {
            revert VaultErrors.UnauthorizedAccess(msg.sender, vaultId);
        }
        
        if (vault.status == VaultStatus.Finalized) {
            revert VaultErrors.VaultAlreadyFinalized(vaultId);
        }
        
        vault.status = VaultStatus.Cancelled;
        
        emit VaultClosed(vaultId, msg.sender);
    }
    
    /**
     * @dev Returns vault configuration
     */
    function getVault(uint256 vaultId) external view override returns (VaultConfig memory) {
        VaultConfig memory vault = _vaults[vaultId];
        if (vault.owner == address(0)) {
            revert VaultErrors.VaultNotFound(vaultId);
        }
        return vault;
    }
    
    /**
     * @dev Returns all vault IDs owned by an address
     */
    function getVaultsByOwner(address owner) external view override returns (uint256[] memory) {
        return _ownerVaults[owner];
    }
    
    /**
     * @dev Internal function to update vault status
     */
    function _updateVaultStatus(uint256 vaultId, VaultStatus newStatus) internal {
        VaultConfig storage vault = _vaults[vaultId];
        if (vault.owner == address(0)) {
            revert VaultErrors.VaultNotFound(vaultId);
        }
        vault.status = newStatus;
    }
    
    /**
     * @dev Returns the current vault counter
     */
    function getVaultCount() external view returns (uint256) {
        return _vaultCounter;
    }
    
    /**
     * @dev Checks if a vault exists
     */
    function vaultExists(uint256 vaultId) external view returns (bool) {
        return _vaults[vaultId].owner != address(0);
    }
    
    /**
     * @dev Returns total vaults created by an owner
     */
    function getOwnerVaultCount(address owner) external view returns (uint256) {
        return _ownerVaults[owner].length;
    }
}

