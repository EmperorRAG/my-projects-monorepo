# Certbot Auto-Installation Workflow

This document demonstrates the complete workflow for setting up certbot and Let's Encrypt certificates using the automated installation script.

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Step 1: Install Certbot (Automated)                          │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ nx run nginx:tls:install-certbot                     │    │
│  │                                                      │    │
│  │ → Detects OS automatically                          │    │
│  │ → Installs certbot with correct package manager    │    │
│  │ → Verifies installation                             │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                 │
│                           ↓                                     │
│                                                                 │
│  Step 2: Configure Let's Encrypt                              │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ nx run nginx:tls:setup-letsencrypt --                │    │
│  │   --domain yourdomain.com                            │    │
│  │   --email your@email.com                             │    │
│  │                                                      │    │
│  │ → Requests certificate from Let's Encrypt           │    │
│  │ → Configures automatic renewal                      │    │
│  │ → Sets up NGINX integration                         │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                 │
│                           ↓                                     │
│                                                                 │
│  Step 3: Start NGINX with TLS                                 │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ docker compose \                                      │    │
│  │   -f tools/nginx/docker-compose.yaml \               │    │
│  │   -f tools/nginx/docker-compose.prod.yaml \          │    │
│  │   -f tools/nginx/docker-compose.tls.yaml \           │    │
│  │   up -d                                               │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Supported Operating Systems

| OS/Distribution | Package Manager | Auto-Detected | Certbot Plugin |
|----------------|-----------------|---------------|----------------|
| Ubuntu         | apt-get         | ✅            | ✅ nginx       |
| Debian         | apt-get         | ✅            | ✅ nginx       |
| CentOS         | yum             | ✅            | ✅ nginx       |
| RHEL           | yum             | ✅            | ✅ nginx       |
| Fedora         | dnf             | ✅            | ✅ nginx       |
| Amazon Linux   | yum             | ✅            | ✅ nginx       |
| Alpine Linux   | apk             | ✅            | ✅ nginx       |
| macOS          | homebrew        | ✅            | ⚠️ manual      |
| Windows 10/11 (WSL) | apt/yum/dnf | ✅            | ✅ nginx       |

## Quick Start Examples

### Example 1: Ubuntu/Debian

```bash
# 1. Install certbot (automated)
$ nx run nginx:tls:install-certbot

=================================================================================================
Certbot Installation Script
=================================================================================================

[1/5] Checking for existing certbot installation...
  Certbot is not installed. Proceeding with installation...

[2/5] Detecting operating system...
✓ Detected: Ubuntu 22.04.3 LTS

[3/5] Checking prerequisites...
  Using sudo for package installation
✓ Package manager: apt-get

[4/5] Installing certbot...
  Updating package list...
  Installing certbot and nginx plugin...
✓ Certbot installed successfully

[5/5] Verifying installation...
✓ Certbot installed: certbot 1.32.0

=================================================================================================
✓ Certbot Installation Completed Successfully!
=================================================================================================

# 2. Configure Let's Encrypt
$ nx run nginx:tls:setup-letsencrypt -- --domain example.com --email admin@example.com

# 3. Start NGINX with TLS
$ docker compose -f tools/nginx/docker-compose.yaml \
    -f tools/nginx/docker-compose.prod.yaml \
    -f tools/nginx/docker-compose.tls.yaml \
    up -d
```

### Example 2: CentOS/RHEL

```bash
# 1. Install certbot (dry run to preview)
$ bash tools/nginx/scripts/tls/install-certbot.sh --dry-run

=================================================================================================
Certbot Installation Script
=================================================================================================

[1/5] Checking for existing certbot installation...
  Certbot is not installed. Proceeding with installation...

[2/5] Detecting operating system...
✓ Detected: CentOS Linux 8

[3/5] Checking prerequisites...
  Using sudo for package installation
✓ Package manager: yum

[4/5] Installing certbot...
  DRY RUN MODE - Commands that would be executed:

  sudo yum install -y epel-release
  sudo yum install -y certbot python3-certbot-nginx

[5/5] Skipped verification (dry run mode)

# 2. Actual installation
$ nx run nginx:tls:install-certbot

# 3. Configure and start as above...
```

### Example 3: macOS

```bash
# 1. Ensure Homebrew is installed
$ which brew || /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install certbot
$ nx run nginx:tls:install-certbot

=================================================================================================
Certbot Installation Script
=================================================================================================

[1/5] Checking for existing certbot installation...
  Certbot is not installed. Proceeding with installation...

[2/5] Detecting operating system...
✓ Detected: macOS

[3/5] Checking prerequisites...
✓ Package manager: Homebrew

[4/5] Installing certbot...
  Installing certbot...
✓ Certbot installed successfully

[5/5] Verifying installation...
✓ Certbot installed: certbot 2.7.4

=================================================================================================
✓ Certbot Installation Completed Successfully!
=================================================================================================

# 3. Configure and start as above...
```

### Example 4: Windows 10/11 (WSL)

```bash
# 1. Ensure WSL is installed (run in PowerShell as Administrator)
$ wsl --install

# 2. Open WSL terminal (Ubuntu by default)
$ wsl

# 3. Install certbot (from within WSL)
$ nx run nginx:tls:install-certbot

=================================================================================================
Certbot Installation Script
=================================================================================================

[1/5] Checking for existing certbot installation...
  Certbot is not installed. Proceeding with installation...

[2/5] Detecting operating system...
✓ Detected: WSL - Ubuntu 22.04.3 LTS

[3/5] Checking prerequisites...
  Using sudo for package installation
✓ Package manager: apt-get

[4/5] Installing certbot...
  Updating package list...
  Installing certbot and nginx plugin...
✓ Certbot installed successfully

[5/5] Verifying installation...
✓ Certbot installed: certbot 1.32.0

=================================================================================================
✓ Certbot Installation Completed Successfully!
=================================================================================================

# 4. Configure and start as above...
```

