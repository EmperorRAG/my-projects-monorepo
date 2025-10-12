# Certbot Auto-Installation Script

This script automatically detects your operating system and installs certbot with the appropriate package manager and configuration.

## Features

- 🔍 **Automatic OS Detection**: Detects Linux distributions and macOS
- 📦 **Multi-Package Manager Support**: Works with apt, yum, dnf, apk, and brew
- ✅ **Installation Verification**: Confirms successful installation
- 🧪 **Dry Run Mode**: Preview installation commands without executing
- 📝 **Comprehensive Logging**: Clear, color-coded output

## Supported Operating Systems

| OS/Distribution | Package Manager | Plugin Support |
|----------------|-----------------|----------------|
| Ubuntu/Debian | apt | ✅ nginx plugin |
| CentOS/RHEL | yum | ✅ nginx plugin |
| Fedora | dnf | ✅ nginx plugin |
| Amazon Linux | yum | ✅ nginx plugin |
| Alpine Linux | apk | ✅ nginx plugin |
| macOS | homebrew | ⚠️ nginx plugin separate |
| Windows 10/11 (WSL) | apt/yum/dnf | ✅ nginx plugin |

## Usage

### Using Nx (Recommended)

```bash
# Install certbot
nx run nginx:tls:install-certbot

# See what would be installed (dry run)
bash tools/nginx/scripts/tls/install-certbot.sh --dry-run
```

### Direct Script Execution

```bash
# Standard installation
bash tools/nginx/scripts/tls/install-certbot.sh

# Dry run mode
bash tools/nginx/scripts/tls/install-certbot.sh --dry-run

# Skip package manager update
bash tools/nginx/scripts/tls/install-certbot.sh --skip-update

# Show help
bash tools/nginx/scripts/tls/install-certbot.sh --help
```

## Command Options

| Option | Description |
|--------|-------------|
| `--skip-update` | Skip package manager update before installation |
| `--dry-run` | Show commands without executing them |
| `--help` | Display help message |

## Prerequisites

- **Root or sudo access**: Required for package installation
- **Internet connection**: To download packages
- **Package manager**: One of apt, yum, dnf, apk, or brew

### macOS Additional Prerequisite

On macOS, Homebrew must be installed first:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Windows 10/11 Additional Prerequisite

On Windows, WSL (Windows Subsystem for Linux) must be installed:

```bash
# Run in PowerShell as Administrator
wsl --install
```

After installing WSL, open the WSL terminal and run the certbot installation script from there. The script will automatically detect the WSL environment and install certbot using the appropriate Linux package manager.

**Note:** If you run the script from Git Bash (not WSL), it will provide instructions to install and use WSL.

## What Gets Installed

### Ubuntu/Debian
```bash
apt-get install -y certbot python3-certbot-nginx
```

### CentOS/RHEL
```bash
yum install -y epel-release  # If not already installed
yum install -y certbot python3-certbot-nginx
```

### Fedora
```bash
dnf install -y certbot python3-certbot-nginx
```

### Alpine Linux
```bash
apk add certbot certbot-nginx
```

### macOS
```bash
brew install certbot
```

## After Installation

Once certbot is installed, you can:

### 1. Configure Certbot for Your Domain

Using the setup script (recommended):
```bash
nx run nginx:tls:setup-letsencrypt -- --domain yourdomain.com --email your@email.com
```

Or directly with certbot:
```bash
certbot certonly --nginx -d yourdomain.com
```

### 2. Set Up Automatic Renewal

**Ubuntu/Debian:**
```bash
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

**CentOS/RHEL:**
```bash
# Add to crontab
0 0,12 * * * certbot renew --quiet
```

**macOS:**
Create a launchd job or add to crontab:
```bash
crontab -e
# Add: 0 0,12 * * * /usr/local/bin/certbot renew --quiet
```

## Verification

The script automatically verifies the installation. You can also verify manually:

```bash
# Check certbot version
certbot --version

# List available plugins
certbot plugins

# Check configuration
certbot show_account
```

## Troubleshooting

### Certbot Already Installed

If certbot is already installed, the script will detect it and provide removal instructions:

```bash
# Ubuntu/Debian
sudo apt-get remove certbot

# CentOS/RHEL
sudo yum remove certbot

# Fedora
sudo dnf remove certbot

# Alpine
sudo apk del certbot

# macOS
brew uninstall certbot
```

### Package Manager Not Found

Ensure your package manager is installed and in PATH:

```bash
# Check package manager
which apt-get  # Ubuntu/Debian
which yum      # CentOS/RHEL
which dnf      # Fedora
which apk      # Alpine
which brew     # macOS
```

### Permission Denied

Ensure you have sudo access:

```bash
# Test sudo
sudo -v

# If sudo is not configured, run as root
su -
bash tools/nginx/scripts/tls/install-certbot.sh
```

### Homebrew Not Found (macOS)

Install Homebrew first:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## Integration with NGINX Setup

This script is part of the complete NGINX TLS setup workflow:

1. **Install Certbot** (this script)
   ```bash
   nx run nginx:tls:install-certbot
   ```

2. **Configure Let's Encrypt**
   ```bash
   nx run nginx:tls:setup-letsencrypt -- --domain yourdomain.com --email your@email.com
   ```

3. **Start NGINX with TLS**
   ```bash
   docker compose \
     -f tools/nginx/docker-compose.yaml \
     -f tools/nginx/docker-compose.prod.yaml \
     -f tools/nginx/docker-compose.tls.yaml \
     up -d
   ```

## Examples

### Standard Installation on Ubuntu

```bash
$ bash tools/nginx/scripts/tls/install-certbot.sh
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

Available plugins:
  nginx (certbot-nginx:nginx)

=================================================================================================
✓ Certbot Installation Completed Successfully!
=================================================================================================
```

### Dry Run on CentOS

```bash
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
```

## Related Documentation

- [TLS/HTTPS Setup Guide](../../TLS_SETUP.md)
- [Let's Encrypt Setup Script](./setup-letsencrypt.sh)
- [Certbot Official Documentation](https://certbot.eff.org/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)

## Script Location

```
tools/nginx/scripts/tls/install-certbot.sh
```

## License

This script is part of the NGINX infrastructure tools in this monorepo.
