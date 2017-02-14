'use strict'

import logger from 'loglevel'
const bdlog = logger.getLogger('blyde')

const trace = bdlog.trace.bind(null, '[Blyde]')
const debug = bdlog.debug.bind(null, '[Blyde]')
const info = bdlog.info.bind(null, '[Blyde]')
const warn = bdlog.warn.bind(null, '[Blyde]')
const error = bdlog.error.bind(null, '[Blyde]')

if (ENV === 'production') {
	bdlog.setLevel('error')
} else {
	bdlog.setLevel('trace')
}

info('Debug logging enabled!')

export { trace, debug, info, warn, error, logger }
