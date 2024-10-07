# Chronoverse

Decentralized time-capsule and inheritance protocol for secure asset management and future execution.

## Overview

Chronoverse is a blockchain-based protocol that enables users to lock assets, messages, and encrypted secrets on-chain, releasing them only at future timestamps or under verifiable conditions such as proof-of-life, heir signatures, or oracle-confirmed events.

## Features

- **Time-based unlock**: Assets release at specific timestamps or block heights
- **Multi-heir inheritance**: Programmable allocation rules for multiple beneficiaries
- **Proof-of-life mechanism**: Prevents premature unlock with regular check-ins
- **Encrypted secret vault**: Secure storage of messages, documents, and keys
- **Oracle-driven conditions**: External data integration for conditional unlocks
- **Audit trail**: Complete event logging for verifiable execution

## Use Cases

- On-chain inheritance with multiple heirs and custom allocation
- Time capsules for messages, wills, and proofs
- Delayed execution for long-term legal coordination
- DAO future instructions and delayed governance actions

## Technology Stack

- Solidity smart contracts
- EVM compatible (Arbitrum / Ethereum)
- Hardhat development framework
- Chainlink oracles for external data
- IPFS for encrypted storage
- TheGraph for indexing

## Getting Started

```bash
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests
npm test

# Deploy
npm run deploy
```

## License

MIT

