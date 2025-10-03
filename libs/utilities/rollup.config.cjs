const { withNx } = require('@nx/rollup/with-nx');

module.exports = withNx(
	{
		main: './src/index.ts',
		outputPath: 'libs/utilities/dist', // Use a relative path without './' to avoid path issues
		tsConfig: './tsconfig.lib.json',
		compiler: 'swc',
		format: ['esm'],
		buildLibsFromSource: true,
		useLegacyTypescriptPlugin: true,
		allowJs: true,
		deleteOutputPath: true,
		generatePackageJson: false,
		generateExportsField: false,
		sourceMap: false,
	},
	{
		// Provide additional rollup configuration here. See: https://rollupjs.org/configuration-options
		output: {
			sourcemap: false,
			//sourcemapBaseUrl: path.resolve(__dirname, '../../').replace(/\\/g, '/') + '/',
		},
	}
);
