/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能：
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/
import {validatenull} from 'feSystemHub'
import {SELECT_LIST,DATE_LIST,ARRAY_VALUE_LIST,MULTIPLE_LIST} from '../utils/variable'
import {createObj} from '../utils/utils'

export default {
    methods:{
        getPlaceholder  (column, type) {
            const placeholder = column.placeholder;
            const label = column.label;
            if (type === 'search') {
                const searchPlaceholder = column.searchPlaceholder;
                if (!validatenull(searchPlaceholder)) {
                    return searchPlaceholder;
                } else {
                    return label;
                }
            } else if (validatenull(placeholder)) {
                if (SELECT_LIST.includes(column.type)) {
                    return `${this.$t('tip.select')} ${label}`;
                } else {
                    return `${this.$t('tip.input')} ${label}`;
                }
            }

            return placeholder;
        },
        getSearchType  (column)  {
            const type = column.type;
            const range = column.searchRange;
            let result = type;
            if (['radio', 'checkbox', 'switch'].includes(type)) {
                result = 'select';
            } else if (DATE_LIST.includes(type)) {
                let rangeKey = 'range';
                if (range) {
                    if (!type.includes(rangeKey)) {
                        result = type + rangeKey;
                    } else {
                        result = type;
                    }
                } else result = type.replace(rangeKey, '');
            } else if (['textarea'].includes(type)) {
                result = 'input';
            }
            return result;
        },
        getSlotName (item = {}, type = 'D') {
            let result = {
                F: 'Form',
                H: 'Header',
                E: 'Error',
                L: 'Label',
                S: 'Search',
                T: 'Type',
                N: 'DynamicHeader',
                D: ''
            }
            return item.prop + result[type]
        },
        formInitVal  (list = [])  {
            let tableForm = {};
            list.forEach(ele => {
                if (
                    ARRAY_VALUE_LIST.includes(ele.type) ||
                    (MULTIPLE_LIST.includes(ele.type) && ele.multiple) ||
                    ele.range || ele.dataType === 'array'
                ) {
                    tableForm[ele.prop] = [];
                } else if (
                    ['rate', 'slider', 'number'].includes(ele.type) ||
                    ele.dataType === 'number'
                ) {
                    tableForm[ele.prop] = undefined;
                } else {
                    tableForm[ele.prop] = '';
                }
                if (ele.bind) {
                    tableForm = createObj(tableForm, ele.bind);
                }
                // 表单默认值设置
                if (!validatenull(ele.value)) {
                    tableForm[ele.prop] = ele.value;
                }
            });
            return {
                tableForm
            };
        }
    }
}
