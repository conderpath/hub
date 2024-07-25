import {formatTime} from "../../../widget/core/utils/utils";
import enums from './enums'
import { dataCommonInsert } from "../../../../api/apiCommonInsert"
import { apiDataRequest as $apiDataRequest } from  "../../core/utils/apiDataRequest"
// 银行账号
export const bank = {
    placeholder:'请选择银行',
    listApi:'businessWidget.inputTable.bankList',
    countApi:'businessWidget.inputTable.bankCount',
    props:{
        label:'bankName',
        value:'accountNo'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey: 'accountNo',
            column:[
                { label: '银行账号', prop: 'accountNo',search: true, conditionOperator: 'like', relationship: 'AND',},
                { label: '银行名称', prop: 'accountName',search: true, conditionOperator: 'like', relationship: 'AND',},
                { label: '开户行名称', prop: 'bankName', search:true},
            ]
        }
    }

}
export const bankBranch = {
    placeholder:'请选择联行号',
    listApi:'businessWidget.inputTable.bankBranch',
    props:{
        label:'bankCnaps',
        value:'bankCnaps'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            column:[
                { label: '分行名称', prop: 'bankBranchName',search:true},
                { label: '联行号', prop: 'bankCnaps',search:true},
                { label: '所属银行名称', prop: 'bankName'},
                { label: '所属地区', prop: 'district'},
            ]
        }
    }
}
// 公司
export const company = {
    placeholder:'请选择公司',
    listApi:'businessWidget.inputTable.orgList',
    props:{
        label:'name',
        value:'code'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'id',
            searchSpan: 12,
            column:[
                { label: '公司编码', prop: 'code', search: true, },
                { label: '公司名称', prop: 'name', search: true, },
                { label: '账套编码', prop: 'coaComCode' },
            ]
        }
    }
}
// 客户
export const customer = {
    placeholder:'请选择客户',
    listApi:'businessWidget.inputTable.customerList',
    countApi:'businessWidget.inputTable.customerCount',
    props:{
        label:'compNameCn',
        value:'code'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'id',
            searchSpan: 12,
            column:[
                { label: '客户编号', prop: 'code', search: true, conditionOperator: 'like', relationship: 'AND'},
                { label: '客户名称', prop: 'compNameCn', search: true, conditionOperator: 'like', relationship: 'AND'},
            ]
        }
    }
}
// 分列客户
export const splitCustomer = {
    placeholder:'请选择分列客户',
    listApi:'businessWidget.inputTable.splitCustomerList',
    countApi:'businessWidget.inputTable.splitCustomerCount',
    props:{
        label:'splitCompName',
        value:'code'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'code',
            searchSpan: 12,
            column:[
                { label: '分列客户编号', prop: 'code', search: true, conditionOperator: 'like', relationship: 'AND'},
                { label: '分列客户名称', prop: 'splitCompName', search: true, conditionOperator: 'like', relationship: 'AND'},
            ]
        }
    }
}
// 用户
export const user = {
    placeholder:'请选择用户',
    listApi:'businessWidget.inputTable.userList',
    props:{
        label:'nickName',
        value:'id'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'id',
            searchSpan: 12,
            column:[
                { label: '用户名', prop: 'nickName', },
                { label: '登录账号', prop: 'loginName', search: true, },
                { label: '状态', prop: 'state', search: true, type: 'select', dicData: enums.USER_STATE },
            ]
        }
    }
}

// 业务类型
export const business = {
    placeholder:'请选择业务类型',
    listApi:'businessWidget.inputTable.businessTypeList',
    countApi:'businessWidget.inputTable.businessTypeCount',
    props:{
        label:'businessTypeName',
        value:'businessTypeNo'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'businessTypeNo',
            searchLabelWidth: 120,
            searchSpan: 12,
            column:[
                { label: '业务类型编码', prop: 'businessTypeNo', overHidden: true, search: true, conditionOperator: 'like', relationship: 'AND',},
                { label: '业务类型名称', prop: 'businessTypeName',overHidden: true, search: true,  conditionOperator: '=', relationship: 'AND',},
                { label: '状态', prop: 'availableStatus', overHidden: true, disabled: true, search: true, type: 'select', dicData: enums.AVAILABLE_STATUS,  conditionOperator: '=', relationship: 'AND'},
            ]
        }
    }
}

// 费用项目
export const expenseItem = {
    placeholder:'请选择费用项目',
    listApi:'businessWidget.inputTable.expenseItemList',
    countApi:'businessWidget.inputTable.expenseItemCount',
    props:{
        label:'expenseItemNo',
        value:'expenseItemNo'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'expenseItemNo',
            searchLabelWidth: 120,
            searchSpan: 12,
            column:[
                { label: '费用项目编号', prop: 'expenseItemNo', overHidden: true, search: true, conditionOperator: 'like', relationship: 'AND',},
                { label: '费用项目名称', prop: 'expenseItemName',overHidden: true, search: true,  conditionOperator: '=', relationship: 'AND',},
            ]
        }
    }
}

// 供应商
export const supplier = {
    placeholder:'请选择供应商',
    listApi:'businessWidget.inputTable.supplierQuery',
    countApi:'businessWidget.inputTable.supplierCount',
    props:{
        label:'supName',
        value:'code'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'code',
            searchLabelWidth: 120,
            searchSpan: 12,
            column:[
                { label: '供应商编号', prop: 'code', overHidden: true, search: true, conditionOperator: 'like', relationship: 'AND',},
                { label: '供应商名称', prop: 'supName',overHidden: true, search: true,  conditionOperator: 'like', relationship: 'AND',},
                { label: '供应商简称', prop: 'supShortName',overHidden: true, },
                { label: '统一社会信用代码', prop: 'uniSocCretCode',overHidden: true, },


            ]
        }
    }
}

// 雇员
export const employee = {
    placeholder:'请选择雇员',
    listApi:'businessWidget.inputTable.employeeQuery',
    countApi:'businessWidget.inputTable.employeeCount',
    props:{
        label:'uniidName',
        value:'code'
    },
    column:{
        children:{
            singleSelectionRadio:true,
            rowKey:'code',
            searchLabelWidth: 120,
            searchSpan: 12,
            column:[
                { label: '雇员编号', prop: 'code', overHidden: true, search: true, conditionOperator: 'like', relationship: 'AND',},
                { label: '雇员名称', prop: 'uniidName',overHidden: true, search: true,  conditionOperator: 'like', relationship: 'AND',},
                { label: '雇员默认证件号码', prop: 'uniid',overHidden: true, },
                { label: '雇员默认手机号', prop: 'mobile',overHidden: true, },
            ]
        }
    }
}
// 组织树节点(组织)
export const treeNode = {
    placeholder:'请选择组织',
    listApi:'businessWidget.inputTable.treeNodeList',
    props:{
        label:'authorityNodeName',
        value:'authorityNodeCode'
    },
    rowKey:'authorityNodeCode',
    searchSpan: 12,
    column: {
        children: {
            singleSelectionRadio: true,
            rowKey: 'code',
            searchLabelWidth: 120,
            searchSpan: 12,
            column: [
                {label: '组织编码', prop: 'authorityNodeCode', search: true},
                {label: '组织名称', prop: 'authorityNodeName', search: true,},
            ]
        }
    }
}