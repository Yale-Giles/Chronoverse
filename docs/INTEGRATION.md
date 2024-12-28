# Integration Guide

## Frontend Integration

### Web3 Setup

```javascript
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();

// Load contract
const vaultManager = new ethers.Contract(
    VAULT_MANAGER_ADDRESS,
    VaultManagerABI,
    signer
);
```

### Creating a Vault

```javascript
async function createVault(unlockDate) {
    const unlockTime = Math.floor(unlockDate.getTime() / 1000);
    
    const tx = await vaultManager.createVault(
        unlockTime,
        0,           // No block-based unlock
        true,        // Enable proof-of-life
        false        // No oracle
    );
    
    const receipt = await tx.wait();
    const vaultId = receipt.logs[0].args.vaultId;
    
    return vaultId;
}
```

### Configuring Heirs

```javascript
async function setHeirs(vaultId, heirAddresses, percentages) {
    const heirPolicy = new ethers.Contract(
        HEIR_POLICY_ADDRESS,
        HeirPolicyABI,
        signer
    );
    
    const tx = await heirPolicy.setHeirPolicy(
        vaultId,
        heirAddresses,
        percentages,
        0  // No quorum
    );
    
    await tx.wait();
}
```

### Monitoring Events

```javascript
// Listen for vault creation
vaultManager.on("VaultCreated", (vaultId, owner, unlockTime) => {
    console.log(`New vault created: ${vaultId}`);
    console.log(`Owner: ${owner}`);
    console.log(`Unlock: ${new Date(unlockTime * 1000)}`);
});

// Listen for unlock events
timelockVault.on("UnlockTriggered", (vaultId, triggeredBy, timestamp) => {
    console.log(`Vault ${vaultId} unlocked by ${triggeredBy}`);
});
```

## Backend Integration

### Node.js Service

```javascript
const { ethers } = require('ethers');

class ChronoverseSer

vice {
    constructor(providerUrl, privateKey) {
        this.provider = new ethers.JsonRpcProvider(providerUrl);
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.contracts = {};
    }
    
    async loadContracts() {
        this.contracts.vaultManager = new ethers.Contract(
            process.env.VAULT_MANAGER_ADDRESS,
            VaultManagerABI,
            this.wallet
        );
        // Load other contracts...
    }
    
    async getVaultStatus(vaultId) {
        const vault = await this.contracts.vaultManager.getVault(vaultId);
        const isUnlockable = await this.contracts.timelockVault.isUnlockable(vaultId);
        
        return {
            owner: vault.owner,
            status: vault.status,
            unlockTime: vault.unlockTime,
            isUnlockable
        };
    }
}
```

### Cron Job for Monitoring

```javascript
const cron = require('node-cron');

// Check for unlockable vaults every hour
cron.schedule('0 * * * *', async () => {
    const vaultCount = await vaultManager.getVaultCount();
    
    for (let i = 1; i <= vaultCount; i++) {
        const isUnlockable = await timelockVault.isUnlockable(i);
        
        if (isUnlockable) {
            console.log(`Vault ${i} is ready to unlock`);
            // Notify heirs...
        }
    }
});
```

## TheGraph Integration

### Subgraph Schema

```graphql
type Vault @entity {
  id: ID!
  owner: Bytes!
  unlockTime: BigInt!
  unlockBlock: BigInt!
  status: Int!
  createdAt: BigInt!
  heirs: [Heir!]! @derivedFrom(field: "vault")
}

type Heir @entity {
  id: ID!
  vault: Vault!
  address: Bytes!
  percentage: BigInt!
  claimed: Boolean!
}
```

### Querying Data

```javascript
const query = `
  query GetUserVaults($owner: Bytes!) {
    vaults(where: { owner: $owner }) {
      id
      unlockTime
      status
      heirs {
        address
        percentage
      }
    }
  }
`;

const result = await request(SUBGRAPH_URL, query, { owner: userAddress });
```

## IPFS Integration

### Storing Encrypted Secrets

```javascript
import { create } from 'ipfs-http-client';
import { encrypt } from './crypto';

async function storeSecret(secretData, encryptionKey) {
    const ipfs = create({ url: 'https://ipfs.infura.io:5001' });
    
    // Encrypt data
    const encrypted = await encrypt(secretData, encryptionKey);
    
    // Upload to IPFS
    const { cid } = await ipfs.add(encrypted);
    
    // Store CID on-chain
    const contentHash = ethers.keccak256(ethers.toUtf8Bytes(cid.toString()));
    await secretVault.storeSecret(vaultId, cid.toString(), contentHash);
    
    return cid.toString();
}
```

### Retrieving Secrets

```javascript
async function retrieveSecret(vaultId, decryptionKey) {
    // Get CID from contract
    const secret = await secretVault.getSecret(vaultId);
    
    if (secret.isRevoked) {
        throw new Error('Secret has been revoked');
    }
    
    // Fetch from IPFS
    const ipfs = create({ url: 'https://ipfs.infura.io:5001' });
    const chunks = [];
    
    for await (const chunk of ipfs.cat(secret.encryptedCID)) {
        chunks.push(chunk);
    }
    
    const encrypted = Buffer.concat(chunks);
    
    // Decrypt
    const decrypted = await decrypt(encrypted, decryptionKey);
    
    return decrypted;
}
```

## Best Practices

### Error Handling

```javascript
try {
    const tx = await vaultManager.createVault(...);
    await tx.wait();
} catch (error) {
    if (error.code === 'CALL_EXCEPTION') {
        // Custom error from contract
        console.error('Contract error:', error.reason);
    } else if (error.code === 'INSUFFICIENT_FUNDS') {
        console.error('Insufficient gas');
    } else {
        console.error('Unexpected error:', error);
    }
}
```

### Transaction Management

```javascript
// Estimate gas
const gasEstimate = await vaultManager.createVault.estimateGas(...);
const gasLimit = gasEstimate * 120n / 100n; // 20% buffer

// Send with custom gas
const tx = await vaultManager.createVault(..., { gasLimit });
```

### Security

- Validate all user inputs
- Use checksummed addresses
- Verify transaction receipts
- Implement rate limiting
- Use environment variables for sensitive data

