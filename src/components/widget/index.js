import components from './element-ui';
import {validatenull, deepClone, dataURLtoFile, findObject, vaildData, findArray, setPx, sortArrys, isJson, downFile, loadScript,createObj } from './core/utils/utils';
import locale from './core/locale';
import config from './element-ui/config';
import dialogDrag from './core/directive/dialog-drag'

let prototypes = {
  deepClone,
  dataURLtoFile,
  isJson,
  setPx,
  vaildData,
  sortArrys,
  findArray,
  validatenull,
  downFile,
  loadScript,
  findObject,
  createObj

};
const install = function (Vue, opts = {}) {
  // 初始化指令
  Vue.directive('dialogdrag', dialogDrag);
  Object.keys(components).map(ele => {
    let component = components[ele];
    let name = component.name || '';
    name = name.substr(name.length - 1, 1) === '-' ? (name.substr(0, name.length - 1)) + ele : name;
    Vue.component(name, component);
  });
  Object.keys(prototypes).forEach((key) => {
    Vue.prototype[key] = prototypes[key];
  });
  // 国际化
  locale.use(opts.locale);
  locale.i18n(opts.i18n);
  Vue.prototype.$axios = opts.axios || window.axios;
  Vue.prototype.$typeList = {
    img: /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)/,
    video: /\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|ogg|mp4)/
  };
/*  if (opts.theme === 'dark') {
    document.documentElement.className = 'acvu-theme--dark';
  }*/
  Vue.prototype.$uploadFun = function (column = {}, safe) {
    safe = safe || this;
    let list = ['uploadPreview', 'uploadBefore', 'uploadAfter', 'uploadDelete', 'uploadError', 'uploadExceed'];
    let result = {};
    if (column.type === 'upload') {
      list.forEach(ele => {
        if (!column[ele]) {
          result[ele] = safe[ele];
        }
      });
    } else {
      list.forEach(ele => {
        result[ele] = safe[ele];
      });
    }
    return result;
  };
  Vue.prototype.$ACVU = Object.assign(opts, {
    ui: (() => {
      Vue.prototype[config.is] = true;
      return config
    })(),
    size: opts.size || 'small',
    calcHeight: opts.calcHeight || 0,
    menuType: opts.menuType || 'text',
    qiniu: Object.assign({
      AK: '',
      SK: '',
      scope: '',
      url: '',
      bucket: 'https://upload.qiniup.com',
      deadline: 1
    }, (opts.qiniu || {})),
    ali: Object.assign({
      region: '',
      endpoint: '',
      stsToken: '',
      accessKeyId: '',
      accessKeySecret: '',
      bucket: ''
    }, (opts.ali || {}))
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

const Acvu = Object.assign({
  version: '1.0.0',
  locale: locale.locale,
  install
}, components);

export default Acvu
