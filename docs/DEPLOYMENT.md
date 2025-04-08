# Deployment Guide

## Prerequisites

- Node.js v18+
- Hardhat installed
- Network RPC URLs
- Deployer wallet with sufficient balance
- Etherscan API keys for verification

## Configuration

Create `.env` file:

```env
PRIVATE_KEY=your_deployer_private_key
ARBITRUM_RPC_URL=https://arb1.arbitrum.io/rpc
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/YOUR_KEY
ARBISCAN_API_KEY=your_arbiscan_key
ETHERSCAN_API_KEY=your_etherscan_key
```

## Deployment Steps

### 1. Compile Contracts

```bash
npm run compile
```

### 2. Run Tests

```bash
npm test
```

### 3. Deploy to Testnet

```bash
npm run deploy -- --network goerli
```

### 4. Verify Contracts

```bash
npm run verify
```

### 5. Setup Roles

```bash
hardhat run scripts/setup-roles.js --network goerli
```

### 6. Test Deployment

```bash
hardhat run scripts/interact.js --network goerli
```

## Mainnet Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas optimization done
- [ ] Documentation updated
- [ ] Backup deployment keys
- [ ] Verify RPC endpoints
- [ ] Check deployer balance

### Deploy Command

```bash
npm run deploy:arbitrum
```

### Post-Deployment

1. Verify all contracts on Etherscan
2. Setup access control roles
3. Test vault creation
4. Document all addresses
5. Update frontend configuration
6. Announce deployment

## Network Addresses

### Arbitrum Mainnet

```
VaultManager: TBD
TimelockVault: TBD
HeirPolicy: TBD
ProofOfLife: TBD
SecretVault: TBD
OracleBridge: TBD
UnlockExecutor: TBD
```

### Ethereum Mainnet

```
VaultManager: TBD
TimelockVault: TBD
HeirPolicy: TBD
ProofOfLife: TBD
SecretVault: TBD
OracleBridge: TBD
UnlockExecutor: TBD
```

## Troubleshooting

### Insufficient Funds
Ensure deployer has enough ETH for gas fees.

### RPC Errors
Verify RPC URL is correct and accessible.

### Verification Fails
Check API keys and contract addresses.

### Role Setup Errors
Ensure deployment completed successfully first.

