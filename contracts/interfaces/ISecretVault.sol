// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ISecretVault
 * @dev Interface for encrypted secret storage management
 */
interface ISecretVault {
    
    struct Secret {
        string encryptedCID;
        bytes32 contentHash;
        uint256 timestamp;
        bool isRevoked;
    }
    
    event SecretStored(
        uint256 indexed vaultId,
        string encryptedCID,
        bytes32 contentHash,
        uint256 timestamp
    );
    
    event SecretRevealed(
        uint256 indexed vaultId,
        address indexed revealer,
        uint256 timestamp
    );
    
    event SecretRevoked(
        uint256 indexed vaultId,
        uint256 timestamp
    );
    
    function storeSecret(
        uint256 vaultId,
        string calldata encryptedCID,
        bytes32 contentHash
    ) external;
    
    function revealSecret(uint256 vaultId) external view returns (string memory);
    
    function revokeSecret(uint256 vaultId) external;
    
    function getSecret(uint256 vaultId) external view returns (Secret memory);
    
    function verifySecret(uint256 vaultId, bytes32 contentHash) external view returns (bool);
}

