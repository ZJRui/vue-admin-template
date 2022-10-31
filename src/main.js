import Vue from 'vue'

//问题： 这样引入css 是不是意味着 全局状态下都有效？
import 'normalize.css/normalize.css' // A modern alternative to CSS resets

/**
 * Element 为 Vue.prototype 添加了全局方法 $message。因此在 vue instance 中可以采用本页面中的方式调用 Message。
 * 
 * ¶单独引用 :单独引入 Message： import { Message } from 'element-ui';
 * 此时调用方法为 Message(options)。我们也为每个 type 定义了各自的方法，如 Message.success(options)。并且可以调用 Message.closeAll() 手动关闭所有实例。
 * 
 */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

/**
 * 注意这个import 没有使用from
 */
import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'



//注意这里的import 也没有使用from,因为对于 icons/index.js 我们没有export任何内容，只需要import即可
import '@/icons' // icon 

// import from '@/icons'  这种写法是错误的，import 面必须要 跟{} 或者整体名称
//import语句会执行所加载的模块，因此可以有下面的写法。
// import 'lodash'; 
//import { onlyOne } from 'path/to/module'， ES6 想要 import 一个模块中的变量等内容必须对其做模块解构，否则只会执行代码而没有任何导入的内容。
//import lodash from 'lodash' 


import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  /**
   * 注意这里的 ../mock   mock文件夹并不在src目录下
   */
  const { mockXHR } = require('../mock')
  mockXHR()
}

// 将ElementUI插件注册到Vue中，相当于全局注册了el-input 、$message 到Vue
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

// 引入相关api请求接口
import API from '@/api'
// 组件实例的原型的原型指向的是Vue.prototype，任意组件可以使用API相关的接口
Vue.prototype.$API = API

// 组件全局注册
import CategorySelect from '@/components/categorySelect'

Vue.component(CategorySelect.name, CategorySelect)

import HintButton from "@/components/HintButton"
Vue.component(HintButton.name,HintButton)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
