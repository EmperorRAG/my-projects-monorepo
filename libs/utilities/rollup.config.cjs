const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
	{
		main: './src/index.ts',
		outputPath: '../../dist/libs/utilities',
		tsConfig: './tsconfig.lib.json',
		compiler: 'swc',
		format: ['esm'],
		allowJs: true,
		buildLibsFromSource: true,
		deleteOutputPath: true,
		generatePackageJson: false,
		generateExportsField: false,
		sourceMap: false,
		useLegacyTypescriptPlugin: false,
	},
	{
		// Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
	}
);
