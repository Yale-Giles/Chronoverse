// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IHeirPolicy
 * @dev Interface for inheritance policy management
 */
interface IHeirPolicy {
    
    struct Heir {
        address heirAddress;
        uint256 percentage;
        bool claimed;
    }
    
    struct HeirConfig {
        Heir[] heirs;
        uint256 totalPercentage;
        uint256 quorumRequired;
        bool isActive;
    }
    
    event HeirPolicySet(
        uint256 indexed vaultId,
        address indexed owner,
        uint256 heirCount
    );
    
    event HeirAdded(
        uint256 indexed vaultId,
        address indexed heir,
        uint256 percentage
    );
    
    event HeirRemoved(
        uint256 indexed vaultId,
        address indexed heir
    );
    
    event HeirClaimed(
        uint256 indexed vaultId,
        address indexed heir,
        uint256 amount
    );
    
    function setHeirPolicy(
        uint256 vaultId,
        address[] calldata heirs,
        uint256[] calldata percentages,
        uint256 quorum
    ) external;
    
    function addHeir(
        uint256 vaultId,
        address heir,
        uint256 percentage
    ) external;
    
    function removeHeir(
        uint256 vaultId,
        address heir
    ) external;
    
    function getHeirs(uint256 vaultId) external view returns (Heir[] memory);
    
    function validateDistribution(uint256 vaultId) external view returns (bool);
}

