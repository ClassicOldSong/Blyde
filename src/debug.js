'use strict'

import debug from 'debug'
const log = debug('[Blyde]')

if (ENV === 'production') debug.disable()
else {
	debug.enable('[Blyde]')
	log('Logging is enabled!')
}

export default log
