# Chronoverse User Guide

## Getting Started

### Installation

```bash
git clone https://github.com/Yale-Giles/Chronoverse.git
cd Chronoverse
npm install
```

### Configuration

Create a `.env` file:

```env
PRIVATE_KEY=your_private_key_here
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests

```bash
npm test
```

## Creating a Vault

### Basic Time-Locked Vault

1. Connect your wallet
2. Call `createVault()` with unlock time
3. Configure heirs and distribution
4. Deposit assets
5. Store secrets (optional)

```javascript
// Example: 1-year vault
const oneYearFromNow = Math.floor(Date.now() / 1000) + (365 * 24 * 3600);
const tx = await vaultManager.createVault(oneYearFromNow, 0, false, false);
```

### Vault with Proof-of-Life

Enable automatic unlock if you become inactive:

```javascript
const tx = await vaultManager.createVault(
    unlockTime,
    0,
    true,  // Enable proof-of-life
    false
);
```

Remember to check in periodically:

```javascript
await proofOfLife.checkIn(vaultId);
```

### Vault with Oracle Conditions

Enable unlock based on external events:

```javascript
const tx = await vaultManager.createVault(
    unlockTime,
    0,
    false,
    true  // Enable oracle
);

// Set oracle condition
await oracleBridge.setOracleCondition(
    vaultId,
    oracleAddress,
    conditionId,
    conditionData
);
```

## Configuring Heirs

### Single Heir

```javascript
const heirs = [heirAddress];
const percentages = [10000]; // 100%
await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
```

### Multiple Heirs

```javascript
const heirs = [heir1, heir2, heir3];
const percentages = [5000, 3000, 2000]; // 50%, 30%, 20%
await heirPolicy.setHeirPolicy(vaultId, heirs, percentages, 0);
```

### Adding Heirs Later

```javascript
await heirPolicy.addHeir(vaultId, newHeirAddress, 2500); // 25%
```

## Storing Secrets

### Upload to IPFS

First, encrypt your secret and upload to IPFS:

```javascript
// Use your preferred encryption method
const encrypted = await encryptData(secretData, encryptionKey);
const cid = await ipfs.add(encrypted);
```

### Store Reference On-Chain

```javascript
const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid));
await secretVault.storeSecret(vaultId, cid, contentHash);
```

## Depositing Assets

### ETH Deposits

```javascript
await unlockExecutor.depositAssets(
    vaultId,
    amount,
    ethers.ZeroAddress,
    { value: amount }
);
```

### ERC20 Deposits

```javascript
// First approve
await token.approve(unlockExecutorAddress, amount);

// Then deposit
await unlockExecutor.depositAssets(vaultId, amount, tokenAddress);
```

## Unlock Process

### Automatic Unlock

When conditions are met, anyone can trigger unlock:

```javascript
await timelockVault.triggerUnlock(vaultId);
await unlockExecutor.executeUnlock(vaultId);
```

### Heir Claims

Heirs can claim their portion:

```javascript
await unlockExecutor.distributeAssets(vaultId);
```

## Monitoring Your Vault

### Check Vault Status

```javascript
const vault = await vaultManager.getVault(vaultId);
console.log("Status:", vault.status);
console.log("Unlock Time:", new Date(vault.unlockTime * 1000));
```

### Check Proof-of-Life

```javascript
const remaining = await proofOfLife.getRemainingTime(vaultId);
console.log("Days until inactive:", remaining / (24 * 3600));
```

### Check Unlock Eligibility

```javascript
const canUnlock = await timelockVault.isUnlockable(vaultId);
console.log("Can unlock:", canUnlock);
```

## Best Practices

### Security
- Never share your private keys
- Encrypt all sensitive data before storing
- Use hardware wallets for large amounts
- Test with small amounts first

### Heir Configuration
- Clearly communicate with heirs
- Provide heirs with vault ID and instructions
- Keep backup of encryption keys in secure location
- Review and update heir configuration regularly

### Proof-of-Life
- Set realistic check-in periods
- Set calendar reminders for check-ins
- Have backup check-in methods
- Consider grace periods for travel/emergencies

### Asset Management
- Start with test transactions
- Diversify across multiple vaults
- Keep records of all vault IDs
- Document all configurations off-chain

## Troubleshooting

### "Vault Not Unlockable"
- Check if unlock time has passed
- Verify proof-of-life status
- Confirm oracle conditions fulfilled

### "Unauthorized Access"
- Ensure you're using correct account
- Verify vault ownership
- Check role permissions

### "Invalid Percentage Sum"
- Heir percentages must total exactly 10000 (100%)
- Recalculate distribution percentages

### Transaction Failures
- Check gas limits
- Verify contract addresses
- Ensure sufficient balance
- Review error messages carefully

## Support

For issues and questions:
- GitHub Issues: https://github.com/Yale-Giles/Chronoverse/issues
- Documentation: https://github.com/Yale-Giles/Chronoverse/docs

