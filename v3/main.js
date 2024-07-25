import './assets/main.css'

import { createApp } from 'vue'
import createPinia from '@/stores/store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import { toLine } from "@/utils";
import permission from "@/directive/permission";
import components from './components/widget/index'
import '../src/styles/index.less'
const app = createApp(App)
for (const [key, component] of Object.entries(Icons)) {
  app.component(`el-icon${toLine(key)}`, component)
}
for (const [key, component] of Object.entries(components)) {
  // console.log(`ac${toLine(key)}`)
  app.component(`ac${toLine(key)}`, component)
}
app.use(createPinia)
app.use(router)
app.use(ElementPlus)
app.directive('permission', permission)
app.mount('#app')
