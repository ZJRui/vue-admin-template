import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import home from './modules/home'
Vue.use(Vuex)

// //对StoreOptions的定义
// export interface StoreOptions<S> {
//   state?: S | (() => S);
//   getters?: GetterTree<S, S>;
//   actions?: ActionTree<S, S>;
//   mutations?: MutationTree<S>;
//   modules?: ModuleTree<S>;
//   plugins?: Plugin<S>[];
//   strict?: boolean;
// }


const store = new Vuex.Store({
  // 问题： 当我们使用了store的模块的属性之后， 因为  this.$store.dispatch('actionTest'); 中没有指定 模块名称，因此如果多个模块有相同的action 那么每一个模块的action都会被触发。 为了实现模块的 actions mutations等属性之间的隔离，可以在 配置每一个模块的之后指定   namespaced: true, 来实现模块属性之间的隔离。当隔离之后，dispath就需要带上模块名称，比如 user.js 暴漏出来的模块制定了namespaced=true，那么访问其中的action就需要是：  this.$store.dispatch('user/login') /之前是模块名，/之后是action 
  // https://vuex.vuejs.org/zh/guide/modules.html#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4
  modules: {
    app,
    settings,
    user,
    home
  },
  getters
})
console.log("store对象")
console.log(store)

export default store
// 模块与文件是一一对应的。文件不仅可以是 JavaScript 代码或二进制代码，还可以是一
// 个文件夹。最简单的包，就是一个作为文件夹的模块。下面我们来看一个例子，建立一个叫
// 做  somepackage  的文件夹，在其中创建 index.js，
// var somePackage = require('./somepackage');
// 我们使用这种方法可以把文件夹封装为一个模块，即所谓的包。包通常是一些模块的集
// 合，在模块的基础上提供了更高层的抽象，相当于提供了一些固定接口的函数库

