'use strict'

import logging from 'loglevel'
const log = (...args) => console.log('[Blyde]', ...args)
const info = (...args) => logging.info('[Blyde]', ...args)
const warn = (...args) => logging.warn('[Blyde]', ...args)
const error = (...args) => logging.error('[Blyde]', ...args)

if (ENV === 'production') {
	logging.setLevel('error')
} else {
	logging.setLevel('trace')
	info('Debug logging enabled!')
}

export { log, info, warn, error }
