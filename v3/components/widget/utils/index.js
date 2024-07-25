// 对象深拷贝
import { toLine } from "@/utils";

export const deepClone = data => {
  var type = getObjType(data);
  var obj;
  if (type === 'array') obj = [];
  else if (type === 'object') obj = {};
  else return data;
  if (type === 'array') {
    for (var i = 0, len = data.length; i < len; i++) {
      data[i] = (() => {
        if (data[i] === 0) {
          return data[i];
        }
        return data[i];
      })();
      if (data[i]) {
        delete data[i].$parent;
      }
      obj.push(deepClone(data[i]));
    }
  } else if (type === 'object') {
    for (var key in data) {
      if (data) {
        delete data.$parent;
      }
      obj[key] = deepClone(data[key]);
    }
  }
  return obj;
};
export const getObjType = obj => {
  var toString = Object.prototype.toString;
  var map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  };
  if (obj instanceof Element) {
    return 'element';
  }
  return map[toString.call(obj)];
};
export const getComponent = item => {
  let inputs = ['input', 'textarea', 'password']
  let type = item.type || 'input'
  const custome = ['select', 'editor']
  if (custome.includes(type)) {
    return `ac-` + toLine(type)
  } else {
    if (inputs.includes(type)) {
      return `el-input`
    }
    return `el-` + toLine(type)
  }
}

/**
 * 设置px像素
 */
export const setPx = (val, defval = '90') => {
  if (validateNull(val)) val = defval;
  if (validateNull(val)) return '';
  val = val + '';
  if (val.indexOf('%') === -1) {
    val = val + 'px';
  }
  return val;
};
/**
 * 判断是否为空
 */
export function validateNull(val) {
  // 特殊判断
  if (val && parseInt(val) === 0) return false;
  if (val instanceof Date || typeof val === 'boolean' || typeof val === 'number') return false;
  if (val instanceof Array) {
    if (val.length === 0) return true;
  } else if (val instanceof Object) {
    val = deepClone(val);
    for (let o in val) {
      return false;
    }
    return true;
  } else {
    if (
      val === 'null' ||
      val == null ||
      val === 'undefined' ||
      val === undefined ||
      val === ''
    ) {
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 验证是否存在true/false
 */
export const validateData = (val, def) => {
  if (typeof val === 'boolean') {
    return val;
  }
  return !validateNull(val) ? val : def;
};
export function getLabelWidth(column, item) {
  let result;
  if (!validateNull(column.labelWidth)) {
    result = column.labelWidth
  } else if (!validateNull(item.labelWidth)) {
    result = item.labelWidth
  }
  return setPx(result);
}

export function getSlotName(item, type) {
  const map = {
    'F': 'Form',
    'L': 'Label',
    'H': 'Header',
    'S': 'Search',
  }
  return item.prop + map[type]
}