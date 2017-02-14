'use strict'

import loglevel from 'loglevel'
const logger = loglevel.getLogger('blyde')

const trace = logger.trace.bind(null, '[Blyde]')
const debug = logger.debug.bind(null, '[Blyde]')
const info = logger.info.bind(null, '[Blyde]')
const warn = logger.warn.bind(null, '[Blyde]')
const error = logger.error.bind(null, '[Blyde]')

if (ENV === 'production') {
	logger.setLevel('error')
} else {
	logger.setLevel('trace')
}

info('Debug logging enabled!')

export { trace, debug, info, warn, error, loglevel }
