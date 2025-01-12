# Chronoverse Architecture

## System Overview

Chronoverse is designed as a modular smart contract system with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                     VaultManager                         │
│              (Central Registry & Coordination)           │
└───────────┬─────────────────────────────────┬───────────┘
            │                                 │
    ┌───────▼────────┐                ┌──────▼────────┐
    │ TimelockVault  │                │  HeirPolicy   │
    │                │                │               │
    └───────┬────────┘                └──────┬────────┘
            │                                │
    ┌───────▼────────┐                ┌──────▼────────┐
    │ ProofOfLife    │                │ SecretVault   │
    │                │                │               │
    └────────────────┘                └───────────────┘
            │                                │
    ┌───────▼────────┐                ┌──────▼────────┐
    │ OracleBridge   │                │UnlockExecutor │
    │                │                │               │
    └────────────────┘                └───────────────┘
```

## Core Components

### VaultManager
- **Role**: Central registry and vault lifecycle management
- **Responsibilities**:
  - Vault creation and configuration
  - Vault status tracking
  - Owner verification
  - Vault closure and cancellation

### TimelockVault
- **Role**: Time-based and block-based locking mechanism
- **Responsibilities**:
  - Schedule unlock times/blocks
  - Verify unlock conditions
  - Trigger unlocking when conditions met
  - Prevent premature unlocking

### HeirPolicy
- **Role**: Inheritance distribution management
- **Responsibilities**:
  - Configure multiple heirs
  - Set distribution percentages
  - Validate allocation rules
  - Track claim status

### ProofOfLife
- **Role**: Activity monitoring and inactivity detection
- **Responsibilities**:
  - Track owner check-ins
  - Monitor inactivity periods
  - Manage grace periods
  - Enable conditional unlocking

### SecretVault
- **Role**: Encrypted data storage pointer
- **Responsibilities**:
  - Store IPFS CID references
  - Manage content hashes
  - Handle secret revocation
  - Control access to encrypted data

### OracleBridge
- **Role**: External data integration
- **Responsibilities**:
  - Set oracle conditions
  - Receive oracle responses
  - Verify condition fulfillment
  - Manage trusted oracles

### UnlockExecutor
- **Role**: Final asset distribution
- **Responsibilities**:
  - Execute unlock process
  - Distribute assets to heirs
  - Finalize vault state
  - Handle ETH and ERC20 tokens

## Data Flow

### Vault Creation Flow
1. User calls `VaultManager.createVault()`
2. VaultManager creates vault record
3. TimelockVault schedules unlock
4. Optional: ProofOfLife initialized
5. Optional: OracleBridge condition set
6. HeirPolicy configured
7. SecretVault stores encrypted data
8. Assets deposited to UnlockExecutor

### Unlock Execution Flow
1. Time/block condition met (TimelockVault)
2. Proof-of-life inactive (ProofOfLife)
3. Oracle condition fulfilled (OracleBridge)
4. UnlockExecutor triggered
5. Assets distributed per HeirPolicy
6. Secrets revealed (SecretVault)
7. Vault finalized

## Security Considerations

### Access Control
- Role-based permissions (OpenZeppelin AccessControl)
- Multi-signature requirements for critical operations
- Separate roles for different contract functions

### Timelock Guarantees
- Monotonic time checks (no backward manipulation)
- Minimum unlock delays enforced
- Multiple unlock condition support

### Asset Safety
- ReentrancyGuard on all value transfers
- Pull-over-push payment pattern
- Emergency pause mechanisms

### Data Privacy
- No plaintext secrets on-chain
- IPFS CID references only
- Encrypted storage with revocable keys

## Gas Optimization

### Storage Patterns
- Packed structs for efficient storage
- Mapping over array iteration where possible
- Lazy evaluation of expensive operations

### Execution Patterns
- Batch operations support
- Minimal external calls
- Efficient loops with early exits

## Upgrade Strategy

### Current Approach
- Immutable core contracts
- Proxy pattern not initially implemented
- Future upgrade via migration

### Future Considerations
- UUPS proxy pattern for upgrades
- Time-locked governance for changes
- Migration tools for existing vaults

## Testing Strategy

### Unit Tests
- Individual contract function testing
- Edge case validation
- Error condition handling

### Integration Tests
- Multi-contract interaction flows
- End-to-end scenarios
- Gas usage profiling

### Security Tests
- Reentrancy attack prevention
- Access control verification
- Oracle manipulation resistance

## Deployment Checklist

- [ ] Deploy VaultManager
- [ ] Deploy TimelockVault with VaultManager address
- [ ] Deploy HeirPolicy with VaultManager address
- [ ] Deploy ProofOfLife with VaultManager address
- [ ] Deploy SecretVault with VaultManager address
- [ ] Deploy OracleBridge with VaultManager address
- [ ] Deploy UnlockExecutor with VaultManager and HeirPolicy
- [ ] Grant necessary roles
- [ ] Verify all contracts on Etherscan
- [ ] Test vault creation
- [ ] Test complete unlock flow

