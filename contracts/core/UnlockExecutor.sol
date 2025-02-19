// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../interfaces/IUnlockExecutor.sol";
import "../interfaces/IHeirPolicy.sol";
import "../libraries/VaultLib.sol";
import "../libraries/VaultErrors.sol";

/**
 * @title UnlockExecutor
 * @dev Handles final asset distribution and vault finalization
 */
contract UnlockExecutor is IUnlockExecutor, AccessControl, ReentrancyGuard {
    
    using VaultLib for *;
    
    bytes32 public constant VAULT_MANAGER_ROLE = keccak256("VAULT_MANAGER_ROLE");
    
    mapping(uint256 => ExecutionStatus) private _executionStatus;
    mapping(uint256 => uint256) private _vaultBalances;
    mapping(uint256 => address) private _vaultTokens; // address(0) for native ETH
    
    IHeirPolicy private immutable _heirPolicy;
    
    event AssetDeposited(uint256 indexed vaultId, uint256 amount, address token);
    
    constructor(address vaultManager, address heirPolicyAddress) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(VAULT_MANAGER_ROLE, vaultManager);
        _heirPolicy = IHeirPolicy(heirPolicyAddress);
    }
    
    /**
     * @dev Executes the unlock and distribution process
     */
    function executeUnlock(uint256 vaultId) external override nonReentrant returns (bool) {
        ExecutionStatus storage status = _executionStatus[vaultId];
        
        if (status.isExecuted) {
            return true;
        }
        
        if (!canExecute(vaultId)) {
            revert VaultErrors.VaultNotUnlockable(vaultId);
        }
        
        status.isExecuted = true;
        status.executionTime = block.timestamp;
        
        emit ExecutionStarted(vaultId, msg.sender, block.timestamp);
        
        // Trigger asset distribution
        uint256 distributed = distributeAssets(vaultId);
        status.totalDistributed = distributed;
        
        return true;
    }
    
    /**
     * @dev Distributes assets to heirs according to policy
     */
    function distributeAssets(uint256 vaultId) public override nonReentrant returns (uint256) {
        ExecutionStatus storage status = _executionStatus[vaultId];
        
        if (!status.isExecuted) {
            revert VaultErrors.VaultNotUnlockable(vaultId);
        }
        
        IHeirPolicy.Heir[] memory heirs = _heirPolicy.getHeirs(vaultId);
        
        if (heirs.length == 0) {
            revert VaultErrors.InvalidConfiguration();
        }
        
        uint256 totalBalance = _vaultBalances[vaultId];
        
        if (totalBalance == 0) {
            return 0;
        }
        
        uint256 totalDistributed = 0;
        address tokenAddress = _vaultTokens[vaultId];
        
        for (uint256 i = 0; i < heirs.length; i++) {
            if (heirs[i].claimed) {
                continue;
            }
            
            uint256 amount = VaultLib.calculateDistribution(totalBalance, heirs[i].percentage);
            
            if (amount > 0) {
                bool success = _transferAsset(heirs[i].heirAddress, amount, tokenAddress);
                
                if (success) {
                    totalDistributed += amount;
                    status.recipientCount++;
                    
                    emit AssetDistributed(vaultId, heirs[i].heirAddress, amount, block.timestamp);
                }
            }
        }
        
        _vaultBalances[vaultId] -= totalDistributed;
        status.totalDistributed += totalDistributed;
        
        return totalDistributed;
    }
    
    /**
     * @dev Finalizes the vault after distribution
     */
    function finalizeVault(uint256 vaultId) external override nonReentrant {
        ExecutionStatus storage status = _executionStatus[vaultId];
        
        if (!status.isExecuted) {
            revert VaultErrors.VaultNotUnlockable(vaultId);
        }
        
        emit VaultFinalized(vaultId, status.totalDistributed, block.timestamp);
    }
    
    /**
     * @dev Returns execution status for a vault
     */
    function getExecutionStatus(uint256 vaultId) external view override returns (ExecutionStatus memory) {
        return _executionStatus[vaultId];
    }
    
    /**
     * @dev Checks if vault can be executed
     */
    function canExecute(uint256 vaultId) public view override returns (bool) {
        ExecutionStatus storage status = _executionStatus[vaultId];
        
        if (status.isExecuted) {
            return false;
        }
        
        // Check if heirs are configured
        IHeirPolicy.Heir[] memory heirs = _heirPolicy.getHeirs(vaultId);
        
        return heirs.length > 0;
    }
    
    /**
     * @dev Deposits assets into a vault
     */
    function depositAssets(uint256 vaultId, uint256 amount, address token) 
        external 
        payable 
        onlyRole(VAULT_MANAGER_ROLE) 
    {
        if (token == address(0)) {
            // Native ETH
            require(msg.value == amount, "Incorrect ETH amount");
            _vaultBalances[vaultId] += amount;
        } else {
            // ERC20 token
            IERC20(token).transferFrom(msg.sender, address(this), amount);
            _vaultBalances[vaultId] += amount;
            _vaultTokens[vaultId] = token;
        }
        
        emit AssetDeposited(vaultId, amount, token);
    }
    
    /**
     * @dev Internal function to transfer assets
     */
    function _transferAsset(address recipient, uint256 amount, address token) 
        private 
        returns (bool) 
    {
        if (token == address(0)) {
            // Native ETH transfer
            (bool success, ) = payable(recipient).call{value: amount}("");
            return success;
        } else {
            // ERC20 transfer
            return IERC20(token).transfer(recipient, amount);
        }
    }
    
    /**
     * @dev Returns vault balance
     */
    function getVaultBalance(uint256 vaultId) external view returns (uint256) {
        return _vaultBalances[vaultId];
    }
    
    /**
     * @dev Returns vault token address
     */
    function getVaultToken(uint256 vaultId) external view returns (address) {
        return _vaultTokens[vaultId];
    }
    
    /**
     * @dev Checks if assets have been deposited
     */
    function hasAssets(uint256 vaultId) external view returns (bool) {
        return _vaultBalances[vaultId] > 0;
    }
    
    /**
     * @dev Receives ETH deposits
     */
    receive() external payable {}
}

