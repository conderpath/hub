import { apiDataRequest } from './apiDataRequest'
import { dataCommonInsert } from '../api/apiCommonInsert'
const $apiDataRequest = new apiDataRequest()
const send = ({ formObjectCode, applicationCode, api, permissions})=> {
  if(!formObjectCode || !applicationCode || !api ) {
    permissions.length = 0
    return
  }
  $apiDataRequest.request({
    api,
    method: 'post',
    data: Object.assign({}, dataCommonInsert(formObjectCode), {
      applicationCode,
      formObjectCode
    })
  }).then(res=>{
    permissions.push(...(res.data||[]))
  }).catch(()=>{
    permissions.length = 0
  })
}
export const getBtttonPermissions = ( obj = {})=> {
  send({...obj, api: 'common.currentButtonCodes'})
}
export const getFieldPermissions = (obj = {})=> {
  send({...obj,api: 'common.currentFieldCodes'})
}
export const getRegionPermissions = (obj = {})=> {
  send({...obj,api: 'common.currentRegionCodes'})
}