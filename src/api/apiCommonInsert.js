/** ++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能： api 请求入参
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++ */
import {localRead} from '../utils'

export const dataCommonInsert = (data = {},type=1,
                                 parentCode='',otherData = { },) => {
  const {applicationCode= '',microCode = '',formObjectCode ='' } = otherData || {}
  let token = localRead('token')
  return (token&&type===1) ? {
    ak: 'string',
    language: 'zh_CN',
    parentCode: parentCode,
    applicationCode:applicationCode,
    microCode:microCode,
    formObjectCode:formObjectCode,
    sign: 'TjbyQBrEXcfS0Bk/eEgZ+wtZvObFsLijLes+l6IgrsUkgNmcPi1HEQ==',
    sk: 'string',
    token: token,
    data
  } : data
}
