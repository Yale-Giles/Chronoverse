// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IHeirPolicy.sol";
import "../libraries/VaultLib.sol";
import "../libraries/VaultErrors.sol";

/**
 * @title HeirPolicy
 * @dev Manages inheritance distribution policies and heir management
 */
contract HeirPolicy is IHeirPolicy, AccessControl {
    
    using VaultLib for *;
    
    bytes32 public constant VAULT_MANAGER_ROLE = keccak256("VAULT_MANAGER_ROLE");
    
    mapping(uint256 => HeirConfig) private _heirPolicies;
    mapping(uint256 => mapping(address => uint256)) private _heirIndex;
    
    constructor(address vaultManager) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VAULT_MANAGER_ROLE, vaultManager);
    }
    
    /**
     * @dev Sets the complete heir policy for a vault
     */
    function setHeirPolicy(
        uint256 vaultId,
        address[] calldata heirs,
        uint256[] calldata percentages,
        uint256 quorum
    ) external override {
        VaultLib.validateNotEmpty(heirs.length);
        VaultLib.validateArrayLengths(heirs.length, percentages.length);
        VaultLib.validatePercentages(percentages);
        
        if (heirs.length > VaultLib.getMaxHeirs()) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        // Clear existing heirs
        delete _heirPolicies[vaultId];
        
        // Set new heirs
        for (uint256 i = 0; i < heirs.length; i++) {
            VaultLib.validateAddress(heirs[i]);
            
            _heirPolicies[vaultId].heirs.push(Heir({
                heirAddress: heirs[i],
                percentage: percentages[i],
                claimed: false
            }));
            
            _heirIndex[vaultId][heirs[i]] = i;
        }
        
        _heirPolicies[vaultId].totalPercentage = VaultLib.getPercentageBase();
        _heirPolicies[vaultId].quorumRequired = quorum;
        _heirPolicies[vaultId].isActive = true;
        
        emit HeirPolicySet(vaultId, msg.sender, heirs.length);
    }
    
    /**
     * @dev Adds a single heir to an existing policy
     */
    function addHeir(
        uint256 vaultId,
        address heir,
        uint256 percentage
    ) external override {
        VaultLib.validateAddress(heir);
        
        HeirConfig storage policy = _heirPolicies[vaultId];
        
        if (!policy.isActive) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        // Check if heir already exists
        if (_heirIndex[vaultId][heir] > 0 || 
            (policy.heirs.length > 0 && policy.heirs[0].heirAddress == heir)) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        policy.heirs.push(Heir({
            heirAddress: heir,
            percentage: percentage,
            claimed: false
        }));
        
        _heirIndex[vaultId][heir] = policy.heirs.length - 1;
        
        emit HeirAdded(vaultId, heir, percentage);
    }
    
    /**
     * @dev Removes an heir from the policy
     */
    function removeHeir(
        uint256 vaultId,
        address heir
    ) external override {
        HeirConfig storage policy = _heirPolicies[vaultId];
        
        uint256 index = _heirIndex[vaultId][heir];
        
        if (index >= policy.heirs.length) {
            revert VaultErrors.HeirNotFound(heir);
        }
        
        if (policy.heirs[index].heirAddress != heir && index != 0) {
            revert VaultErrors.HeirNotFound(heir);
        }
        
        // Move last heir to deleted position
        uint256 lastIndex = policy.heirs.length - 1;
        if (index != lastIndex) {
            policy.heirs[index] = policy.heirs[lastIndex];
            _heirIndex[vaultId][policy.heirs[index].heirAddress] = index;
        }
        
        policy.heirs.pop();
        delete _heirIndex[vaultId][heir];
        
        emit HeirRemoved(vaultId, heir);
    }
    
    /**
     * @dev Returns all heirs for a vault
     */
    function getHeirs(uint256 vaultId) external view override returns (Heir[] memory) {
        return _heirPolicies[vaultId].heirs;
    }
    
    /**
     * @dev Validates the distribution totals 100%
     */
    function validateDistribution(uint256 vaultId) external view override returns (bool) {
        HeirConfig storage policy = _heirPolicies[vaultId];
        
        if (!policy.isActive || policy.heirs.length == 0) {
            return false;
        }
        
        uint256 total = 0;
        for (uint256 i = 0; i < policy.heirs.length; i++) {
            total += policy.heirs[i].percentage;
        }
        
        return total == VaultLib.getPercentageBase();
    }
    
    /**
     * @dev Marks an heir's claim as completed
     */
    function markClaimed(uint256 vaultId, address heir) external onlyRole(VAULT_MANAGER_ROLE) {
        HeirConfig storage policy = _heirPolicies[vaultId];
        uint256 index = _heirIndex[vaultId][heir];
        
        if (index >= policy.heirs.length || policy.heirs[index].heirAddress != heir) {
            if (index != 0 || policy.heirs[0].heirAddress != heir) {
                revert VaultErrors.HeirNotFound(heir);
            }
        }
        
        policy.heirs[index].claimed = true;
        
        emit HeirClaimed(vaultId, heir, 0);
    }
    
    /**
     * @dev Returns heir count for a vault
     */
    function getHeirCount(uint256 vaultId) external view returns (uint256) {
        return _heirPolicies[vaultId].heirs.length;
    }
    
    /**
     * @dev Checks if address is an heir
     */
    function isHeir(uint256 vaultId, address account) external view returns (bool) {
        HeirConfig storage policy = _heirPolicies[vaultId];
        uint256 index = _heirIndex[vaultId][account];
        
        if (index >= policy.heirs.length) {
            return false;
        }
        
        return policy.heirs[index].heirAddress == account || (index == 0 && policy.heirs[0].heirAddress == account);
    }
}

