// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IOracleBridge
 * @dev Interface for oracle integration and conditional unlock logic
 */
interface IOracleBridge {
    
    struct OracleCondition {
        address oracleAddress;
        bytes32 conditionId;
        bool isFulfilled;
        uint256 fulfillmentTime;
        bytes conditionData;
    }
    
    event OracleConditionSet(
        uint256 indexed vaultId,
        address indexed oracle,
        bytes32 conditionId
    );
    
    event OracleConditionFulfilled(
        uint256 indexed vaultId,
        bytes32 conditionId,
        uint256 timestamp
    );
    
    event OracleRequestSent(
        uint256 indexed vaultId,
        bytes32 indexed requestId,
        address oracle
    );
    
    function setOracleCondition(
        uint256 vaultId,
        address oracleAddress,
        bytes32 conditionId,
        bytes calldata conditionData
    ) external;
    
    function fulfillCondition(
        uint256 vaultId,
        bytes32 requestId,
        bytes calldata response
    ) external;
    
    function checkCondition(uint256 vaultId) external view returns (bool);
    
    function getCondition(uint256 vaultId) external view returns (OracleCondition memory);
}