**Note for Windows Users:**
- If running from Git Bash (not WSL), the script will provide instructions to install WSL
- WSL (Windows Subsystem for Linux) is the recommended way to run certbot on Windows
- You can install WSL with: `wsl --install` (requires Windows 10 version 2004+ or Windows 11)

## Script Options

### Dry Run Mode

Preview what would be installed without making changes:

```bash
bash tools/nginx/scripts/tls/install-certbot.sh --dry-run
```

### Skip Package Manager Update

Skip the package manager update step (faster, but may install older versions):

```bash
bash tools/nginx/scripts/tls/install-certbot.sh --skip-update
```

### Get Help

Display usage information:

```bash
bash tools/nginx/scripts/tls/install-certbot.sh --help
```

## Integration with Nx

The installation script is fully integrated with Nx:

```bash
# View available TLS targets
nx show project nginx --json | jq '.targets | keys | .[] | select(startswith("tls:"))'

# Output:
# "tls:install-certbot"
# "tls:generate-dev-certs"
# "tls:validate-certs"
# "tls:rotate-certs"
# "tls:setup-letsencrypt"
# "tls:test-https"
```

## Testing

A comprehensive test suite is included:

```bash
# Run all tests
bash tools/nginx/scripts/tls/test-install-certbot.sh

# Output:
# =================================================================================================
# Testing install-certbot.sh
# =================================================================================================
# 
# Running test: Script exists and is executable
# ✓ PASSED
# 
# Running test: Help option works
# ✓ PASSED
# 
# [... 8 more tests ...]
# 
# =================================================================================================
# Test Summary
# =================================================================================================
# 
# Tests run:    10
# Tests passed: 10
# Tests failed: 0
# 
# ✓ All tests passed!
```

## Troubleshooting

### Certbot Already Installed

If certbot is already installed, the script will detect it and provide removal instructions:

```bash
$ nx run nginx:tls:install-certbot

=================================================================================================
Certbot Installation Script
=================================================================================================

[1/5] Checking for existing certbot installation...
✓ Certbot is already installed: certbot 1.32.0

To reinstall or upgrade, remove certbot first:

  sudo apt-get remove certbot

```

### Package Manager Not Found

Ensure your system's package manager is available:

```bash
# Ubuntu/Debian
which apt-get

# CentOS/RHEL
which yum

# Fedora
which dnf

# Alpine
which apk

# macOS
which brew
```

### Permission Issues

The script requires sudo or root access:

```bash
# Test sudo access
sudo -v

# If sudo is not configured, switch to root
su -
bash tools/nginx/scripts/tls/install-certbot.sh
```

## Related Documentation

- [TLS Setup Guide](../TLS_SETUP.md) - Comprehensive TLS/HTTPS setup guide
- [Installation Script README](README-install-certbot.md) - Detailed script documentation
- [Let's Encrypt Setup Script](setup-letsencrypt.sh) - Certificate configuration script
- [NGINX README](../../README.md) - Main NGINX documentation

## Complete Workflow Example

Here's a complete example from installation to running HTTPS:

```bash
# 1. Install certbot
nx run nginx:tls:install-certbot

# 2. Configure Let's Encrypt for your domain
nx run nginx:tls:setup-letsencrypt -- \
  --domain yourdomain.com \
  --email your@email.com

# 3. Build NGINX images
nx run nginx:docker:build-all --configuration=production

# 4. Start NGINX with TLS in production mode
docker compose \
  -f tools/nginx/docker-compose.yaml \
  -f tools/nginx/docker-compose.prod.yaml \
  -f tools/nginx/docker-compose.tls.yaml \
  up -d

# 5. Verify HTTPS is working
nx run nginx:tls:test-https

# 6. Check certificate details
nx run nginx:tls:validate-certs

# 7. Monitor logs
nx run nginx:docker:compose-logs
```

## Automatic Renewal

After installation and setup, certbot will automatically renew certificates:

### Ubuntu/Debian
```bash
# Certbot timer is enabled automatically
sudo systemctl status certbot.timer
```

### CentOS/RHEL
```bash
# Add to crontab
0 0,12 * * * certbot renew --quiet
```

### macOS
```bash
# Create a launchd job or add to crontab
crontab -e
# Add: 0 0,12 * * * /usr/local/bin/certbot renew --quiet
```

## Benefits of Automated Installation

✅ **Time Savings**: No manual OS detection or package manager selection  
✅ **Error Reduction**: Automated installation reduces configuration mistakes  
✅ **Cross-Platform**: Works on all major Linux distributions and macOS  
✅ **Testing**: Dry-run mode allows safe preview before installation  
✅ **Integration**: Seamlessly integrates with existing NGINX TLS workflow  
✅ **Validation**: Built-in verification ensures successful installation  

## Next Steps

After installation:

1. Configure your domain's DNS to point to your server
2. Ensure ports 80 and 443 are accessible from the internet
3. Run the Let's Encrypt setup script
4. Start NGINX with TLS configuration
5. Test HTTPS connectivity
6. Set up monitoring and alerts
