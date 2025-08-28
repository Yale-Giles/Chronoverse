# Chronoverse API Reference

## VaultManager

### Functions

#### createVault
```solidity
function createVault(
    uint256 unlockTime,
    uint256 unlockBlock,
    bool useProofOfLife,
    bool useOracle
) external returns (uint256 vaultId)
```
Creates a new vault with specified configuration.

**Parameters:**
- `unlockTime`: Unix timestamp for time-based unlock
- `unlockBlock`: Block number for block-based unlock
- `useProofOfLife`: Enable proof-of-life mechanism
- `useOracle`: Enable oracle-based conditions

**Returns:**
- `vaultId`: Unique identifier for the created vault

**Events:**
- `VaultCreated(vaultId, owner, unlockTime)`

#### closeVault
```solidity
function closeVault(uint256 vaultId) external
```
Closes an existing vault (only by owner before unlock).

#### getVault
```solidity
function getVault(uint256 vaultId) external view returns (VaultConfig memory)
```
Returns complete vault configuration.

#### getVaultsByOwner
```solidity
function getVaultsByOwner(address owner) external view returns (uint256[] memory)
```
Returns all vault IDs owned by an address.

## TimelockVault

### Functions

#### scheduleUnlock
```solidity
function scheduleUnlock(
    uint256 vaultId,
    uint256 unlockTime,
    uint256 unlockBlock
) external
```
Schedules unlock conditions for a vault.

#### triggerUnlock
```solidity
function triggerUnlock(uint256 vaultId) external returns (bool)
```
Triggers unlock if conditions are met.

#### isUnlockable
```solidity
function isUnlockable(uint256 vaultId) external view returns (bool)
```
Checks if vault unlock conditions are satisfied.

## HeirPolicy

### Functions

#### setHeirPolicy
```solidity
function setHeirPolicy(
    uint256 vaultId,
    address[] calldata heirs,
    uint256[] calldata percentages,
    uint256 quorum
) external
```
Sets complete heir policy with distribution rules.

**Parameters:**
- `heirs`: Array of heir addresses
- `percentages`: Array of distribution percentages (basis points, 10000 = 100%)
- `quorum`: Number of signatures required for multi-sig scenarios

#### addHeir
```solidity
function addHeir(
    uint256 vaultId,
    address heir,
    uint256 percentage
) external
```
Adds a single heir to existing policy.

#### removeHeir
```solidity
function removeHeir(uint256 vaultId, address heir) external
```
Removes an heir from the policy.

#### getHeirs
```solidity
function getHeirs(uint256 vaultId) external view returns (Heir[] memory)
```
Returns all configured heirs for a vault.

## ProofOfLife

### Functions

#### checkIn
```solidity
function checkIn(uint256 vaultId) external
```
Owner checks in to prove activity.

#### markInactive
```solidity
function markInactive(address owner, uint256 vaultId) external
```
Marks owner as inactive after inactivity period.

#### isActive
```solidity
function isActive(uint256 vaultId) external view returns (bool)
```
Checks if owner is still active.

#### setInactivityPeriod
```solidity
function setInactivityPeriod(uint256 vaultId, uint256 period) external
```
Updates the inactivity period (in seconds).

## SecretVault

### Functions

#### storeSecret
```solidity
function storeSecret(
    uint256 vaultId,
    string calldata encryptedCID,
    bytes32 contentHash
) external
```
Stores encrypted secret reference (IPFS CID).

#### revealSecret
```solidity
function revealSecret(uint256 vaultId) external view returns (string memory)
```
Returns the encrypted CID (after unlock).

#### revokeSecret
```solidity
function revokeSecret(uint256 vaultId) external
```
Revokes access to the secret.

## OracleBridge

### Functions

#### setOracleCondition
```solidity
function setOracleCondition(
    uint256 vaultId,
    address oracleAddress,
    bytes32 conditionId,
    bytes calldata conditionData
) external
```
Sets oracle condition for conditional unlock.

#### fulfillCondition
```solidity
function fulfillCondition(
    uint256 vaultId,
    bytes32 requestId,
    bytes calldata response
) external
```
Fulfills oracle condition with response data.

#### checkCondition
```solidity
function checkCondition(uint256 vaultId) external view returns (bool)
```
Checks if oracle condition is fulfilled.

## UnlockExecutor

### Functions

#### executeUnlock
```solidity
function executeUnlock(uint256 vaultId) external returns (bool)
```
Executes the unlock and distribution process.

#### distributeAssets
```solidity
function distributeAssets(uint256 vaultId) external returns (uint256)
```
Distributes assets to heirs according to policy.

#### finalizeVault
```solidity
function finalizeVault(uint256 vaultId) external
```
Finalizes vault after distribution.

#### getExecutionStatus
```solidity
function getExecutionStatus(uint256 vaultId) external view returns (ExecutionStatus memory)
```
Returns execution status for a vault.

## Events Reference

### VaultManager Events
- `VaultCreated(uint256 indexed vaultId, address indexed owner, uint256 unlockTime)`
- `VaultClosed(uint256 indexed vaultId, address indexed owner)`
- `VaultUnlocked(uint256 indexed vaultId, uint256 timestamp)`

### HeirPolicy Events
- `HeirPolicySet(uint256 indexed vaultId, address indexed owner, uint256 heirCount)`
- `HeirAdded(uint256 indexed vaultId, address indexed heir, uint256 percentage)`
- `HeirRemoved(uint256 indexed vaultId, address indexed heir)`
- `HeirClaimed(uint256 indexed vaultId, address indexed heir, uint256 amount)`

### ProofOfLife Events
- `CheckedIn(address indexed owner, uint256 indexed vaultId, uint256 timestamp)`
- `MarkedInactive(address indexed owner, uint256 indexed vaultId, uint256 timestamp)`

### UnlockExecutor Events
- `ExecutionStarted(uint256 indexed vaultId, address indexed initiator, uint256 timestamp)`
- `AssetDistributed(uint256 indexed vaultId, address indexed recipient, uint256 amount, uint256 timestamp)`
- `VaultFinalized(uint256 indexed vaultId, uint256 totalAmount, uint256 timestamp)`

## Error Handling

All contracts use custom errors for gas efficiency:

- `VaultNotFound(uint256 vaultId)`
- `UnauthorizedAccess(address caller, uint256 vaultId)`
- `VaultAlreadyFinalized(uint256 vaultId)`
- `VaultNotUnlockable(uint256 vaultId)`
- `InvalidUnlockTime(uint256 providedTime, uint256 currentTime)`
- `InvalidPercentageSum(uint256 total)`
- `ZeroAddress()`
- `EmptyArray()`

## Common Workflows

### Complete Vault Setup Workflow

1. Create vault
2. Configure heirs
3. Store secrets
4. Deposit assets
5. Monitor status

### Heir Claim Workflow

1. Wait for unlock
2. Verify conditions met
3. Trigger unlock
4. Execute distribution
5. Claim assets

## Usage Examples

### Creating a Vault
```javascript
const unlockTime = Math.floor(Date.now() / 1000) + (365 * 24 * 3600);
const tx = await vaultManager.createVault(unlockTime, 0, true, false);
const receipt = await tx.wait();
```

### Setting Heirs
```javascript
const heirs = [heir1Address, heir2Address];
const percentages = [6000, 4000]; // 60% and 40%
await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
```

### Checking In
```javascript
await proofOfLife.checkIn(vaultId);
```

### Storing Secret
```javascript
const cid = "QmYourIPFSHashHere";
const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
await secretVault.storeSecret(vaultId, cid, contentHash);
```

