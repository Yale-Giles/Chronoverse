// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IVaultManager
 * @dev Interface for the main vault management system
 */
interface IVaultManager {
    
    struct VaultConfig {
        address owner;
        uint256 unlockTime;
        uint256 unlockBlock;
        bool useProofOfLife;
        bool useOracle;
        uint256 createdAt;
        VaultStatus status;
    }
    
    enum VaultStatus {
        Active,
        Locked,
        Unlocked,
        Finalized,
        Cancelled
    }
    
    event VaultCreated(
        uint256 indexed vaultId,
        address indexed owner,
        uint256 unlockTime
    );
    
    event VaultClosed(
        uint256 indexed vaultId,
        address indexed owner
    );
    
    event VaultUnlocked(
        uint256 indexed vaultId,
        uint256 timestamp
    );
    
    function createVault(
        uint256 unlockTime,
        uint256 unlockBlock,
        bool useProofOfLife,
        bool useOracle
    ) external returns (uint256 vaultId);
    
    function closeVault(uint256 vaultId) external;
    
    function getVault(uint256 vaultId) external view returns (VaultConfig memory);
    
    function getVaultsByOwner(address owner) external view returns (uint256[] memory);
}

