/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能：i18n配置
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

import Vue from 'vue'
import locale from 'element-ui/lib/locale'
import VueI18n from 'vue-i18n'
import messages from './langs'
import {localRead, localSave} from '../utils'

Vue.use(VueI18n)

// 从localStorage中拿到用户的语言选择，如果没有，那默认中文。
const systemLanguage = 'SYSTEM_LANGUAGE'
if (!localRead(systemLanguage)) {
    localSave(systemLanguage, 'zh')
}
const i18n = new VueI18n({
    locale: localRead(systemLanguage) || 'zh',
    messages,
    silentTranslationWarn: true
})

locale.i18n((key, value) => i18n.t(key, value))

export {i18n}
