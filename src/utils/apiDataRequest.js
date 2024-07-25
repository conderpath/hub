/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1.功能：通用Api请求封装
 2.作者：Object
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

import axios from 'axios'
import {Message, MessageBox} from 'element-ui'
import apiPath from '../api'
import {localRead} from "./tools";

window.axios = axios

/*axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return error;
    });*/

/**
 * Api 请求 封装
 * @type {{request({api?: *, method?: *, headers?: *, contentType?: *, pathParams?: *, params?: *, data?: *}): Promise<AxiosResponse<*>>,
 * pathParamsToUrl(*=, *=): string, checkMethod({method: *, params?: *, data: *}): {}, showMessageBox: boolean, getEnv(): string, pathToUrl(*): string}}
 */
class apiDataRequest {
    constructor(apiObj = {}) {
        apiPath.suffix = Object.assign(apiPath.suffix, apiObj)
        this.apiConf = apiPath
        this.showMessageBox = true
    }

    /**
     * Api 请求
     * @param api
     * @param method
     * @param headers
     * @param blob
     * @param contentType
     * @param pathParams
     * @param params
     * @param data
     * @returns {Promise<unknown>}
     */
    async request({api = '', method = 'get', headers = {}, blob = false, contentType = 'application/json;charset=UTF-8', pathParams = [], params = {}, data = {}}) {
        const apiUrl = this.pathParamsToUrl(api, pathParams)
        method = method.toLowerCase();
        let token = localRead('token')
        const options = {
            url: apiUrl,
            method,
            timeout: this.apiConf.timeout,
            headers: {
                'Content-Type': contentType,
                token,
                ...this.apiConf.headers,
                ...headers,
            },
            ...this.checkMethod({method, params, data })
        };
        if (blob) options['responseType'] = 'blob'
        return new Promise((resolve, reject) => {
            axios(options).then((res) => {
                console.log('res------------------', res)
                if (blob) {
                    resolve(res);
                    return
                }
                if ((parseInt(res.data[this.apiConf.statusKey], 10) === this.apiConf.successStatusCode) || res.data[this.apiConf.statusKey] === 'success') {
                    resolve(res.data)
                } else {
                    if (res.data[this.apiConf.messageKey]) {
                        Message.error(res.data[this.apiConf.messageKey] ? res.data[this.apiConf.messageKey] : '')
                    } else if (res.data['msg']) {
                        // 针对接口返回的指定token无效编码退出登录
                        if(res.data['code'] && res.data['code']=== 'tokeninvalid') {
                            MessageBox.alert('登陆已过期，请重新登陆！', '提示', {
                                confirmButtonText: '确定',
                                callback: () => {
                                    let redirect_uri = window.location.href
                                    localStorage.clear()
                                    window.location.href = `/login?redirect_uri=${encodeURIComponent(redirect_uri)}`
                                    this.showMessageBox = true
                                }
                            })
                        }else {
                            Message.error(res.data['msg'])
                        }
                    }
                    reject(res.data)
                }
            }).catch((res) => {
                    if (res.response.status === 401) {
                        if (this.showMessageBox) {
                            this.showMessageBox = false
                            MessageBox.alert('登陆已过期，请重新登陆！', '提示', {
                                confirmButtonText: '确定',
                                callback: () => {
                                    let redirect_uri = window.location.href
                                    localStorage.clear()
                                    window.location.href = `/login?redirect_uri=${encodeURIComponent(redirect_uri)}`
                                    this.showMessageBox = true
                                }
                            })
                        }

                    }else {
                        if(this.showMessageBox) {
                            this.showMessageBox = false
                            let msg = res.response?.data?.msg || res.response?.data?.errorMsg || res.response?.data?.message ||  '系统繁忙，请稍后再试'
                            MessageBox.alert(msg, '提示', {
                                confirmButtonText: '确定',
                                callback: () => {
                                    this.showMessageBox = true
                                }
                            })
                        }
                        // Message.error((res.response.data.message ? '':res.response.statusText )+ (res.response.data.data || res.response.data.message || res.response.statusText || '网络错误！'))
                    }
                    reject(res)
                })
        })
    }

    /**
     * 通过域名来获取当前阶段环境
     * @returns {string}
     */
    getEnv() {
        let env = 'dev'
        const domain = document.domain
        switch (domain) {
            case '47.110.125.94':
                env = 'test'
                break
            case 'www.sim.mobi':
                env = 'sim'
                break
            case 'www.example.com':
                env = 'prod'
                break
            default:
                env = 'dev'
                break
        }
        return env
    }

    /**
     * 根据apiPath返回apiUrl @apiPath：从api配置中suffix往下层写如："example.rent.detail"
     * @param apiPath
     * @returns {string}
     */
    pathToUrl(apiPath) {
        let pathArray = apiPath.split('.')
        let prefix = this.apiConf.prefix[this.getEnv()]
        let suffix = this.apiConf.suffix
        for (let n = 0; n < pathArray.length; n++) {
            suffix = suffix[pathArray[n]]
        }
        if (suffix === undefined) suffix = ''
        return prefix + suffix
    }


    /**
     * 拼接路径参数 返回路径
     * @param apiPath
     * @param pathParams
     * @returns {string}
     */
    pathParamsToUrl(apiPath, pathParams) {
        let path = this.pathToUrl(apiPath)
        if (pathParams && pathParams.length > 0) {
            pathParams.forEach((item) => {
                path += `/${item}`
            })
        }
        return path
    }


    /**
     * 判断和根据 当前请求方式和参数 决定数据传送方式
     * @param method
     * @param params
     * @param data
     * @returns {{}}
     */
    checkMethod({method, params, data}) {
        let options = {}
        if ((method === 'post' || method === 'put' || method === 'delete') && Object.keys(params).length === 0) {
            options.data = data;
        } else if ((method === 'post' || method === 'put' || method === 'delete') && Object.keys(params).length > 0) {
            options.data = data;
            options.params = params;
        } else {
            options.params = data;
        }

        return options
    }


}

export {apiDataRequest}
