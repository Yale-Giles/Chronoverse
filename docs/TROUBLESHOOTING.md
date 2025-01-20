# Troubleshooting Guide

## Common Issues and Solutions

### Compilation Errors

#### "Cannot find module '@openzeppelin/contracts'"

**Solution:**
```bash
npm install --save-dev @openzeppelin/contracts
```

#### "Solidity version mismatch"

**Solution:**
Update `hardhat.config.js`:
```javascript
solidity: {
  version: "0.8.20"
}
```

### Deployment Issues

#### "Insufficient funds for gas"

**Causes:**
- Low account balance
- High gas prices
- Complex contract deployment

**Solutions:**
1. Check balance: `npm run network-check`
2. Add funds to deployment account
3. Deploy during low network usage
4. Use L2 networks (Arbitrum, Optimism)

#### "Transaction underpriced"

**Solution:**
```javascript
const tx = await contract.deploy({
    gasPrice: ethers.parseUnits('50', 'gwei')
});
```

### Test Failures

#### "Timeout waiting for transaction"

**Solution:**
Increase timeout in hardhat.config.js:
```javascript
networks: {
    hardhat: {
        timeout: 100000
    }
}
```

#### "Nonce too low"

**Solution:**
```bash
# Reset Hardhat network
npx hardhat clean
npx hardhat node --reset
```

### Runtime Errors

#### "VaultNotFound"

**Causes:**
- Invalid vault ID
- Vault doesn't exist

**Solution:**
```javascript
const vaultCount = await vaultManager.getVaultCount();
if (vaultId > vaultCount) {
    console.error('Vault does not exist');
}
```

#### "UnauthorizedAccess"

**Causes:**
- Wrong account
- Missing permissions

**Solution:**
```javascript
const vault = await vaultManager.getVault(vaultId);
if (vault.owner !== await signer.getAddress()) {
    console.error('Not vault owner');
}
```

#### "VaultNotUnlockable"

**Causes:**
- Unlock time not reached
- Proof-of-life still active
- Oracle condition not fulfilled

**Solution:**
```javascript
const isUnlockable = await timelockVault.isUnlockable(vaultId);
if (!isUnlockable) {
    const timeRemaining = await timelockVault.getTimeRemaining(vaultId);
    console.log(`Wait ${timeRemaining} seconds`);
}
```

#### "InvalidPercentageSum"

**Cause:**
Heir percentages don't total 100%

**Solution:**
```javascript
const percentages = [5000, 3000, 2000]; // Must total 10000
const sum = percentages.reduce((a, b) => a + b, 0);
if (sum !== 10000) {
    console.error(`Sum is ${sum}, should be 10000`);
}
```

### Gas Issues

#### High gas costs

**Solutions:**
1. Optimize contract code
2. Batch operations
3. Use events for data storage
4. Deploy to L2 networks

**Check gas usage:**
```bash
REPORT_GAS=true npm test
```

#### Out of gas errors

**Solution:**
```javascript
const gasEstimate = await contract.estimateGas.function();
const tx = await contract.function({
    gasLimit: gasEstimate * 120n / 100n  // 20% buffer
});
```

### Network Issues

#### RPC endpoint timeout

**Solutions:**
1. Use different RPC provider
2. Implement retry logic
3. Check network status

```javascript
const provider = new ethers.JsonRpcProvider(
    RPC_URL,
    {
        timeout: 30000  // 30 seconds
    }
);
```

#### Chain ID mismatch

**Solution:**
```bash
# Verify network in hardhat.config.js
networks: {
    arbitrum: {
        url: ARBITRUM_RPC_URL,
        chainId: 42161
    }
}
```

### IPFS Issues

#### Cannot upload to IPFS

**Solutions:**
1. Check IPFS node connection
2. Verify API credentials
3. Use pinning service

```javascript
const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
        authorization: `Basic ${Buffer.from(PROJECT_ID + ':' + PROJECT_SECRET).toString('base64')}`
    }
});
```

#### Cannot retrieve from IPFS

**Solutions:**
1. Check CID validity
2. Wait for propagation
3. Use gateway fallback

```javascript
const gateways = [
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
    `https://gateway.pinata.cloud/ipfs/${cid}`
];
```

### Oracle Issues

#### Oracle not responding

**Solutions:**
1. Verify oracle contract address
2. Check oracle service status
3. Implement timeout logic
4. Use fallback oracles

```javascript
const ORACLE_TIMEOUT = 3600; // 1 hour
if (block.timestamp > requestTime + ORACLE_TIMEOUT) {
    // Use fallback
}
```

## Debug Commands

### Check contract deployment

```bash
npx hardhat verify --network arbitrum DEPLOYED_ADDRESS
```

### View transaction details

```bash
# Using etherscan
https://arbiscan.io/tx/TRANSACTION_HASH
```

### Test specific function

```bash
npx hardhat test --grep "function name"
```

### Check contract size

```bash
npm run size-check
```

### Analyze gas usage

```bash
REPORT_GAS=true npm test
npm run coverage-analyze
```

## Getting Help

1. **Check documentation**: Review docs folder
2. **Search issues**: GitHub issues tab
3. **Ask community**: Discord/Telegram
4. **Create issue**: Provide full error message and context

## Debugging Tips

### Enable verbose logging

```javascript
const tx = await contract.function();
console.log('Transaction:', tx);
const receipt = await tx.wait();
console.log('Receipt:', receipt);
```

### Use Hardhat console

```solidity
import "hardhat/console.sol";

function myFunction() {
    console.log("Debug value:", someValue);
}
```

### Test with mainnet fork

```bash
npx hardhat node --fork https://arb1.arbitrum.io/rpc
```

### Inspect contract storage

```bash
npx hardhat console --network localhost
const value = await contract.getStorageAt(address, slot);
```

