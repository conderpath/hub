/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能：功能权限指令
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

import {store} from '../../store'

export default {
    inserted(el, binding) {
        const { value } = binding
        const roles =  store.getters.funList
        if (value && value instanceof Array && value.length > 0) {
            const permissionRoles = value

            const hasPermission = roles.some(role => {
                return permissionRoles.includes(role)
            })

            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        } else {
            throw new Error(`need roles! Like v-permission="['admin','editor']"`)
        }
    }
}
