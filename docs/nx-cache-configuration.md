# Nx Cache Directory Configuration

## Overview

This document describes how to configure a custom cache directory for Nx, allowing you to store cache files outside of cloud-synced directories like OneDrive. This prevents unnecessary synchronization of temporary files and significantly improves build performance.

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Solution](#solution)
- [Setup Instructions](#setup-instructions)
- [Configuration Reference](#configuration-reference)
- [Troubleshooting](#troubleshooting)
- [Cross-Platform Support](#cross-platform-support)
- [Advanced Usage](#advanced-usage)

## Problem Statement

When working with Nx in a directory that's synchronized with cloud storage services (like OneDrive, Dropbox, or Google Drive), you may experience:

- **Performance degradation**: Cloud sync services try to upload/sync Nx cache files, which are temporary and change frequently
- **Permission errors**: As described in the issue, operations like `EPERM: operation not permitted` when Nx tries to update cache files
- **Unnecessary network usage**: Large cache files being uploaded to cloud storage
- **Build failures**: Sync conflicts can cause build operations to fail

## Solution

The Nx cache directory configuration system provides a simple way to specify an alternative location for Nx cache files:

1. **Configuration File**: `.nx-cache-config` - stores the custom cache directory path
2. **Setup Script**: `scripts/nx-setup-cache.sh` - reads the config and sets the environment variable
3. **Environment Variable**: `NX_CACHE_DIRECTORY` - Nx uses this to determine where to store cache files

## Setup Instructions

### Quick Start

1. **Copy the example configuration file**:
   ```bash
   cp .nx-cache-config.example .nx-cache-config
   ```

2. **Edit the configuration file**:
   ```bash
   # Open .nx-cache-config in your editor
   nano .nx-cache-config
   # or
   code .nx-cache-config
   ```

3. **Set your cache directory path**:
   ```bash
   # Example: Store cache outside OneDrive
   NX_CACHE_DIR=C:/dev-cache/nx-cache
   
   # Or use a relative path
   NX_CACHE_DIR=../nx-cache-external
   
   # Or use home directory
   NX_CACHE_DIR=~/dev-cache/nx-cache
   ```

4. **Source the setup script**:
   ```bash
   source ./scripts/nx-setup-cache.sh
   ```

5. **Run Nx commands normally**:
   ```bash
   nx build my-app
   nx test my-lib
   nx run-many -t build
   ```

### Permanent Setup

To automatically configure the cache directory every time you open a terminal:

#### Linux/macOS/WSL

Add to your `~/.bashrc` or `~/.zshrc`:
```bash
# Nx cache directory configuration
if [ -f "/path/to/workspace/scripts/nx-setup-cache.sh" ]; then
    source /path/to/workspace/scripts/nx-setup-cache.sh
fi
```

#### Windows (PowerShell)

Create a PowerShell profile script (see [PowerShell Setup](#powershell-setup) below).

#### Windows (Git Bash)

Add to your `~/.bashrc`:
```bash
# Nx cache directory configuration
if [ -f "/c/path/to/workspace/scripts/nx-setup-cache.sh" ]; then
    source /c/path/to/workspace/scripts/nx-setup-cache.sh
fi
```

## Configuration Reference

### Configuration File Format

The `.nx-cache-config` file uses a simple key-value format:

```bash
# Comments are allowed (lines starting with #)

# Set the cache directory path
NX_CACHE_DIR=/path/to/cache
```

### Path Types

The configuration supports multiple path formats:

#### Absolute Paths

**Windows**:
```bash
# Using forward slashes (recommended)
NX_CACHE_DIR=C:/dev-cache/nx-cache

# Using backslashes (will be converted to forward slashes)
NX_CACHE_DIR=C:\dev-cache\nx-cache
```

**Linux/macOS**:
```bash
NX_CACHE_DIR=/home/user/dev-cache/nx-cache
NX_CACHE_DIR=/Users/username/dev-cache/nx-cache
```

#### Relative Paths

Relative to the workspace root:
```bash
# One level up from workspace
NX_CACHE_DIR=../nx-cache-external

# Inside a specific directory
NX_CACHE_DIR=.cache/nx
```

#### Home Directory

Using tilde expansion:
```bash
# Linux/macOS/WSL
NX_CACHE_DIR=~/dev-cache/nx-cache

# Windows (Git Bash)
NX_CACHE_DIR=~/dev-cache/nx-cache
```

### Environment Variables

The setup script sets the following environment variable:

- **`NX_CACHE_DIRECTORY`**: The fully resolved path where Nx will store cache files

You can verify it's set correctly:
```bash
echo $NX_CACHE_DIRECTORY
```

## Troubleshooting

### Cache Directory Not Created

**Problem**: The cache directory doesn't exist after running the setup script.

**Solutions**:
1. Check if you have write permissions to the parent directory
2. Verify the path is correct (no typos)
3. Try creating the directory manually first:
   ```bash
   mkdir -p /path/to/cache
   ```

### Permission Errors

**Problem**: Getting "Permission denied" errors.

**Solutions**:
1. Ensure the cache directory is not inside a restricted folder
2. Check filesystem permissions:
   ```bash
   ls -la /path/to/parent
   ```
3. On Windows, ensure you're not trying to write to a system directory

### Cache Still in .nx Directory

**Problem**: Nx is still using `.nx/cache` instead of the configured directory.

**Solutions**:
1. Verify the setup script was sourced (not executed):
   ```bash
   # Correct (source)
   source ./scripts/nx-setup-cache.sh
   
   # Wrong (execute)
   ./scripts/nx-setup-cache.sh
   ```

2. Check if `NX_CACHE_DIRECTORY` is set:
   ```bash
   echo $NX_CACHE_DIRECTORY
   ```

3. Make sure `.nx-cache-config` has the correct path

### Script Not Found

**Problem**: `bash: ./scripts/nx-setup-cache.sh: No such file or directory`

**Solutions**:
1. Ensure you're in the workspace root directory
2. Check if the script exists:
   ```bash
   ls -la scripts/nx-setup-cache.sh
   ```
3. Verify the script has execute permissions:
   ```bash
   chmod +x scripts/nx-setup-cache.sh
   ```

## Cross-Platform Support

The cache directory configuration system is designed to work seamlessly across different platforms:

### Linux

- **Shell**: Bash, Zsh
- **Path Format**: Unix-style (`/home/user/cache`)
- **Setup**: Add to `~/.bashrc` or `~/.zshrc`

### macOS

- **Shell**: Bash, Zsh (default on macOS 10.15+)
- **Path Format**: Unix-style (`/Users/username/cache`)
- **Setup**: Add to `~/.bashrc` or `~/.zshrc`

### Windows

#### WSL (Windows Subsystem for Linux)

- **Shell**: Bash
- **Path Format**: Unix-style (`/home/user/cache` or `/mnt/c/cache`)
- **Setup**: Add to `~/.bashrc`

#### Git Bash

- **Shell**: Bash (via Git for Windows)
- **Path Format**: Unix-style with drive letters (`/c/cache` or `C:/cache`)
- **Setup**: Add to `~/.bashrc`

#### PowerShell

For PowerShell users, create a PowerShell version of the setup script:

<details>
<summary>PowerShell Setup</summary>

Create `scripts/nx-setup-cache.ps1`:

```powershell
# Read configuration
$configFile = Join-Path $PSScriptRoot "..\\.nx-cache-config"
if (Test-Path $configFile) {
    Get-Content $configFile | Where-Object { $_ -match '^NX_CACHE_DIR=' } | ForEach-Object {
        $cacheDir = $_.Split('=')[1].Trim()
        if ($cacheDir) {
            # Convert to absolute path if relative
            if (-not [System.IO.Path]::IsPathRooted($cacheDir)) {
                $cacheDir = Join-Path $PSScriptRoot ".." $cacheDir
            }
            
            # Create directory if it doesn't exist
            if (-not (Test-Path $cacheDir)) {
                New-Item -ItemType Directory -Path $cacheDir -Force | Out-Null
            }
            
            # Set environment variable
            $env:NX_CACHE_DIRECTORY = $cacheDir
            Write-Host "Nx cache directory configured: $cacheDir" -ForegroundColor Green
        }
    }
}
```

Add to your PowerShell profile (`$PROFILE`):
```powershell
. "C:\path\to\workspace\scripts\nx-setup-cache.ps1"
```

</details>

## Advanced Usage

### Multiple Workspaces

If you work with multiple Nx workspaces, you can:

1. **Use a shared cache directory**:
   ```bash
   # In workspace 1
   NX_CACHE_DIR=~/shared-nx-cache
   
   # In workspace 2
   NX_CACHE_DIR=~/shared-nx-cache
   ```

2. **Use workspace-specific cache directories**:
   ```bash
   # In workspace 1
   NX_CACHE_DIR=~/nx-cache/workspace1
   
   # In workspace 2
   NX_CACHE_DIR=~/nx-cache/workspace2
   ```

### CI/CD Integration

For CI/CD pipelines, you can set the environment variable directly:

```yaml
# GitHub Actions
- name: Setup Nx cache
  run: |
    export NX_CACHE_DIRECTORY=/tmp/nx-cache
    mkdir -p $NX_CACHE_DIRECTORY

# GitLab CI
variables:
  NX_CACHE_DIRECTORY: /tmp/nx-cache

before_script:
  - mkdir -p $NX_CACHE_DIRECTORY
```

### Temporary Override

To temporarily use a different cache directory without changing the configuration:

```bash
# Single command
NX_CACHE_DIRECTORY=/tmp/nx-cache nx build my-app

# Current session only
export NX_CACHE_DIRECTORY=/tmp/nx-cache
nx build my-app
```

### Cache Management

#### Clear Cache

```bash
# Clear all cache
rm -rf $NX_CACHE_DIRECTORY/*

# Clear specific project cache
rm -rf $NX_CACHE_DIRECTORY/terminalOutputs-*
```

#### Check Cache Size

```bash
# Linux/macOS
du -sh $NX_CACHE_DIRECTORY

# Windows (Git Bash)
du -sh $NX_CACHE_DIRECTORY

# Windows (PowerShell)
Get-ChildItem $env:NX_CACHE_DIRECTORY -Recurse | Measure-Object -Property Length -Sum
```

### Integration with IDE

#### VS Code

Add to `.vscode/settings.json`:
```json
{
  "terminal.integrated.env.linux": {
    "NX_CACHE_DIRECTORY": "/path/to/cache"
  },
  "terminal.integrated.env.osx": {
    "NX_CACHE_DIRECTORY": "/path/to/cache"
  },
  "terminal.integrated.env.windows": {
    "NX_CACHE_DIRECTORY": "C:/path/to/cache"
  }
}
```

#### JetBrains IDEs (WebStorm, IntelliJ IDEA)

1. Go to Settings → Tools → Terminal
2. Add to "Environment variables":
   ```
   NX_CACHE_DIRECTORY=/path/to/cache
   ```

## Best Practices

1. **Choose a fast local drive**: Use an SSD for better performance
2. **Keep cache outside cloud sync**: Avoid OneDrive, Dropbox, etc.
3. **Regular cleanup**: Periodically clear old cache files
4. **Backup important data only**: Don't backup the cache directory
5. **Monitor disk space**: Cache can grow large, ensure adequate space
6. **Use .gitignore**: Add custom cache paths to `.gitignore`

## Security Considerations

1. **Permissions**: Ensure the cache directory has appropriate read/write permissions
2. **Sensitive Data**: Be aware that cache may contain build artifacts - protect accordingly
3. **Multi-user Systems**: Use user-specific cache directories
4. **Shared Cache**: Only share cache between trusted workspaces/users

## Related Documentation

- [Nx Official Documentation - Cache](https://nx.dev/concepts/how-caching-works)
- [Nx Environment Variables](https://nx.dev/recipes/running-tasks/configure-inputs#environment-variables)
- [Repository README](../README.md)
- [Contributing Guide](../.github/CONTRIBUTING.md)

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [Nx documentation](https://nx.dev)
3. Open an issue in the repository
4. Contact the development team

---

**Last Updated**: October 2025  
**Version**: 1.0.0
