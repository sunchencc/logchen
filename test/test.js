const Record = require('../src/log_tool');
const assert = require('assert');

const logger =  new Record();

const params =
    {
        method: 'date',
        unit: 'day',
        value: '7',
        level: 'Debug'
    };

logger.setGenerationType(params);

logger.debug('debug');
logger.info('info');
logger.warning('warning');
logger.error('error');

