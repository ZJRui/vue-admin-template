/* eslint-disable object-curly-spacing */
/* eslint-disable arrow-spacing */
/* eslint-disable comma-spacing */
/* eslint-disable quotes */
/* eslint-disable key-spacing */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 *
 *
 *
 * 首先  http://localhost:9528/ppp 会被当作  http://localhost:9528/ppp#/
 * 也就是访问 /， 根据路由规则配置 /会被重定向到 /dashboard
 *
 * 但是访问http://localhost:9528/#/ppp 就会被重定向到  http://localhost:9528/#/404
 *
 *
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  //  当访问/的时候会展示Layout组件，同时会redirect到 /dashboard 这是一个子路由
  // 注意我们发现这里配置的每个路由 大部分都是 component=Layout，这是因为Layout这个组件本身 占用了整个网页页面，我们的路由实际上是控制了Layout内部的 AppMain组件的展示内容，所以在每个路由控制里面都有 children子录用来控制展示哪个组件
  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        /**
         * 1.import命令能够接收什么参数 import()函数就能接收什么参数，两者的区别主要是后者为动态加载
         * 2. Vue Router 支持开箱即用的动态导入，这意味着你可以用动态导入代替静态导入：
         * import UserDetails from './views/UserDetails.vue' 替换成
         * const UserDetails = () => import('./views/UserDetails.vue')
         *
         * 3. import中的参数  dashboard文件夹下又index.vue 因此 这三种写法都可以：
         * () => import("@/views/dashboard/index.vue"),
         * () => import("@/views/dashboard/index"),
         * () => import("@/views/dashboard"),------>/product/tradeMark 路由就是这种写法
         *
         */

        component: () => import("@/views/dashboard/index"),
        meta: { title: "Dashboard", icon: "dashboard" },
      },
    ],
  },

  {
    path: "/example",
    component: Layout,
    redirect: "/example/table",
    name: "Example",
    meta: { title: "Example", icon: "el-icon-s-help" },
    children: [
      {
        path: "table",
        name: "Table",
        component: () => import("@/views/table/index"),
        meta: { title: "Table", icon: "table" },
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/tree/index"),
        meta: { title: "Tree", icon: "tree" },
      },
    ],
  },

  {
    path: "/form",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Form",
        component: () => import("@/views/form/index"),
        meta: { title: "Form", icon: "form" },
      },
    ],
  },

  {
    path: "/nested",
    component: Layout,
    redirect: "/nested/menu1",
    name: "Nested",
    meta: {
      title: "Nested",
      icon: "nested",
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/nested/menu1/index"), // Parent router-view
        name: "Menu1",
        meta: { title: "Menu1" },
        children: [
          {
            path: "menu1-1",
            component: () => import("@/views/nested/menu1/menu1-1"),
            name: "Menu1-1",
            meta: { title: "Menu1-1" },
          },
          {
            path: "menu1-2",
            component: () => import("@/views/nested/menu1/menu1-2"),
            name: "Menu1-2",
            meta: { title: "Menu1-2" },
            children: [
              {
                path: "menu1-2-1",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-1"),
                name: "Menu1-2-1",
                meta: { title: "Menu1-2-1" },
              },
              {
                path: "menu1-2-2",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-2"),
                name: "Menu1-2-2",
                meta: { title: "Menu1-2-2" },
              },
            ],
          },
          {
            path: "menu1-3",
            component: () => import("@/views/nested/menu1/menu1-3"),
            name: "Menu1-3",
            meta: { title: "Menu1-3" },
          },
        ],
      },
      {
        path: "menu2",
        component: () => import("@/views/nested/menu2/index"),
        name: "Menu2",
        meta: { title: "menu2" },
      },
    ],
  },

  {
    path: "/external-link",
    component: Layout,
    children: [
      {
        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
        meta: { title: "External Link", icon: "link" },
      },
    ],
  },
  {
    path: "/product",
    component: Layout,
    name: "Product",
    meta: { title: "商品管理", icon: "el-icon-goods" },
    children: [
      {
        path: "trademark",
        name: "TradeMark",
        component: () => import("@/views/product/tradeMark"),
        meta: { title: "品牌管理" },
      },
      {
        path: "attr",
        name: "Attr",
        component: () => import("@/views/product/Attr"),
        meta: { title: "平台属性管理" },
      },
      {
        path: "spu",
        name: "Spu",
        component: () => import("@/views/product/Spu"),
        meta: { title: "Spu管理" },
      },
      {
        path: "sku",
        name: "Sku",
        component: () => import("@/views/product/Sku"),
        meta: { title: "Sku管理" },
      },
    ],
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true },
];

//learn
//const tmpRouter=Router.createRouter({})

//创建路由对象
const createRouter = () =>
  new Router({
    //前端路由:即由前端来维护一个路由规则。实现由两种： 一种是利用 url的hash，就是常说的描点（#）,JS通过hashChange事件来监听url的改变，IE7下需要轮询； 另一种就是HTML5的History模式，他使得url看起来像普通网站那样，以"/"分割，没有#,但页面并没有跳转，不过使用这种模式需要服务端支持，服务端在接收到所有的请求后，都指向同一个HTML文件，不然会出现404.因此SPA只有一个HTML，整个网站所有的内容都在这一个html里，通过JavaScript来处理
    //Mode 为history会开启HTML5的history路由模式，通过 / 设置路径。 如果不胚子和mode，就会使用 #来设置路径。比如访问http://ip:8080 会变成 http://ip:8080/#/  dashboard 变成http://ip:8080/#/dashboard。 开启history路由，在生产环境时服务端必须进行配置，将所有路由都指向同一个html，或设置404页面为该html，否则刷新时页面会出现404

    mode: "history", // require service support -------------》 胚子和
    //scrollBehavior# 在页面之间导航时控制滚动的函数。可以返回一个 Promise 来延迟滚动。有关更多详细信息，请参见滚动行为。 https://router.vuejs.org/zh/guide/advanced/scroll-behavior.html
    //scrollBehavior: () => ({ y: 0 }),
    scrollBehavior(to, from, savedPosition) {
      console.log("scrollBehavior： " + to + "| " + from + "|" + savedPosition);
      return {
        y: 0,
      };
    },
    routes: constantRoutes,
  });

const router = createRouter();

/**
 * 因为用户登录后可能动态增加路由。
 * Right now it is possible to dynamically add routes by calling router.addRoutes([/* routes
 * 所以用户退出的时候需要重置为最初的路由，所以我们提供了替换路由的方法。
 *
 * 需要注意的是 在退出的时候会执行 resetRouter 通过createRouter创建一个新的VueRouter对象，但是这个新的VueRouter 并没有 设置到Vue对象身上。 我们这里export default router 所导出的VueRouter 仍然是 最开始的第一个VueRouter对象。
 * resetRouter中新创建的VueRouter 我们用新VueRouter的matcher替换 默认导出router对象的matcher
 *
 */
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
