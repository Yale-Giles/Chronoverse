# Contributing to Chronoverse

Thank you for your interest in contributing to Chronoverse!

## Development Setup

### Prerequisites
- Node.js v18 or higher
- npm or yarn
- Git

### Installation
```bash
git clone https://github.com/Yale-Giles/Chronoverse.git
cd Chronoverse
npm install
```

### Running Tests
```bash
npm test
```

### Code Style
We use Prettier and Solhint for code formatting:
```bash
npm run lint
npm run format
```

## Contribution Guidelines

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Messages

We follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `test:` Test additions or changes
- `refactor:` Code refactoring
- `chore:` Maintenance tasks
- `perf:` Performance improvements

### Code Review Process

1. All PRs require at least one approval
2. All tests must pass
3. Code coverage should not decrease
4. Follow existing code style
5. Add tests for new features

### Testing Requirements

- Unit tests for all new functions
- Integration tests for new workflows
- Gas optimization tests
- Security considerations documented

## Areas for Contribution

### High Priority
- Additional test coverage
- Gas optimization
- Documentation improvements
- Security enhancements

### Medium Priority
- Frontend development
- Oracle integrations
- Cross-chain support
- Subgraph development

### Low Priority
- Code refactoring
- Performance improvements
- Additional examples
- Tooling improvements

## Security

Please report security vulnerabilities to security@chronoverse.io.
Do not create public issues for security concerns.

## Questions?

- Open a discussion on GitHub
- Join our Discord community
- Check existing documentation

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

