// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Events
 * @dev Centralized event definitions for the protocol
 */
library Events {
    // Vault events
    event VaultCreated(uint256 indexed vaultId, address indexed owner, uint256 unlockTime);
    event VaultUpdated(uint256 indexed vaultId, uint256 newUnlockTime);
    event VaultStatusChanged(uint256 indexed vaultId, uint8 oldStatus, uint8 newStatus);
    
    // Asset events
    event AssetLocked(uint256 indexed vaultId, address token, uint256 amount);
    event AssetWithdrawn(uint256 indexed vaultId, address recipient, uint256 amount);
    
    // Heir events  
    event HeirsConfigured(uint256 indexed vaultId, uint256 heirCount);
    event HeirshipTransferred(uint256 indexed vaultId, address from, address to);
}

