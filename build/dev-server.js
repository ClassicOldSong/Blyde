console.log('[RP]', 'Build starting...')

const rollup = require('rollup').rollup
const watch = require('node-watch')
const {
	entry,
	devDest: dest,
	format,
	sourcemap,
	plugins
} = require('../config/rollup.config')
const browserSync = require('browser-sync').create()
const bsConfig = require('../config/bs-config')
const reload = browserSync.reload

let cache = {}

const bundleWrite = (bundle) => {
	cache = bundle
	bundle.write({ dest, format, sourcemap })
}

watch('src', (filename) => {
	console.log('[RP]', 'File changed:', filename)
	rollup({
		entry,
		plugins,
		cache
	})
	.then(bundleWrite)
	.then(reload)
})

console.log('[RP]', 'Building...')

rollup({
	entry,
	plugins
})
.then(bundleWrite)
.then(() => console.log('[RP]', 'Build successful! Watching files...'))
.then(() => browserSync.init(bsConfig))
