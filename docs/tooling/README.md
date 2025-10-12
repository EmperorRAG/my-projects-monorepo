# Tooling Documentation

Documentation for tools, infrastructure, and development utilities used in the monorepo.

## Overview

This directory contains documentation for cross-cutting tools and infrastructure components that support the development and deployment of applications in the monorepo.

## Available Documentation

### Infrastructure Tools

#### NGINX
- **Purpose**: Reverse proxy, load balancer, and TLS termination
- **Documentation**: 
  - [NGINX Integration Guide](../nx-monorepo/nginx-integration.md)
  - [Detailed NGINX Docs](../../tools/nginx/README.md)
- **Key Topics**:
  - Edge proxy configuration
  - Load balancer setup
  - TLS/HTTPS configuration
  - Health checks
  - Performance tuning

#### Docker
- **Purpose**: Containerization platform
- **Documentation**: _(planned)_
- **Key Topics**:
  - Dockerfile best practices
  - Multi-stage builds
  - Docker Compose setup
  - Container orchestration

#### Certbot/Let's Encrypt
- **Purpose**: TLS certificate management
- **Documentation**: [Certbot Tools](../../tools/certbot/README.md)
- **Key Topics**:
  - Certificate generation
  - Automatic renewal
  - NGINX integration

### Development Tools

#### Nx
- **Purpose**: Monorepo build system
- **Documentation**: [Nx Monorepo Docs](../nx-monorepo/)
- **Key Topics**:
  - Configuration
  - Generators
  - Executors
  - Cache management

#### TypeScript
- **Purpose**: Type-safe development
- **Documentation**: `.github/instructions/typescript-5-es2022.instructions.md`
- **Key Topics**:
  - TypeScript configuration
  - Coding standards
  - Type safety patterns

#### Testing Tools

##### Playwright
- **Purpose**: End-to-end testing
- **Documentation**: `.github/instructions/playwright-typescript.instructions.md`
- **Key Topics**:
  - Test creation
  - Best practices
  - CI/CD integration

##### Jest
- **Purpose**: Unit and integration testing
- **Documentation**: _(planned)_
- **Key Topics**:
  - Test configuration
  - Mocking strategies
  - Coverage reporting

### CI/CD Tools

#### GitHub Actions
- **Purpose**: Continuous integration and deployment
- **Documentation**: _(planned)_
- **Key Topics**:
  - Workflow configuration
  - Secret management
  - Deployment automation

### Code Quality Tools

#### ESLint
- **Purpose**: Code linting
- **Documentation**: _(planned)_
- **Key Topics**:
  - ESLint configuration
  - Custom rules
  - Integration with editors

#### Prettier
- **Purpose**: Code formatting
- **Documentation**: _(planned)_
- **Key Topics**:
  - Prettier configuration
  - Format on save
  - Pre-commit hooks

#### TypeDoc
- **Purpose**: API documentation generation
- **Documentation**: _(planned)_
- **Key Topics**:
  - Documentation generation
  - TSDoc standards
  - Publishing docs

## Tool Categories

### Build Tools
- **Nx**: Monorepo orchestration
- **TypeScript Compiler**: Code compilation
- **Webpack/Vite**: Module bundling

### Testing Tools
- **Playwright**: E2E testing
- **Jest**: Unit testing
- **Testing Library**: Component testing

### Infrastructure Tools
- **Docker**: Containerization
- **NGINX**: Reverse proxy
- **Certbot**: TLS certificates

### Development Tools
- **ESLint**: Linting
- **Prettier**: Formatting
- **TypeDoc**: Documentation

### CI/CD Tools
- **GitHub Actions**: Automation
- **Docker Compose**: Local orchestration

## Quick References

### Common Commands

#### Nx Commands
```bash
# Build a project
npx nx build <project>

# Test a project
npx nx test <project>

# Run affected builds
npx nx affected:build

# Generate code
npx nx generate <generator>
```

#### Docker Commands
```bash
# Build image
docker build -t <name> .

# Run container
docker run -p 3000:3000 <name>

# Docker Compose
docker-compose up -d
```

#### NGINX Commands
```bash
# Validate config
nginx -t

# Reload config
nginx -s reload

# Test with Docker
docker run --rm -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf nginx nginx -t
```

### Configuration Files

| Tool | Config File | Location |
|------|-------------|----------|
| Nx | `nx.json` | Workspace root |
| TypeScript | `tsconfig.json` | Workspace root |
| ESLint | `eslint.config.mjs` | Workspace root |
| Prettier | `.prettierrc` | Workspace root |
| Jest | `jest.config.ts` | Workspace root |
| Docker Compose | `docker-compose.yaml` | Various |
| NGINX | `nginx.conf` | `tools/nginx/` |

## Tool Integration

### Nx Integration

All tools integrate with Nx through:
- **Executors**: Custom task runners
- **Generators**: Code scaffolding
- **Plugins**: Nx plugins for various frameworks
- **Task Pipeline**: Coordinated task execution

### CI/CD Integration

Tools are integrated into CI/CD pipelines:
- **Linting**: Pre-commit and CI checks
- **Testing**: Automated test execution
- **Building**: Production builds
- **Deployment**: Automated deployment

## Best Practices

### Tool Selection

✅ **Do**:
- Use official tools when available
- Prefer integrated tools over standalone
- Choose tools with good Nx support
- Consider maintenance and community
- Evaluate performance impact

❌ **Don't**:
- Add tools without evaluation
- Duplicate functionality
- Use deprecated tools
- Ignore security updates

### Configuration Management

✅ **Do**:
- Use workspace-level configs
- Share configs across projects
- Document configuration choices
- Version control all configs
- Use environment variables for secrets

❌ **Don't**:
- Hardcode values
- Duplicate configurations
- Commit secrets
- Override without reason

## Tool Documentation Structure

Each tool should have documentation that includes:

1. **Overview**: What the tool does
2. **Installation**: How to install/setup
3. **Configuration**: How to configure
4. **Usage**: How to use it
5. **Best Practices**: Recommended patterns
6. **Troubleshooting**: Common issues
7. **References**: External resources

## Adding New Tools

When adding a new tool:

1. **Evaluate**: Assess need and alternatives
2. **Document**: Create documentation
3. **Integrate**: Integrate with Nx
4. **Test**: Ensure it works correctly
5. **Update**: Update this index
6. **Train**: Share knowledge with team

## Troubleshooting

### Common Issues

#### Tool Not Found
- Verify installation: `npm list <tool>`
- Reinstall: `npm install`
- Check PATH configuration

#### Configuration Not Working
- Validate config syntax
- Check file location
- Review override settings
- Check for conflicts

#### Performance Issues
- Review cache configuration
- Check resource usage
- Optimize settings
- Consider alternatives

### Getting Help

1. Check tool-specific documentation
2. Review error logs
3. Search known issues
4. Consult team members
5. Check GitHub issues

## Related Documentation

- [Guides](../guides/)
- [Architecture](../architecture/)
- [Reference](../reference/)
- [Runbooks](../runbooks/)

## Contributing

To add tool documentation:

1. Create documentation following template
2. Add entry to this README
3. Update related guides
4. Cross-reference other docs
5. Consider updating llms.txt

## Maintenance

Regular maintenance tasks:

- **Monthly**: Review for outdated information
- **After Tool Updates**: Update version-specific details
- **When Issues Arise**: Document solutions
- **Quarterly**: Evaluate tool effectiveness

---

**For specific tool documentation, see the individual tool directories in `/tools` or check `.github/instructions/` for AI coding guidelines.**
