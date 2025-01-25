// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "../interfaces/IOracleBridge.sol";
import "../libraries/VaultErrors.sol";

/**
 * @title OracleBridge
 * @dev Integrates with oracles for conditional vault unlocking
 */
contract OracleBridge is IOracleBridge, AccessControl {
    
    bytes32 public constant VAULT_MANAGER_ROLE = keccak256("VAULT_MANAGER_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    
    mapping(uint256 => OracleCondition) private _conditions;
    mapping(bytes32 => uint256) private _requestToVault;
    mapping(address => bool) private _trustedOracles;
    
    constructor(address vaultManager) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VAULT_MANAGER_ROLE, vaultManager);
    }
    
    /**
     * @dev Sets an oracle condition for a vault
     */
    function setOracleCondition(
        uint256 vaultId,
        address oracleAddress,
        bytes32 conditionId,
        bytes calldata conditionData
    ) external override {
        if (oracleAddress == address(0)) {
            revert VaultErrors.ZeroAddress();
        }
        
        _conditions[vaultId] = OracleCondition({
            oracleAddress: oracleAddress,
            conditionId: conditionId,
            isFulfilled: false,
            fulfillmentTime: 0,
            conditionData: conditionData
        });
        
        emit OracleConditionSet(vaultId, oracleAddress, conditionId);
    }
    
    /**
     * @dev Fulfills an oracle condition with response data
     */
    function fulfillCondition(
        uint256 vaultId,
        bytes32 requestId,
        bytes calldata response
    ) external override {
        OracleCondition storage condition = _conditions[vaultId];
        
        if (condition.oracleAddress == address(0)) {
            revert VaultErrors.VaultNotFound(vaultId);
        }
        
        if (!_trustedOracles[msg.sender] && msg.sender != condition.oracleAddress) {
            revert VaultErrors.UnauthorizedAccess(msg.sender, vaultId);
        }
        
        if (condition.isFulfilled) {
            return;
        }
        
        // Verify response data (simplified - in production would validate properly)
        if (response.length > 0) {
            condition.isFulfilled = true;
            condition.fulfillmentTime = block.timestamp;
            
            emit OracleConditionFulfilled(vaultId, requestId, block.timestamp);
        }
    }
    
    /**
     * @dev Checks if the oracle condition is fulfilled
     */
    function checkCondition(uint256 vaultId) external view override returns (bool) {
        OracleCondition storage condition = _conditions[vaultId];
        
        if (condition.oracleAddress == address(0)) {
            return true; // No oracle condition set
        }
        
        return condition.isFulfilled;
    }
    
    /**
     * @dev Returns the oracle condition for a vault
     */
    function getCondition(uint256 vaultId) external view override returns (OracleCondition memory) {
        return _conditions[vaultId];
    }
    
    /**
     * @dev Sends a request to the oracle
     */
    function sendOracleRequest(uint256 vaultId, bytes calldata requestData) 
        external 
        onlyRole(VAULT_MANAGER_ROLE) 
        returns (bytes32 requestId) 
    {
        OracleCondition storage condition = _conditions[vaultId];
        
        if (condition.oracleAddress == address(0)) {
            revert VaultErrors.VaultNotFound(vaultId);
        }
        
        requestId = keccak256(abi.encodePacked(vaultId, block.timestamp, requestData));
        _requestToVault[requestId] = vaultId;
        
        emit OracleRequestSent(vaultId, requestId, condition.oracleAddress);
        
        return requestId;
    }
    
    /**
     * @dev Adds a trusted oracle address
     */
    function addTrustedOracle(address oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (oracle == address(0)) {
            revert VaultErrors.ZeroAddress();
        }
        _trustedOracles[oracle] = true;
        _grantRole(ORACLE_ROLE, oracle);
    }
    
    /**
     * @dev Removes a trusted oracle
     */
    function removeTrustedOracle(address oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _trustedOracles[oracle] = false;
        _revokeRole(ORACLE_ROLE, oracle);
    }
    
    /**
     * @dev Checks if an oracle is trusted
     */
    function isTrustedOracle(address oracle) external view returns (bool) {
        return _trustedOracles[oracle];
    }
    
    /**
     * @dev Returns oracle address for a vault
     */
    function getOracleAddress(uint256 vaultId) external view returns (address) {
        return _conditions[vaultId].oracleAddress;
    }
    
    /**
     * @dev Checks if condition has been fulfilled
     */
    function isConditionFulfilled(uint256 vaultId) external view returns (bool) {
        return _conditions[vaultId].isFulfilled;
    }
}

