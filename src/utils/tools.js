/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能：公共方法
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/


export const localSave = (key, value) => {
    key ? localStorage.setItem(key, JSON.stringify(value)):  new Error(`localStorage need key item`)
}

export const localRead = (key) => {
    try{
        return JSON.parse(localStorage.getItem(key)) || ''
    }catch(e) {
        return ''
    }
}

export const localClear = () => {
    return localStorage.clear()
}

export const sessionSave = (key, value) => {
    key ? sessionStorage.setItem(key, JSON.stringify(value)):  new Error(`localStorage need key item`)
}

export const sessionRead = (key) => {
    try{

        return JSON.parse(sessionStorage.getItem(key)) || ''
    }catch(e) {
        return ''
    }
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

export const download =(data, fileName) =>{
    let downloadFileName = fileName ? fileName:`${data.headers['content-disposition'] ? data.headers['content-disposition'].split('=')[1].replace(/\"/g, "") : '附件'}`
    if (window.navigator.msSaveBlob) {
        // for ie 10 and later
        try {
            const blob = new Blob([data.data], )
            window.navigator.msSaveBlob(blob,  downloadFileName)
        } catch (e) {
            console.log(e)
        }
    } else {
        const blob = new Blob([data.data])
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', decodeURIComponent(downloadFileName))
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(url)
    }
}

export function importExternalJs (urlList = []) {
    urlList.forEach((url)=>{
        let jsLink = document.createElement('script')
        jsLink.src = url
        window.document.head.appendChild(jsLink)
    })
}

export function importExternalCss (urlList = []) {
    urlList.forEach((url)=>{
        let cssLink = document.createElement('link')
        cssLink.href = url
        cssLink.rel = 'stylesheet'
        window.document.head.appendChild(cssLink)
    })
}

export const getObjType = obj => {
    let toString = Object.prototype.toString;
    let map = {
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
 * 对象深拷贝
 */
export const deepClone = data => {
    let type = getObjType(data);
    let obj;
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









