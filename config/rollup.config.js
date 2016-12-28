// Rollup plugins
const babel = require('rollup-plugin-babel')
const eslint = require('rollup-plugin-eslint')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const replace = require('rollup-plugin-replace')
const uglify = require('rollup-plugin-uglify')
const progress = require('rollup-plugin-progress')
const git = require('git-rev-sync')
const { version } = require('../package.json')

module.exports = {
	entry: 'src/main.js',
	devDest: 'test/blyde.dev.js',
	proDest: 'dist/blyde.min.js',
	format: 'iife',
	sourceMap: 'inline',
	plugins: [
		progress({
			clearLine: false
		}),
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
			VERSION: JSON.stringify(`${version}.${git.branch()}.${git.short()}`)
		}),
		(process.env.NODE_ENV === 'production' && uglify())
	]
}
