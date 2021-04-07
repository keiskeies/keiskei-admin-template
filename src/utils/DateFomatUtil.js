// 小时转分(val=2小时2分)
export function hourtoMinute(hour, hourFomat, minutesFomat) {
  if (!hour) {
    return;
  }
  var dateTimeData = "";
  var h = Math.floor(hour / 60);
  hour -= h * 60;
  if (hour == 0) {
    dateTimeData = h ? h + hourFomat : "";
  } else {
    if (hour < 10) {
      hour = "0" + hour;
    }
    dateTimeData = (h ? h + hourFomat : "") + (hour ? hour + minutesFomat : "");
  }
  return dateTimeData;
}

// 获取当前时间必须填写格式
export function formatDate(fmt) {
  if (!fmt) {
    return;
  }
  var date = new Date();
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
    }
  }
  return fmt;
}

// 获取当前时间必须填写格式
export function formatDateAppoint(fmt, date) {
  if (!fmt) {
    return;
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : ('00' + str).substr(str.length))
    }
  }
  return fmt;
}

// 获取val月的天数
export function dateNum(yy, mm) {
  if (!yy || !mm) {
    return;
  }
  var d = new Date(yy, mm, 0);
  return d.getDate();
}

// 获取当前日期加星期几
export function dayWeek() {
  var date = new Date();
  var str = date.toLocaleDateString();
  if (date) {
    var Week = ['日', '一', '二', '三', '四', '五', '六'];
    str += ' 星期' + Week[date.getDay()];
  }
  return str;
}

// 计算两个日期的差
export function daysBetween(DateOne, DateTwo) {
  var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
  var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
  var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

  var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
  var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
  var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

  var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
  return Math.abs(cha);
}

// 加某一个时间比如（年、月、日、时、分、秒）
export function dateAdd(interval, number, date) {
  switch (interval) {
    case "yyyy"   : {  //年
      date.setFullYear(date.getFullYear() + number);
      return date;
      break;
    }
    case "MM"   : {  //月
      date.setMonth(date.getMonth() + number);
      return date;
      break;
    }

    case "dd"   : {
      date.setDate(date.getDate() + number);  //日
      return date;
      break;
    }
    case "hh"   : {
      date.setHours(date.getHours() + number);  //小时
      return date;
      break;
    }
    case "mm"   : {
      date.setMinutes(date.getMinutes() + number);  //分钟
      return date;
      break;
    }
    case  "ss"   : {
      date.setSeconds(date.getSeconds() + number);  //秒
      return date;
      break;
    }
    default: {
      break;
    }
  }
}

// 修改时间格式
export function formatDateTime(time, format) {
  var t = new Date(time);
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}

// 计算两个时间相差了几个小时
export function getIntervalHour(startDate, endDate) {
  var ms = endDate.getTime() - startDate.getTime();
  if (ms < 0) return 0;
  return Math.floor(ms / 1000 / 60 / 60);
}
