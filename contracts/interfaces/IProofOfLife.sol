// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IProofOfLife
 * @dev Interface for proof-of-life verification system
 */
interface IProofOfLife {
    
    struct LifeStatus {
        uint256 lastCheckIn;
        uint256 inactivityPeriod;
        bool isActive;
        uint256 gracePeriod;
    }
    
    event CheckedIn(
        address indexed owner,
        uint256 indexed vaultId,
        uint256 timestamp
    );
    
    event MarkedInactive(
        address indexed owner,
        uint256 indexed vaultId,
        uint256 timestamp
    );
    
    event InactivityPeriodUpdated(
        uint256 indexed vaultId,
        uint256 oldPeriod,
        uint256 newPeriod
    );
    
    function checkIn(uint256 vaultId) external;
    
    function markInactive(address owner, uint256 vaultId) external;
    
    function isActive(uint256 vaultId) external view returns (bool);
    
    function setInactivityPeriod(uint256 vaultId, uint256 period) external;
    
    function getLastCheckIn(uint256 vaultId) external view returns (uint256);
    
    function getRemainingTime(uint256 vaultId) external view returns (uint256);
}

