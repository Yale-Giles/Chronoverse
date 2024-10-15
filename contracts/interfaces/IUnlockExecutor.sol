// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IUnlockExecutor
 * @dev Interface for final asset distribution and vault finalization
 */
interface IUnlockExecutor {
    
    struct ExecutionStatus {
        bool isExecuted;
        uint256 executionTime;
        uint256 totalDistributed;
        uint256 recipientCount;
    }
    
    event ExecutionStarted(
        uint256 indexed vaultId,
        address indexed initiator,
        uint256 timestamp
    );
    
    event AssetDistributed(
        uint256 indexed vaultId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );
    
    event VaultFinalized(
        uint256 indexed vaultId,
        uint256 totalAmount,
        uint256 timestamp
    );
    
    function executeUnlock(uint256 vaultId) external returns (bool);
    
    function distributeAssets(uint256 vaultId) external returns (uint256);
    
    function finalizeVault(uint256 vaultId) external;
    
    function getExecutionStatus(uint256 vaultId) external view returns (ExecutionStatus memory);
    
    function canExecute(uint256 vaultId) external view returns (bool);
}

