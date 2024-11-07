// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/ISecretVault.sol";
import "../libraries/VaultErrors.sol";

/**
 * @title SecretVault
 * @dev Manages encrypted secret storage with IPFS CID references
 */
contract SecretVault is ISecretVault, AccessControl {
    
    bytes32 public constant VAULT_MANAGER_ROLE = keccak256("VAULT_MANAGER_ROLE");
    bytes32 public constant REVEALER_ROLE = keccak256("REVEALER_ROLE");
    
    mapping(uint256 => Secret) private _secrets;
    mapping(uint256 => address) private _vaultOwners;
    mapping(uint256 => bool) private _revealed;
    
    constructor(address vaultManager) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VAULT_MANAGER_ROLE, vaultManager);
    }
    
    /**
     * @dev Stores an encrypted secret reference
     */
    function storeSecret(
        uint256 vaultId,
        string calldata encryptedCID,
        bytes32 contentHash
    ) external override {
        if (_vaultOwners[vaultId] == address(0)) {
            _vaultOwners[vaultId] = msg.sender;
        }
        
        if (_vaultOwners[vaultId] != msg.sender) {
            revert VaultErrors.UnauthorizedAccess(msg.sender, vaultId);
        }
        
        if (_secrets[vaultId].isRevoked) {
            revert VaultErrors.SecretAlreadyRevoked(vaultId);
        }
        
        _secrets[vaultId] = Secret({
            encryptedCID: encryptedCID,
            contentHash: contentHash,
            timestamp: block.timestamp,
            isRevoked: false
        });
        
        emit SecretStored(vaultId, encryptedCID, contentHash, block.timestamp);
    }
    
    /**
     * @dev Reveals the secret (only after unlock)
     */
    function revealSecret(uint256 vaultId) external view override returns (string memory) {
        Secret storage secret = _secrets[vaultId];
        
        if (secret.isRevoked) {
            revert VaultErrors.SecretAlreadyRevoked(vaultId);
        }
        
        if (bytes(secret.encryptedCID).length == 0) {
            revert VaultErrors.VaultNotFound(vaultId);
        }
        
        return secret.encryptedCID;
    }
    
    /**
     * @dev Revokes a secret, making it inaccessible
     */
    function revokeSecret(uint256 vaultId) external override {
        if (_vaultOwners[vaultId] != msg.sender && !hasRole(VAULT_MANAGER_ROLE, msg.sender)) {
            revert VaultErrors.UnauthorizedAccess(msg.sender, vaultId);
        }
        
        Secret storage secret = _secrets[vaultId];
        
        if (secret.isRevoked) {
            revert VaultErrors.SecretAlreadyRevoked(vaultId);
        }
        
        secret.isRevoked = true;
        
        emit SecretRevoked(vaultId, block.timestamp);
    }
    
    /**
     * @dev Returns secret information
     */
    function getSecret(uint256 vaultId) external view override returns (Secret memory) {
        return _secrets[vaultId];
    }
    
    /**
     * @dev Verifies secret content hash
     */
    function verifySecret(uint256 vaultId, bytes32 contentHash) external view override returns (bool) {
        Secret storage secret = _secrets[vaultId];
        
        if (secret.contentHash == bytes32(0)) {
            return false;
        }
        
        return secret.contentHash == contentHash;
    }
    
    /**
     * @dev Grants revealer role to an address
     */
    function grantRevealerRole(address account) external onlyRole(VAULT_MANAGER_ROLE) {
        _grantRole(REVEALER_ROLE, account);
    }
    
    /**
     * @dev Records that a secret has been revealed
     */
    function markRevealed(uint256 vaultId, address revealer) external onlyRole(REVEALER_ROLE) {
        _revealed[vaultId] = true;
        emit SecretRevealed(vaultId, revealer, block.timestamp);
    }
    
    /**
     * @dev Checks if a secret has been revealed
     */
    function isRevealed(uint256 vaultId) external view returns (bool) {
        return _revealed[vaultId];
    }
}

