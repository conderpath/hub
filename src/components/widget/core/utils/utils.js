
import { DIC_PROPS, DIC_SHOW_SPLIT } from './variable';
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key);
};


export function setAsVal (obj, bind = '', value = '') {
    let result;
    let type = getObjType(value)
    if (validatenull(value)) {
        if (type === 'array') {
            result = `obj.${bind}=[]`
        } else if (type === 'object') {
            result = `obj.${bind}={}`
        } else if (['number', 'boolean'].includes(type)) {
            result = `obj.${bind}=undefined`
        } else {
            result = `obj.${bind}=''`
        }
    } else {
        if (type == 'string') {
            result = `obj.${bind}='${value}'`;
        } else {
            result = `obj.${bind}=${value}`;
        }
    }
    eval(result);
    return obj;
}

/**
 * 判断是否为空
 */
export function validatenull(val) {
    // 特殊判断
    if (val && parseInt(val) === 0) return false;
    const list = ['$parent'];
    if (val instanceof Date || typeof val === 'boolean' || typeof val === 'number') return false;
    if (val instanceof Array) {
        if (val.length === 0) return true;
    } else if (val instanceof Object) {
        val = deepClone(val);
        list.forEach(ele => {
            delete val[ele];
        });
        for (var o in val) {
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
export const validData = (val, dafult) => {
    if (typeof val === 'boolean') {
        return val;
    }
    return !validatenull(val) ? val : dafult;
};

export const formatTime = (timestamp, ope = '-', flag = 1) => {
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
}


export const sendRequest = (params) => {
    let { url, query, method, resKey, headers={}, props, formatter, value = '', column, form = {} } = params;
    if (column) {
        url = column.dicUrl;
        method = column.dicMethod;
        query = column.dicQuery || {};
        formatter = column.dicFormatter;
        props = column.props;
        headers = column.dicHeaders;
    }
    let key = "key"
    url = url || '';
    let list = [];
    let data = {};
    if (method === 'post') {
        list = Object.keys(query);
        list.forEach(ele => {
            let eleKey = query[ele] + '';
            let eleValue = form[eleKey.replace(/\{{|}}/g, '')];
            if (eleKey.match(/\{{|}}/g)) {
                data[ele] = eleKey.replace(eleKey, eleKey.indexOf(key) !== -1 ? value : eleValue);
            } else {
                data[ele] = query[ele];
            }
        });
    } else {
        list = url.match(/[^\{\}]+(?=\})/g) || [];
        list.forEach(ele => {
            let eleKey = `{{${ele}}}`;
            let eleValue = form[ele];
            if (ele === key) url = url.replace(eleKey, value);
            else url = url.replace(eleKey, eleValue);
        })
    }
    if (props) resKey = (props || {}).res || resKey;
    return new Promise(resolve => {
        const callback = (res) => {
            let list = [];
            if (typeof formatter === 'function') {
                list = formatter(res.data);
            } else {
                list = getObjValue(res.data, resKey);
            }
            resolve(list);
        };
        if (!window.axios) {
            //packages.logs('axios');
            resolve([]);
        }
        if (method === 'post') {
            window.axios.post(url, data, {headers}).then(function (res) {
                callback(res);
            }).catch(() => [
                resolve([])
            ]);
        } else {
            window.axios.get(url, {
                params: query,
                headers
            }).then(function (res) {
                callback(res);
            }).catch(() => [
                resolve([])
            ]);
        }
    });
};


/**
 * 初始化数据格式
 */
export const initVal = (value, column, callback) => {
    let { type, multiple, dataType, separator = DIC_SPLIT, alone } = column
    let list = value;
    if (
        (MULTIPLE_LIST.includes(type) && multiple) ||
        ARRAY_VALUE_LIST.includes(type)
    ) {

        if (!Array.isArray(list)) {
            if (validatenull(list)) {
                list = [];
            } else {
                list = (list + '').split(separator) || [];
                callback && callback(true);
            }
        } else {
            callback && callback(false);
        }
        // 数据转化
        list.forEach((ele, index) => {
            list[index] = detailDataType(ele, dataType);
        });
        if (ARRAY_LIST.includes(type) && validatenull(list) && alone) list = [''];
    } else {
        list = detailDataType(list, dataType)
    }
    return list;
};


export function findObject (list, value, key = 'prop') {
    let result = -1;
    let type = (() => {
        let result;
        list.forEach(ele => {
            if (ele.column) {
                result = 'group';
            } else if (ele.children) {
                result = 'tree';
            }
        });
        return result;
    })();
    if (type === 'group') {
        list.forEach(ele => {
            const val = findArray(ele.column, value, key, true);
            if (val !== -1) result = val;
        });
    } else if (type === 'tree') {
        result = findLabelNode(list, value, { value: key }, true);
    } else {
        result = findArray(list, value, key, true);
    }
    return result;
}






















export function getFixed (val = 0, len = 2) {
    return Number(val.toFixed(len));
}
export function getAsVal (obj, bind = '') {
    let result = deepClone(obj);
    if (validatenull(bind)) return result;
    bind.split('.').forEach(ele => {
        if (!validatenull(result[ele])) {
            result = result[ele];
        } else {
            result = '';
        }
    });
    return result;
}
export const loadScript = (type = 'js', url) => {
    let flag = false;
    return new Promise((resolve) => {
        const head = document.getElementsByTagName('head')[0];
        head.children.forEach(ele => {
            if ((ele.src || '').indexOf(url) !== -1) {
                flag = true;
                resolve();
            }
        });
        if (flag) return;
        let script;
        if (type === 'js') {
            script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;
        } else if (type === 'css') {
            script = document.createElement('link');
            script.rel = 'stylesheet';
            script.type = 'text/css';
            script.href = url;
        }
        head.appendChild(script);
        script.onload = function () {
            resolve();
        };
    });
};
export function downFile (url, saveName) {
    if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if (window.MouseEvent) {
        event = new MouseEvent('click');
    } else {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false,
            false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}
export function strCorNum (list) {
    list.forEach((ele, index) => {
        list[index] = Number(ele);
    });
    return list;
}
export function extend () {
    var target = arguments[0] || {};
    var deep = false;
    var arr = Array.prototype.slice.call(arguments);
    var i = 1;
    var options, src, key, copy;
    var isArray = false;
    if (typeof target === 'boolean') {
        deep = target;
        i++;
        target = arguments[1];
    }
    for (; i < arr.length; i++) { // 循环传入的对象数组
        if ((options = arr[i]) != null) { // 如果当前值不是null，如果是null不做处理
            for (key in options) { // for in循环对象中key
                copy = options[key];
                src = target[key];
                // 如果对象中value值任然是一个引用类型
                if (deep && (toString.call(copy) === '[object Object]' || (isArray = toString.call(copy) == '[object Array]'))) {
                    if (isArray) { // 如果引用类型是数组
                        // 如果目标对象target存在当前key，且数据类型是数组，那就还原此值，如果不是就定义成一个空数组;
                        src = toString.call(src) === '[object Array]' ? src : [];
                    } else {
                        // 如果目标对象target存在当前key，且数据类型是对象，那就还原此值，如果不是就定义成一个空对象;
                        src = toString.call(src) === '[object Object]' ? src : {};
                    }
                    // 引用类型就再次调用extend，递归，直到此时copy是一个基本类型的值。
                    target[key] = extend(deep, src, copy);
                } else if (copy !== undefined && copy !== src) { // 如果这个值是基本值类型，且不是undefined
                    target[key] = copy;
                }
            }
        }
    }
    return target;
}


/**
 * 过滤字典翻译字段和空字段
 */
export const filterParams = (form, list = ['', '$'], deep = true) => {
    let data = deep ? deepClone(form) : form
    for (let o in data) {
        if (list.includes('')) {
            if (validatenull(data[o])) delete data[o];
        }
        if (list.includes('$')) {
            if (o.indexOf('$') !== -1) delete data[o];
        }

    }
    return data
};

export function createObj (obj, bind) {
    let list = bind.split('.');
    let first = list.splice(0, 1)[0];
    let deep = {};
    deep[first] = {};
    if (list.length >= 2) {
        let start = '{';
        let end = '}';
        let result = '';
        list.forEach(ele => {
            result = `${result}${start}"${ele}":`;
        });
        result = `${result}""`;
        for (let i = 0; i < list.length; i++) {
            result = `${result}${end}`;
        }
        result = JSON.parse(result);
        deep[first] = result;
    }
    obj = extend(true, obj, deep);
    return obj;
}
export function dataURLtoFile (dataurl, filename) {
    let arr = dataurl.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
        type: mime
    });
}

/**
 * 生成随机数
 */
export function randomId () {
    let $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let maxPos = $chars.length;
    let id = '';
    for (let i = 0; i < 16; i++) {
        id += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return id;
}
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
/**
 *判断是否为json对象
 */

export const isJson = str => {
    if (Array.isArray(str)) {
        if (str[0] instanceof Object) {
            return true;
        } else {
            return false;
        }
    } else if (str instanceof Object) {
        return true;
    }
    return false;
};
/**
 * 对象深拷贝
 */
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
/**
 * 根据字段数组排序
 */
export const sortArrys = (list, prop) => {
    list.sort(function (a, b) {
        if (a[prop] > b[prop]) {
            return -1;
        }
        if (a[prop] < b[prop]) {
            return 1;
        }
        return 0;
    });
    return list;
};

/**
 * 设置px像素
 */
export const setPx = (val, defval = '') => {
    if (validatenull(val)) val = defval;
    if (validatenull(val)) return '';
    val = val + '';
    if (val.indexOf('%') === -1) {
        val = val + 'px';
    }
    return val;
};

/**
 * 字符串数据类型转化
 */
export const detailDataType = (value, type) => {
    if (validatenull(value)) return value
    if (type === 'number') {
        return Number(value);
    } else if (type === 'string') {
        return value + '';
    } else {
        return value;
    }
};
// 获取url中的参数
export const getUrlParams = (url) => {
    let result = {
        url: '',
        params: {}
    };
    let list = url.split('?');
    result.url = list[0];
    let params = list[1];
    if (params) {
        let list = params.split('&');
        list.forEach(ele => {
            let dic = ele.split('=');
            let label = dic[0];
            let value = dic[1];
            result.params[label] = value;
        });
    }
    return result;
};

/**
 * 数组的数据类型转化
 */
export const detailDic = (list = [], props = {}, type) => {
    let valueKey = props.value || DIC_PROPS.value;
    let childrenKey = props.children || DIC_PROPS.children;
    list.forEach(ele => {
        ele[valueKey] = detailDataType(ele[valueKey], type);
        if (ele[childrenKey]) detailDic(ele[childrenKey], props, type);
    });
    return list;
};
/**
 * 根据字典的value显示label
 */

export const findByValue = (dic, value, props, isTree, column) => {
    // 如果为空直接返回
    if (validatenull(dic)) return value;
    let result = '';
    props = props || DIC_PROPS;
    if (value instanceof Array) {
        result = [];
        for (let i = 0; i < value.length; i++) {
            const dicvalue = value[i];
            if (isTree) {
                result.push(findLabelNode(dic, dicvalue, props) || dicvalue);
            } else {
                result.push(findArrayLabel(dic, dicvalue, props));
            }
        }
        result = result.join(DIC_SHOW_SPLIT).toString();

    } else if (['string', 'number', 'boolean'].includes(typeof value)) {
        result = findLabelNode(dic, value, props) || value;
    }
    return result;
};
/**
 * 过滤字典翻译字段和空字段
 */
export const filterDefaultParams = (form, translate = true) => {
    let data = deepClone(form);
    if (translate) return data;
    for (let o in data) {
        if (o.indexOf('$') !== -1 || validatenull(data[o])) {
            delete data[o];
        }
    }
    return data;
};
/**
 * 处理存在group分组的情况
 */
export const detailDicGroup = (dic) => {
    dic = deepClone(dic);
    let list = [];
    if ((dic[0] || {}).groups) {
        dic.forEach(ele => {
            if (ele.groups) {
                list = list.concat(ele.groups);
            }
        });
        return list;
    }
    return dic;
};
/**
 * 根据label去找到节点
 */
export const findLabelNode = (dic, value, props, obj) => {
    let result;
    if (!obj) dic = detailDicGroup(dic);
    let rev = (dic1, value1, props1) => {
        const labelKey = props1.label || DIC_PROPS.label;
        const valueKey = props1.value || DIC_PROPS.value;
        const childrenKey = props1.children || DIC_PROPS.children;
        for (let i = 0; i < dic1.length; i++) {
            const ele = dic1[i];
            const children = ele[childrenKey] || [];
            if (ele[valueKey] === value1) {
                result = obj ? ele : ele[labelKey];
            } else {
                rev(children, value1, props1);
            }
        }
    };
    rev(dic, value, props);
    return result;
};
/**
 * 获取多层data
 */
export const getDeepData = (res) => {
    return (Array.isArray(res) ? res : res.data) || [];
};
export const getObjValue = (data, params = '', type) => {
    const list = params.split('.');
    let result = data;
    if (list[0] === '' && type !== 'object') {
        return getDeepData(data);
    } else if (list[0] !== '') {
        list.forEach(ele => {
            result = result[ele];
        });
    }
    return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArrayLabel = (dic, value, props) => {
    dic = detailDicGroup(dic);
    const valueKey = props.value || DIC_PROPS.value;
    const labelKey = props.label || DIC_PROPS.label;
    for (let i = 0; i < dic.length; i++) {
        if (dic[i][valueKey] === value) {
            return dic[i][labelKey];
        }
    }
    return value;
};
/**
 * 根据值查找对应的序号
 */
export const findArray = (dic, value, valueKey, obj) => {
    if (!obj) dic = detailDicGroup(dic);
    valueKey = valueKey || DIC_PROPS.value;
    for (let i = 0; i < dic.length; i++) {
        if (dic[i][valueKey] === value) {
            return obj ? dic[i] : i;
        }
    }
    return -1;
};
/**
 * 根据位数获取*密码程度
 */
export const getPasswordChar = (result = '', char) => {
    let len = result.toString().length;
    result = '';
    for (let i = 0; i < len; i++) {
        result = result + char;
    }
    return result;
};

export const arraySort = (list = [], prop, callback) => {
    return list.filter(ele => !validatenull(ele[prop])).sort((a, b) => callback(a, b)).concat(list.filter(ele => validatenull(ele[prop])));
}
export const clearVal = (obj, list = []) => {
    if (!obj) return {};
    Object.keys(obj).forEach(ele => {
        if (list.includes(ele)) return
        else if (!validatenull(obj[ele])) {
            let type = getObjType(obj[ele])
            if (type === 'array') obj[ele] = [];
            else if (type === 'object') obj[ele] = {};
            else if (['number', 'boolean'].includes(type)) obj[ele] = undefined;
            else obj[ele] = '';
        }
    });
    return obj;
};
/**
 * 验证是否存在true/false
 */
export const vaildData = (val, dafult) => {
    if (typeof val === 'boolean') {
        return val;
    }
    return !validatenull(val) ? val : dafult;
};


/**
 * @name 从一维数组中找到节点的父祖节点
 * @param {Object} item 当前节点
 * @param {Array} arr 全部节点数组
 * @param {Object} options 配置项
 */
export const findParents = (item, arr, options = { id: 'id', parentId: 'parentId', root: 0 }) => {
    let _parents = [];
    return function findParent(item) {
        if (item[options.parentId] === options.root) return _parents;
        const parent = arr.find(i => i[options.id] === item[options.parentId]);
        if (parent) {
            _parents.push(parent);
            return findParent(parent)
        } else {
            return _parents
        }
    }(item);
}



