'use strict'

import debug from 'debug'
const log = debug('[Blyde]:log')
const warn = debug('[Blyde]:warn')
const error = debug('[Blyde]:error')

if (ENV === 'production') {
	debug.enable('[Blyde]:error')
} else {
	debug.enable('[Blyde]:*')
	log('Logging is enabled!')
}

export { log, warn, error }
