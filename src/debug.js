'use strict'

import logging from 'loglevel'
const log = (...args) => logging.info('[Blyde]', ...args)
const warn = (...args) => logging.warn('[Blyde]', ...args)
const error = (...args) => logging.error('[Blyde]', ...args)

if (ENV === 'production') {
	logging.setLevel('error')
} else {
	logging.setLevel('trace')
	log('Debug logging enabled!')
}

export { log, warn, error }
