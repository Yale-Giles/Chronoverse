# Frequently Asked Questions

## General

### What is Chronoverse?
Chronoverse is a decentralized protocol for creating time-locked vaults with inheritance capabilities.

### How does it work?
You create a vault with specific unlock conditions (time, proof-of-life, oracle), configure heirs, deposit assets, and the system automatically distributes them when conditions are met.

### Which blockchains are supported?
Currently Ethereum and Arbitrum. More chains coming soon.

## Vault Creation

### What is the minimum unlock time?
Minimum 1 day from creation.

### Can I change unlock time later?
No, unlock times are immutable for security.

### What assets can I store?
ETH and any ERC20 tokens.

## Heirs

### How many heirs can I add?
Maximum 50 heirs per vault.

### Can heirs be changed?
Yes, before vault unlocks.

### Do percentages have to be exact?
Yes, must total exactly 100%.

## Proof-of-Life

### How often should I check in?
Depends on your configured inactivity period (default 90 days).

### What happens if I miss check-in?
A grace period applies, then vault becomes unlockable.

### Can I change inactivity period?
Yes, at any time before unlock.

## Security

### Are my secrets stored on-chain?
No, only encrypted IPFS references are stored.

### Can someone steal my assets?
No, vaults are secured by smart contracts with timelock guarantees.

### What if I lose my private key?
Configure heirs who can access after unlock conditions.

## Technical

### Which wallet do I need?
Any Web3 wallet (MetaMask, WalletConnect, etc).

### Are contracts audited?
Pending external audit.

### Is there a testnet?
Yes, deploy on Goerli/Sepolia for testing.

