/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
 1.功能：公共依赖入口
 2.作者：Object
 -----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import SearchInput from './components/searchInput/SearchInput'
import WorkflowOperation from "fe-workflow/src/views/workFlow/component/workflow-operation";
import './assets/styles/reset.scss';
import './style/el.scss'
import './style/reset.less'
import permission from './directive/permission'
import lodash from 'lodash'
import moment from 'moment'
import { store } from './store'
import './filters'

import * as jsPlumbBrowserUI from "@jsplumb/browser-ui";
import { BezierConnector } from "@jsplumb/connector-bezier"
import {FlowchartConnector} from '@jsplumb/connector-flowchart'
import components from './components/components';
import widget from './components/widget/element-ui';
import Ac from './components/widget';
import './components/widget/core/style/index.less'
import Langs from "./components/widget/core/i18n";
import { i18n } from "./i18n";
import AcvuPlugin from './components/widget/ac-ueditor' //引入自定义插件

[components].forEach((item) => {
  Object.keys(item).map(ele => {
    let component = item[ele];
    let name = component.name || '';
    name = name.substr(name.length - 1, 1) === '-' ? (name.substr(0, name.length - 1)) + ele : name;
    Vue.component(name, component);
  });
})

Object.keys(Langs).forEach((item) => {
  i18n.mergeLocaleMessage(item, Langs[item])
})


Vue.use(ElementUI, { size: 'small' });
Vue.use(Ac);
Vue.use(AcvuPlugin);
Vue.directive('permission', permission)
Vue.component('SearchInput', SearchInput)
Vue.component('AcWorkflowOperation',WorkflowOperation)

const publicStartPath = '/application/'

export { Vue, VueRouter, i18n, Vuex, store, lodash, moment, publicStartPath, jsPlumbBrowserUI ,BezierConnector,FlowchartConnector}
export * from './utils'
export * from './api/apiCommonInsert'
