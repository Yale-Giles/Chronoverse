// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title EmergencyPause
 * @dev Emergency pause functionality for critical operations
 */
abstract contract EmergencyPause is AccessControl, Pausable {
    
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    
    event EmergencyPauseActivated(address indexed by, uint256 timestamp);
    event EmergencyPauseDeactivated(address indexed by, uint256 timestamp);
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
    }
    
    /**
     * @dev Pause contract operations
     */
    function pause() external onlyRole(PAUSER_ROLE) {
        _pause();
        emit EmergencyPauseActivated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Unpause contract operations
     */
    function unpause() external onlyRole(PAUSER_ROLE) {
        _unpause();
        emit EmergencyPauseDeactivated(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Check if contract is paused
     */
    function isPaused() external view returns (bool) {
        return paused();
    }
}

