# Usage Examples

## Basic Vault Creation

```javascript
const unlockTime = Math.floor(Date.now() / 1000) + (365 * 24 * 3600);
const tx = await vaultManager.createVault(unlockTime, 0, false, false);
const receipt = await tx.wait();
console.log("Vault created!");
```

## Configure Multiple Heirs

```javascript
const heirs = [
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
];
const percentages = [7000, 3000]; // 70% and 30%

await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
```

## Store Encrypted Secret

```javascript
// Encrypt your data first
const encrypted = encryptData(secretMessage, key);
const cid = await uploadToIPFS(encrypted);

// Store reference on-chain
const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
await secretVault.storeSecret(vaultId, cid, contentHash);
```

## Proof-of-Life Check-In

```javascript
// Regular check-in
await proofOfLife.checkIn(vaultId);

// Check remaining time
const remaining = await proofOfLife.getRemainingTime(vaultId);
console.log(`Days until inactive: ${remaining / (24 * 3600)}`);
```

## Deposit Assets

### ETH
```javascript
const amount = ethers.parseEther("5.0");
await unlockExecutor.depositAssets(
    vaultId,
    amount,
    ethers.ZeroAddress,
    { value: amount }
);
```

### ERC20
```javascript
await token.approve(unlockExecutorAddress, amount);
await unlockExecutor.depositAssets(vaultId, amount, tokenAddress);
```

## Unlock and Distribute

```javascript
// Wait for unlock time
await time.increaseTo(unlockTime + 1);

// Trigger unlock
await timelockVault.triggerUnlock(vaultId);

// Execute distribution
await unlockExecutor.executeUnlock(vaultId);
await unlockExecutor.finalizeVault(vaultId);
```

## Query Vault Status

```javascript
const vault = await vaultManager.getVault(vaultId);
console.log("Status:", vault.status);
console.log("Owner:", vault.owner);
console.log("Unlock Time:", new Date(vault.unlockTime * 1000));

const isUnlockable = await timelockVault.isUnlockable(vaultId);
console.log("Can unlock:", isUnlockable);
```

## Oracle-Based Unlock

```javascript
// Set oracle condition
const oracleAddress = "0x...";
const conditionId = ethers.keccak256(ethers.toUtf8Bytes("death_cert"));
await oracleBridge.setOracleCondition(vaultId, oracleAddress, conditionId, "0x");

// Oracle fulfills condition
await oracleBridge.connect(oracle).fulfillCondition(vaultId, requestId, response);

// Check if fulfilled
const isFulfilled = await oracleBridge.checkCondition(vaultId);
```

