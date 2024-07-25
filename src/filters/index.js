import Vue from 'vue'
Vue.filter('formateTime', function (timestamp, ope = '-', flag = 1) {
  if (timestamp) {
    const time = new Date(timestamp)
    const y = time.getFullYear()
    const m = time.getMonth() + 1
    const d = time.getDate()
    const h = time.getHours()
    const minus = time.getMinutes()
    const s = time.getSeconds()

    if (flag === 1) {
      return `${y}${ope}${m > 9 ? m : '0' + m}${ope}${d > 9 ? d : '0' + d} ${getText(h)}:${getText(minus)}:${getText(s)}`
    }
    return `${y}${ope}${m > 9 ? m : '0' + m}${ope}${d > 9 ? d : '0' + d}`
  }
  function getText (num) {
    return num > 9 ? num : '0' + num
  }
  return ''
})
