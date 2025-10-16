import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [
            '^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$',
            '@my-projects-monorepo/prisma-client', // Allow Prisma client generated code
            '@thallesp/nestjs-better-auth', // Allow NestJS Better Auth integration package
            'better-auth', // Allow Better Auth core library and its subpaths
            '@emperorrag/better-auth-utilities', // Allow better-auth-utilities library
          ],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
];
