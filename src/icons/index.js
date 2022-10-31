import Vue from "vue";
import SvgIcon from "@/components/SvgIcon"; // svg component

// register globally 
Vue.component("svg-icon", SvgIcon);

console.log("-------------=============--");
/**
 * ƒ webpackEmptyContext(req) {
	var e = new Error("Cannot find moimage.pngdule '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
 */
console.log(require);
console.log("-------------=============--");

/**
 * https://webpack.docschina.org/guides/dependency-management/#requirecontext
 *
 * https://www.jianshu.com/p/c894ea00dfec
 *
 *
 *
 *
 */
const req = require.context("./svg", false, /\.svg$/);
/**
  "./eye.svg": "./src/icons/svg/eye.svg",
 "./form.svg": "./src/icons/svg/form.svg",
 "./link.svg": "./src/icons/svg/link.svg",
 "./nested.svg": "./src/icons/svg/nested.svg",
 "./password.svg": "./src/icons/svg/password.svg",
 "./table.svg": "./src/icons/svg/table.svg",
 "./tree.svg": "./src/icons/svg/tree.svg",
 "./user.svg": "./src/icons/svg/user.svg"
};


function webpackContext(req) {
 var id = webpackContextResolve(req);
 return __webpack_require__(id);
}
function webpackContextResolve(req) {
 if(!__webpack_require__.o(map, req)) {
  var e = new Error("Cannot find module '" + req + "'");
  e.code = 'MODULE_NOT_FOUND';
  throw e;
 }
 return map[req];
}
webpackContext.keys = function webpackContextKeys() {
 return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/icons/svg sync \\.svg$";
 */
console.log(req);
const requireAll = (requireContext) =>
  requireContext.keys().map(requireContext);

/**
 *
 * import testIcons from  '@/icons' // icon  引入这里的index.js ，但是这里index.js 没有 exports 任何值
 * console.log("testIcons",testIcons)// undefined
 *
 *
 * 问题： 这里 虽然对 ./src/icons 下的每一个文件进行了require，但是并没有使用 因此require的意义是什么
 *
 *  如果把下面的代码注释掉，会导致 icons/svg 目录下的文件没有被require， 最终导致页面图标展示不出来。
 *
 * 问题就是： require 一个文件，webpack会将这个文件打包进来作为依赖。 但是这里require了，被require到的svg是如何被使用的呢？
 * 在item.vue 文件中， render函数中 push了一个 <svg-icon> 组件，这个 <svg-icon>组件就是SvgIcon.vue
 *
 * SvgIcon Vue组件中 使用了 svg
 *
 * https://blog.csdn.net/weixin_41615439/article/details/104497492
 *
 * 参考文章： https://blog.csdn.net/weixin_41615439/article/details/104497492
 */
let res = requireAll(req);
console.log(res); //(11) [Module, Module, Module, Module, Module, Module, Module, Module, Module, Module, Module]
