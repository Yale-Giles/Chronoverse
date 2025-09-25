# Testing Guide

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx hardhat test test/VaultManager.test.js

# Run with gas reporter
REPORT_GAS=true npm test

# Generate coverage report
npm run test:coverage
```

## Test Structure

### Unit Tests
- `VaultManager.test.js` - Core vault management
- `TimelockVault.test.js` - Time-based locking
- `HeirPolicy.test.js` - Inheritance rules
- `ProofOfLife.test.js` - Activity monitoring
- `SecretVault.test.js` - Encrypted storage
- `OracleBridge.test.js` - Oracle integration
- `UnlockExecutor.test.js` - Asset distribution

### Integration Tests
- `Integration.test.js` - End-to-end workflows

### Helper Tests
- `VaultLib.test.js` - Library functions
- `Mocks.test.js` - Mock contracts

## Writing Tests

### Basic Test Template

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ContractName", function () {
    let contract;
    let owner, user1;
    
    beforeEach(async function () {
        [owner, user1] = await ethers.getSigners();
        const Contract = await ethers.getContractFactory("ContractName");
        contract = await Contract.deploy();
    });
    
    it("Should do something", async function () {
        // Test implementation
        expect(await contract.someFunction()).to.equal(expected);
    });
});
```

## Coverage Goals

- Line coverage: > 90%
- Branch coverage: > 85%
- Function coverage: > 95%

## Gas Benchmarks

| Operation | Estimated Gas |
|-----------|--------------|
| Create Vault | ~200,000 |
| Set Heirs | ~150,000 |
| Check In | ~50,000 |
| Trigger Unlock | ~100,000 |
| Distribute Assets | ~180,000 |

## Testing Checklist

- [ ] All happy paths tested
- [ ] Error conditions covered
- [ ] Edge cases handled
- [ ] Access control verified
- [ ] Event emissions checked
- [ ] Gas usage optimized

