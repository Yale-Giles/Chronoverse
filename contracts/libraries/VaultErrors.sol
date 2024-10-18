// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title VaultErrors
 * @dev Custom error definitions for the Chronoverse protocol
 */
library VaultErrors {
    error VaultNotFound(uint256 vaultId);
    error UnauthorizedAccess(address caller, uint256 vaultId);
    error VaultAlreadyFinalized(uint256 vaultId);
    error VaultNotUnlockable(uint256 vaultId);
    error InvalidUnlockTime(uint256 providedTime, uint256 currentTime);
    error InvalidPercentageSum(uint256 total);
    error HeirNotFound(address heir);
    error AlreadyClaimed(address heir);
    error InsufficientBalance(uint256 required, uint256 available);
    error InvalidConfiguration();
    error ProofOfLifeStillActive(uint256 lastCheckIn);
    error OracleConditionNotFulfilled(bytes32 conditionId);
    error SecretAlreadyRevoked(uint256 vaultId);
    error InvalidContentHash(bytes32 provided, bytes32 expected);
    error ZeroAddress();
    error EmptyArray();
    error ArrayLengthMismatch(uint256 length1, uint256 length2);
}

