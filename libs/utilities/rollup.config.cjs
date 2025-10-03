const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
	{
		main: './src/index.ts',
		outputPath: 'libs/utilities/dist', // Use a relative path without './' to avoid path issues
		tsConfig: './tsconfig.lib.json',
		compiler: 'swc',
		format: ['esm'],
		buildLibsFromSource: true,
		useLegacyTypescriptPlugin: false,
		allowJs: true,
		deleteOutputPath: true,
		generatePackageJson: false,
		generateExportsField: false,
		sourceMap: true,
	},
	{
		// Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
		// e.g.
		// output: { sourcemap: true },
	}
);
