export function timeToHour(minutes) {
  let data = ''
  if (minutes) {
    const hour = parseInt(parseInt(minutes) / 60)
    const minute = parseInt(parseInt(minutes) % 60)
    if (hour !== 0) {
      data += hour + '小时'
    }
    if (minute !== 0) {
      data += minute + '分钟'
    }
  }
  return data
}
