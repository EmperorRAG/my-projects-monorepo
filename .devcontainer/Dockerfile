FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install Node.js and common utilities
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends nodejs npm curl \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install Fira Code font
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends fonts-firacode \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Install pnpm and Nx globally
RUN npm install -g pnpm nx

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>
