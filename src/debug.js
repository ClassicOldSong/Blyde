'use strict'

import logger from 'loglevel'
const log = console.log.bind(null, '[Blyde]')
const trace = logger.trace.bind(null, '[Blyde]')
const debug = logger.debug.bind(null, '[Blyde]')
const info = logger.info.bind(null, '[Blyde]')
const warn = logger.warn.bind(null, '[Blyde]')
const error = logger.error.bind(null, '[Blyde]')

if (ENV === 'production' && !localStorage.loglevel) {
	logger.setLevel('error')
}

info('Debug logging enabled!')

export { log, trace, debug, info, warn, error, logger }
