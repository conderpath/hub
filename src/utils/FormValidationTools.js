export const validationNumber = (isInteger) => {
  var regex = null
  if (isInteger) {
    regex = /^[0-9]+$/
  } else {
    regex = /^[0-9]+(\.[0-9]*)?$/
  }
  return (rule, value, callback) => {
    if (!regex.test(value)) {
      if (isInteger) {
        return callback(new Error('只能是整数'))
      } else {
        return callback(new Error('只能是数字'))
      } 
    } else {
      return callback()
    }
  }
}

export const validationNumberPlace = (integerBit, decimalBit) => {
  return (rule, value, callback) => {
    let regex = null
    if (integerBit > 0 && decimalBit > 0) {
      regex = new RegExp("[0-9]{0,"+integerBit+"}\\.[0-9]{0,"+decimalBit+"}", "gi")
    } else if (integerBit > 0) {
      regex = new RegExp("[0-9]{0,"+integerBit+"}", "gi")
    } else if (decimalBit > 0) {
      regex = new RegExp("0\\.[0-9]{0,"+decimalBit+"}", "gi")
    }
    if (regex != null && !regex.test(value)) {
      return callback(new Error('整数最多'+integerBit+"位，小数位最多"+decimalBit))
    } else {
      return callback()
    }
  }
}

export const validationNumberMax = (maxValue) => {
  return (rule, value, callback) => {
    if (value > maxValue) {
      return callback(new Error('不能大于' + maxValue))
    } else {
      return callback()
    }
  }
}

export const validationNumberMin = (minValue) => {
  return (rule, value, callback) => {
    if (value < minValue) {
      return callback(new Error('不能小于' + minValue))
    } else {
      return callback()
    }
  }
}

export const validationNumberNegative = () => {
  return (rule, value, callback) => {
    if (value >= 0) {
      return callback(new Error('只能是负数'))
    } else {
      return callback()
    }
  }
}

export const validationNumberNegativeOrZero = () => {
  return (rule, value, callback) => {
    if (value > 0) {
      return callback(new Error('不能大于0'))
    } else {
      return callback()
    }
  }
}

export const validationNumberPositive = () => {
  return (rule, value, callback) => {
    if (value <= 0) {
      return callback(new Error('只能是正数'))
    } else {
      return callback()
    }
  }
}
  
export const validationNumberPositiveOrZero = () => {
  return (rule, value, callback) => {
    if (value < 0) {
      return callback(new Error('不能小于0'))
    } else {
      return callback()
    }
  }
}

export const validationDatePast = () => {
  return (rule, value, callback) => {
    if (getCurrentDate(value) >= getCurrentDate(new Date())) {
      return callback(new Error('只能是过去'))
    } else {
      return callback()
    }
  }
}
    
export const validationDatePastOrNow = () => {
  return (rule, value, callback) => {
    if (getCurrentDate(value) > getCurrentDate(new Date())) {
      return callback(new Error('不能大于现在'))
    } else {
      return callback()
    }
  }
}
  
export const validationDateFuture = () => {
  return (rule, value, callback) => {
    if (getCurrentDate(value) <= getCurrentDate(new Date())) {
      return callback(new Error('只能是未来'))
    } else {
      return callback()
    }
  }
}
      
export const validationDateFutureOrNow = () => {
  return (rule, value, callback) => {
    if (getCurrentDate(value) < getCurrentDate(new Date())) {
      return callback(new Error('不能小于现在'))
    } else {
      return callback()
    }
  }
}

const getCurrentDate = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date)
  }
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
}