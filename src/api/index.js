/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能：Api path 文件
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import workflowApi from "fe-workflow/src/api";

export default {
    timeout: 60 * 1000 ,  //超时请求时间，单位：毫秒
    headers:{

    },
    successStatusCode : 200 ,
    statusKey:'code',
    messageKey:'message',
    prefix : {
        dev : "/api/" ,
        test : "/api/" ,
        sim : "/api/" ,
        prod : "/api/"
    } ,
    suffix: { //后缀代表接口去掉prefix的部分，这里可以是无限级的树状结构，根据自己的需要
        common : {
            currentButtonCodes:'authority-service/currentButtonCodes',
            currentFieldCodes:'authority-service/currentFieldCodes',
            currentRegionCodes:'authority-service/currentRegionCodes',
            valuesetQueryForMap:'valueset/valuesetvalue/queryForMap',
        } ,
        ...workflowApi
    }
} ;
