// Rollup plugins
const babel = require('rollup-plugin-babel')
const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')

module.exports = {
	entry: 'src/blyde.js',
	devDest: 'test/blyde.js',
	buildDest: 'dist/blyde.min.js',
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		resolve({
			jsnext: true,
			main: true,
			browser: true,
		}),
		commonjs(),
		eslint(),
		babel({
			exclude: 'node_modules/**',
			runtimeHelpers: true
		}),
		replace({
			ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
		}),
		(process.env.NODE_ENV === 'production' && uglify())
	]
}
