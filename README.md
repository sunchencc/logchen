# record

用node 实现的日志系统
	const   Record = require('xxxx');
	
	const  logger = new  Record();
	
	const params=
	{
		method:    'date',
		unit:         'day',
		value:       '7',
		level:      'info'
	};
	
	//////////////////////////////
	注释
	{
		//每10天创建一个日志文件，过滤等级为info
		method:   'date',
		unit:     'day',
		value:    '10',
		level:    'info'
	}

	{
		//当日志文件的大小>=1mb时,创建一个新的日志文件，过滤等级为error
		method:   'capacity',
		unit:     'mb',
		value:    '1',
		level:    'error'
	}

////////////////////////////////////
	
	logSun.setGenerationType(params);
	
	logger.debug('debug');
	logger.info('info');
	logger.warning('warning');
	logger.error('error')
	
	参数解释
	
	• method :  date 或者 capacity，
	• unit:     [ day, month ],      [ kb,  mb,  gb ]
	• value:       > 0
	• level:      [debug,  info,   warning,  error]
	
	表格方式说明
	method	 date	capacity
	unit	day,      month	kb,       mb ,   gb
	value	  >0	  >0
	
	日志等级
	
	ERROR > WARNING > INFO >DEBUG
