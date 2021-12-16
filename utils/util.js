const formatDate = stamp => {
  let timestamp = Date.parse(stamp)
  let date = new Date(timestamp)
  let Y =date.getFullYear()
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  return Y + '-' + M + '-' + D
}

const formatTime = stamp => {
  let timestamp = Date.parse(stamp)
  let date = new Date(timestamp)
  let HH = date.getHours()
  let MM = date.getMinutes()
  return HH + ':' + MM
}

const formatOneMonthLimit = stamp => {
  let timestamp = Date.parse(stamp)
  let date = new Date(timestamp)
  let Y =date.getFullYear()
  let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1)
  let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let limitEndM = M % 12 + 1
  let limitEndY = M % 12 ? Y : Y + 1
  return limitEndY + '-' + limitEndM + '-' + D
}

module.exports = {
  formatDate,
  formatTime,
  formatOneMonthLimit
}
