# Quick Reference: Nx Cache Configuration & NGINX Scripts

## Nx Cache Configuration

### Problem
OneDrive (or other cloud sync) causing permission errors with Nx cache files.

### Solution
Configure Nx to use a cache directory outside of cloud-synced folders.

### Setup (3 steps)

1. **Copy configuration template**:
   ```bash
   cp .nx-cache-config.example .nx-cache-config
   ```

2. **Edit configuration** (set your cache path):
   ```bash
   # Example paths:
   # Windows: NX_CACHE_DIR=C:/dev-cache/nx-cache
   # Linux/macOS: NX_CACHE_DIR=/home/user/dev-cache/nx-cache
   # Relative: NX_CACHE_DIR=../nx-cache-external
   
   echo 'NX_CACHE_DIR=/your/desired/path' > .nx-cache-config
   ```

3. **Activate configuration**:
   ```bash
   source ./scripts/nx-setup-cache.sh
   ```

### Make Permanent (Optional)

Add to your shell profile:

**Linux/macOS/WSL (Bash)**:
```bash
echo 'source /path/to/workspace/scripts/nx-setup-cache.sh' >> ~/.bashrc
```

**macOS (Zsh)**:
```bash
echo 'source /path/to/workspace/scripts/nx-setup-cache.sh' >> ~/.zshrc
```

**Windows (Git Bash)**:
```bash
echo 'source /c/path/to/workspace/scripts/nx-setup-cache.sh' >> ~/.bashrc
```

### Verify

Check that environment variable is set:
```bash
echo $NX_CACHE_DIRECTORY
```

## NGINX Validation Scripts

### New: Bash Script (Recommended)

**Validate single scenario**:
```bash
bash tools/nginx/scripts/validate-nginx-config.sh proxy-edge
```

**Validate all scenarios**:
```bash
bash tools/nginx/scripts/validate-nginx-config.sh all
```

**Via Nx (easiest)**:
```bash
nx run nginx:validate-config
```

### Available Scenarios

- `proxy-edge` - Edge proxy configuration
- `lb-frontend` - Frontend load balancer
- `lb-api` - API load balancer
- `lb-email` - Email load balancer
- `all` - All scenarios

### Old: PowerShell Script (Deprecated)

⚠️ **Deprecated**: Use Bash script instead for cross-platform compatibility.

Still available for backward compatibility:
```powershell
pwsh -File tools/nginx/scripts/validate-nginx-config.ps1 proxy-edge
```

## Common Commands

### Nx Cache

```bash
# Setup cache
source ./scripts/nx-setup-cache.sh

# Check cache location
echo $NX_CACHE_DIRECTORY

# Build with custom cache
nx build my-app

# Clear cache
rm -rf $NX_CACHE_DIRECTORY/*
```

### NGINX Validation

```bash
# Quick validation (all scenarios)
nx run nginx:validate-config

# Specific scenario
bash tools/nginx/scripts/validate-nginx-config.sh lb-frontend

# Infrastructure validation
bash tools/nginx/validate.sh
```

### NGINX Operations

```bash
# Start infrastructure
nx run nginx:serve

# Stop infrastructure
nx run nginx:stop

# Restart infrastructure
nx run nginx:restart

# View logs
nx run nginx:docker:compose-logs

# Health check
nx run nginx:health-check

# Reload config (zero downtime)
nx run nginx:reload-config
```

## Troubleshooting

### Cache Setup Issues

**Problem**: Cache directory not created
```bash
# Check permissions
ls -la /path/to/parent

# Create manually
mkdir -p /path/to/cache
```

**Problem**: Environment variable not set
```bash
# Make sure you sourced (not executed) the script
source ./scripts/nx-setup-cache.sh

# Verify
echo $NX_CACHE_DIRECTORY
```

### NGINX Validation Issues

**Problem**: Docker not found
```bash
# Install Docker
# https://docs.docker.com/get-docker/

# Verify installation
docker --version
```

**Problem**: Validation fails
```bash
# Check logs
docker logs <container-id>

# Validate specific config
docker run --rm -v $(pwd)/tools/nginx/common/base.nginx.conf:/etc/nginx/nginx.conf:ro nginx:1.27-alpine nginx -t
```

## Documentation Links

- 📖 [Nx Cache Configuration Guide](docs/nx-cache-configuration.md)
- 📋 [Implementation Summary](docs/nx-cache-implementation-summary.md)
- 🔧 [NGINX Tools README](tools/nginx/README.md)
- 📚 [NGINX Operations Runbook](tools/nginx/RUNBOOK.md)
- 🚀 [NGINX Quick Start](tools/nginx/QUICKSTART.md)

## Platform-Specific Notes

### Windows

- Use Git Bash or WSL for best compatibility
- PowerShell users: See documentation for PowerShell-specific setup
- Paths can use forward slashes: `C:/cache` or backslashes: `C:\cache`

### Linux

- All scripts work natively
- No additional setup required
- Use standard Unix paths: `/home/user/cache`

### macOS

- All scripts work natively
- Use Zsh or Bash
- Use standard Unix paths: `/Users/username/cache`

## Quick Tips

💡 **Tip 1**: Store cache on fastest drive (SSD) for better performance

💡 **Tip 2**: Keep cache outside cloud-synced folders (OneDrive, Dropbox, etc.)

💡 **Tip 3**: Use absolute paths to avoid confusion with relative paths

💡 **Tip 4**: Add cache directory to your backup exclusions

💡 **Tip 5**: Periodically clear cache if disk space is limited:
```bash
rm -rf $NX_CACHE_DIRECTORY/*
```

## Support

Need help?

1. Check the comprehensive documentation links above
2. Review error messages (they're designed to be helpful!)
3. Run validation scripts for diagnostics
4. Open an issue in the repository

---

**Last Updated**: October 2025  
**Version**: 1.0.0
