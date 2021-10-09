import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖
// import cnLang from 'element-ui/lib/locale/lang/zh-CN'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control
import './utils/error-log' // error log

/** 文本编辑器 */
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// eslint-disable-next-line no-extend-native
String.prototype.format = function(args) {
  let result = this
  if (arguments.length > 0) {
    if (arguments.length === 1 && typeof (args) === 'object') {
      for (const key in args) {
        if (args[key] !== undefined) {
          const reg = new RegExp('({' + key + '})', 'g')
          result = result.replace(reg, args[key])
        }
      }
    } else {
      for (let i = 0; i < arguments.length; i++) {
        if (arguments[i] !== undefined) {
          const reg = new RegExp('({)' + i + '(})', 'g')
          result = result.replace(reg, arguments[i])
        }
      }
    }
  }
  return result
}

Vue.use(VueQuillEditor /* { default global options } */)

Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
  // locale: locale // 如果使用中文，无需设置，请删除
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
