import BriefTime from './time_tool';

const fs   = require('fs');
const path = require('path');

class Record
{
    constructor()
    {
        this.briefTime = new BriefTime();

        //生成日志的规则
        this.savingModes =
            {
                date:     ['day', 'week', 'month'],
                capacity: ['kb', 'mb', 'gb']
            };

        //日志的等级
        this.status =
            {
                DEBUG:    1,
                INFO:     2,
                WARNING:  3,
                ERROR:    4,
                CRITICAL: 5
            };

        //默认生成规则
        this.savingMode =
            {
                method: 'date',
                unit:   'day',
                value:   1
            };

        this.level = this.status.DEBUG;

        this.suffix = 1;

        //当前的日志文件名
        this.currentFileName = `${ this.briefTime.getCurrentDate() }.txt`;
    }

    //生成日志的路径
    getLogDir()
    {
        return path.join(__dirname, 'Log');
    }

    getLogFullPath()
    {
        return path.join(this.getLogDir(), this.currentFileName);
    }

    //设置生成日志的方式
    setGenerationType(params)
    {
        /*
         @params
          params.method: 'date' or 'capacity'
          params.unit:   'day, month' or 'KB, MB, GB'
          params.value:  '1--∞'  at will number
          parms.level:  [debug, info, warning, error]
        */
        params.method = params.method.toLowerCase();
        params.unit   = params.unit.toLowerCase();
        params.value  = parseInt(params.value);
        params.level  = params.level.toUpperCase();

        const units = this.savingModes[params.method];

        if (!units)
        {
            throw new Error(`No ${ params.method } method,\nOnly date and capacity in method`);
        }

        if (!units.find((n)=> n === params.unit))
        {
            throw new Error(`No unit ${ params.unit } in ${ units.toString() }`)
        }

        if ( params.value < 0)
        {
            throw new Error(` value must greater than 0`);
        }

        if (params.unit === 'month')
        {
            this.currentFileName = `${ this.briefTime.getCurrentMonthDate() }.txt`;
        }


        this.savingMode = params;

        this.touchCurrentLogFile(this.currentFileName);

        this.setLevel(params.level);
    }

    //检测文件是否需要新建,没有返回值，会直接创建
    checkRebuildFile()
    {
        if (this.savingMode.method === 'date')
        {
            if (this.savingMode.unit === 'day')
            {

                //按时间为单位进行校验
                const targetDate  = this.currentFileName.toString().slice(0, 10);
                const currentDate = this.briefTime.getCurrentDate();

                const interval = this.briefTime.countDateInterval(currentDate, targetDate);

                if (interval > this.savingMode.value)
                {
                    this.touchCurrentLogFile(`${ currentDate }.txt`);

                    this.currentFileName = `${ currentDate }.txt`;
                }
            }
            else if (this.savingMode.unit === 'month')
            {
                //月份比较
                const targetMonth  = this.currentFileName.toString().slice(0, 7);
                const currentMonth = this.briefTime.getCurrentMonthDate();

                if (targetMonth !== currentMonth)
                {
                    const currentDate = this.briefTime.getCurrentDate();

                    this.touchCurrentLogFile(`${ currentDate }.txt`);

                    this.currentFileName = `${ currentDate }.txt`;
                }
            }
        }
        else if (this.savingMode.method === 'capacity')
        {
            //按容量为单位进行校验
            const unit = this.savingMode.unit.toLowerCase();

            const index = this.savingModes.capacity.indexOf(unit);

            const maxByte = Math.pow(1024, index);

            const currentFileByte = fs.statSync(path.join(this.getLogDir(), this.currentFileName)).size;

            if (maxByte <= currentFileByte)
            {
                if (this.currentFileName.indexOf(this.briefTime.getCurrentDate()) >= 0)
                {
                    this.touchCurrentLogFile(`${ this.briefTime.getCurrentDate() }_${ this.suffix }.txt`);

                    this.currentFileName = `${ this.briefTime.getCurrentDate() }_${ this.suffix }.txt`;

                    this.suffix += 1;
                }
                else
                {
                    this.touchCurrentLogFile(`${ this.briefTime.getCurrentDate() }.txt`);

                    this.currentFileName = `${ this.briefTime.getCurrentDate() }.txt`;

                    this.suffix = 0;
                }
            }
        }
    }

    //创建文件
    touchCurrentLogFile(fileName)
    {
        const logDir  = this.getLogDir();
        const logPath = path.join(logDir, fileName);

        //创建文件夹
        if (!fs.existsSync(logDir))
        {
            fs.mkdirSync(logDir);
        }

        fs.writeFileSync(logPath, '', {flag: 'a+', encoding: 'utf-8'});
    }

    //设置日志等级
    setLevel(level)
    {
        if (!this.status[level])
        {
            throw new Error(`No ${ level } level in status,\n Only DEBUG, INFO, WARNING, ERROR ,CRITICAL in status`);
        }

        this.level = this.status[level];
    }

    //写入文件
    writeIntoLog(level, content)
    {
        this.checkRebuildFile();

        const logContent = `[${ this.briefTime.getDetailCurrentDate() }] [${ level }] ${ content } \n`;

        fs.writeFile(this.getLogFullPath(), logContent, { flag: 'a+', encoding: 'utf-8' }, (err)=>
        {
            if (err) { console.log(err) }
        });
    }

    debug(content)
    {
        if (this.level <= this.status.DEBUG)
        {
            this.writeIntoLog('DEBUG', content);
        }
    }

    info(content)
    {
        if (this.level <= this.status.INFO)
        {
            this.writeIntoLog('INFO', content);
        }
    }

    warning(content)
    {
        if (this.level <= this.status.WARNING)
        {
            this.writeIntoLog('WARNING', content);
        }
    }

    error(content)
    {
        if (this.level <= this.status.ERROR)
        {
            this.writeIntoLog('ERROR', content);
        }
    }
}

module.exports = Record;