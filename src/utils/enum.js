import {dataCommonInsert} from "../api/apiCommonInsert";
import {apiDataRequest } from './apiDataRequest'
const $apiDataRequest = new apiDataRequest()

export const MODE = {
    CREATE : '1',
    EDITE:'2',
    VIEW:'3',
    COPY:'4',
    APPROVE:'5'
}

export const getEnum =(data = [],cb= (b)=>{})=>{
    if (data.length > 0){
        $apiDataRequest.request({
            api:'common.valuesetQueryForMap',
            method:'post',
            data: dataCommonInsert({
                filterFields:[
                    {
                        conditionOperator: '=',
                        fieldName: 'parentCode',
                        relationship: 'and',
                        value: [...data]
                    }
                ]
            })
        }).then((res)=>{
            let result = res.data || {}
            for (let prop in result ){
                result[prop] = result[prop].map((item)=>{
                    return{
                        ...item,
                        label:item.value,
                        value:item.code
                    }
                })
            }
            cb && cb(result)
        }).finally(()=>{

        })
    }else {
        cb && cb({})
    }
}