/*
服务于日志类，用于返回日志所需要的时间
该时间主要用于日志的名字
*/
//一天的毫秒数
const FULL_DAY_MILLISECONDS = 1000*60*60*24;

class BriefTime
{
    constructor()
    {
        this.date = new Date();
    }

    //返回当前的日期 2020-03-09
    getCurrentDate()
    {
        const year  = this.date.getFullYear();
        const month = this.date.getMonth() + 1;
        const day   = this.date.getDate();

        return `${ year }-${ this.standardDate(month.toString()) }-${ this.standardDate(day.toString()) }`;
    }

    //将2020-3-4转换成2020-03-04,此方法只能填充单位时间如 3转换成03
    standardDate(date)
    {
        if (date.length === 1)
        {
            return `0${ date }`
        }

        return date;
    }

    //获取当前日期的详细日期
    getDetailCurrentDate()
    {
        return new Date();
    }

    //获取当前日期的月份完整信息 2020-03
    getCurrentMonthDate()
    {
        const year  = this.date.getFullYear();
        const month = this.date.getMonth();

        return `${ year }-${ this.standardDate(month.toString()) }`;
    }

/* 当前日期和指定日期的时间间隔（天）
  @currentDate: 当前的日期
  @targetDate:  目标的日期
  返回间隔的时间（天数）
* */
    countDateInterval(currentDate, targetDate)
    {
        //计算两个时间的毫秒数相减
        const currentMilliseconds = Date.parse(currentDate);
        const targetMilliseconds  = Date.parse(targetDate);

        return (currentDate - targetDate) / FULL_DAY_MILLISECONDS;
    }

}

export default BriefTime;