'use strict'

import logging from 'loglevel'
const log = console.log.bind(null, '[Blyde]')
const info = logging.info.bind(null, '[Blyde]')
const warn = logging.warn.bind(null, '[Blyde]')
const error = logging.error.bind(null, '[Blyde]')

if (ENV === 'production') {
	logging.setLevel('error')
} else {
	logging.setLevel('trace')
	info('Debug logging enabled!')
}

export { log, info, warn, error }
