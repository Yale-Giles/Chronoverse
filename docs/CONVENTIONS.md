# Coding Conventions

## Solidity Style Guide

### Naming Conventions

**Contracts**: PascalCase
```solidity
contract VaultManager { }
```

**Functions**: camelCase
```solidity
function createVault() { }
```

**Variables**: camelCase
```solidity
uint256 unlockTime;
```

**Constants**: UPPER_SNAKE_CASE
```solidity
uint256 public constant MAX_HEIRS = 50;
```

**Events**: PascalCase
```solidity
event VaultCreated(uint256 indexed vaultId);
```

### Code Organization

1. Pragma statements
2. Imports
3. Interfaces
4. Libraries
5. Contracts

Within contracts:
1. Type declarations
2. State variables
3. Events
4. Modifiers
5. Constructor
6. External functions
7. Public functions
8. Internal functions
9. Private functions

### Comments

Use NatSpec format:
```solidity
/**
 * @dev Creates a new vault
 * @param unlockTime Unix timestamp for unlock
 * @return vaultId The created vault ID
 */
function createVault(uint256 unlockTime) external returns (uint256 vaultId) {
    // Implementation
}
```

## JavaScript/TypeScript

### File Naming
- Lowercase with hyphens: `vault-manager.js`
- Test files: `VaultManager.test.js`

### Variables
```javascript
const vaultId = 1;  // camelCase
const UNLOCK_TIME = 3600;  // Constants in UPPER_CASE
```

### Functions
```javascript
async function deployContracts() {
    // Implementation
}
```

## Git Commit Messages

### Format
```
type(scope): subject

body

footer
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Code refactoring
- `chore`: Maintenance
- `perf`: Performance

### Examples
```
feat(vault): add multi-signature support

Implements multi-sig approval for vault operations.
Requires N of M signatures before execution.

Closes #123
```

## Testing Conventions

### Test Structure
```javascript
describe("ContractName", function () {
    describe("FunctionName", function () {
        it("Should do expected behavior", async function () {
            // Test implementation
        });
    });
});
```

### Test Naming
- Use "Should" statements
- Be specific and descriptive
- One assertion per test when possible

## Documentation

### README Structure
1. Project name and description
2. Features
3. Installation
4. Usage
5. Contributing
6. License

### Code Documentation
- Document all public functions
- Explain complex logic
- Provide usage examples
- Note security considerations

## Security

### Best Practices
- Use latest Solidity version
- Enable optimizer
- Use OpenZeppelin contracts
- Follow CEI pattern
- Add reentrancy guards
- Validate all inputs

### Access Control
```solidity
modifier onlyOwner() {
    require(msg.sender == owner, "Not owner");
    _;
}
```

## Gas Optimization

### Techniques
- Pack storage variables
- Use `calldata` for arrays
- Cache array lengths
- Use events for data
- Minimize storage writes

