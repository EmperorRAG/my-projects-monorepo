#!/usr/bin/env node
/* eslint-env node */
/* global require, __dirname, console, process */
/**
 * Cross-platform NGINX configuration validator.
 *
 * Docker for Windows refuses volume strings that still contain shell
 * substitutions such as $(pwd).  Running the validation through Node lets us
 * resolve absolute paths ourselves and avoids shell quoting issues.
 */
const fs = require('fs');
const os = require('os');
const { spawnSync } = require('child_process');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = path.resolve(projectRoot, 'common', 'base.nginx.conf');
const commonDir = path.resolve(projectRoot, 'common');
const snippetsDir = path.resolve(projectRoot, 'common', 'snippets');
const tlsDir = path.resolve(projectRoot, 'secrets', 'tls');

const tempDefaultConf = path.join(os.tmpdir(), 'nginx-default.conf');
if (!fs.existsSync(tempDefaultConf)) {
  fs.writeFileSync(tempDefaultConf, '# overridden by validate-config\n');
}

const configs = [
  {
    name: 'proxy-edge',
    relativePath: ['proxy-edge', 'nginx.conf'],
    overlayPath: ['proxy-edge', 'overlays'],
    containerFile: 'proxy-edge.conf',
    hosts: [
      { hostname: 'lb-frontend', address: '127.0.0.1' },
      { hostname: 'lb-api', address: '127.0.0.1' },
      { hostname: 'lb-email', address: '127.0.0.1' }
    ]
  },
  {
    name: 'lb-frontend',
    relativePath: ['load-balancers', 'lb-frontend', 'nginx.conf'],
    overlayPath: ['load-balancers', 'lb-frontend', 'overlays'],
    containerFile: 'lb-frontend.conf',
    hosts: [
      { hostname: 'my-programs-app', address: '127.0.0.1' }
    ]
  },
  {
    name: 'lb-api',
    relativePath: ['load-balancers', 'lb-api', 'nginx.conf'],
    overlayPath: ['load-balancers', 'lb-api', 'overlays'],
    containerFile: 'lb-api.conf',
    hosts: [
      { hostname: 'my-nest-js-email-microservice', address: '127.0.0.1' }
    ]
  },
  {
    name: 'lb-email',
    relativePath: ['load-balancers', 'lb-email', 'nginx.conf'],
    overlayPath: ['load-balancers', 'lb-email', 'overlays'],
    containerFile: 'lb-email.conf',
    hosts: [
      { hostname: 'my-nest-js-email-microservice', address: '127.0.0.1' }
    ]
  },
];

const failures = [];

for (const config of configs) {
  const hostPath = path.resolve(projectRoot, ...config.relativePath);
  const overlayDir = path.resolve(projectRoot, ...config.overlayPath);
  const args = [
    'run',
    '--rm',
    '-v', `${baseConfig}:/etc/nginx/nginx.conf:ro`,
    '-v', `${commonDir}:/etc/nginx/common:ro`,
    '-v', `${snippetsDir}:/etc/nginx/snippets:ro`,
    '-v', `${tlsDir}:/etc/nginx/tls:ro`,
    '-v', `${tempDefaultConf}:/etc/nginx/conf.d/default.conf:ro`,
    '-v', `${overlayDir}:/etc/nginx/conf.d/overlays:ro`,
    '-v', `${hostPath}:/etc/nginx/conf.d/${config.containerFile}:ro`
  ];

  for (const { hostname, address } of config.hosts || []) {
    args.push('--add-host', `${hostname}:${address}`);
  }

  args.push('nginx:1.27-alpine', 'nginx', '-t');

  console.log(`\nValidating ${config.name} configuration...`);
  const result = spawnSync('docker', args, { stdio: 'inherit' });

  if (result.status !== 0) {
    failures.push({ name: config.name, code: result.status });
  }
}

if (failures.length > 0) {
  console.error(`\nValidation failed for ${failures.map(({ name }) => name).join(', ')}`);
  process.exit(1);
}

console.log('\nAll NGINX configuration files validated successfully.');
