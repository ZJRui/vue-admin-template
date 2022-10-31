<template>
  <!---
  1. 比如 404 这个路由 配置的hidden就是true，因此他不在侧边栏展示
    { path: "*", redirect: "/404", hidden: true }

  2. 
  -->
  <div v-if="!item.hidden">
    <!---
       1.有的时候我们想通过v-if 同一个变量控制多个 标签的展示与否，此时可以将这些标签放到同一个template中，然后再 template中使用v-if。 
       2. 下面hasOneShowingChild 的逻辑 就是说： 如果当前的路由item 没有子路由菜单，或者子路由菜单只有一个需要展示，那么这个时候 我们就 只需要使用app-link展示菜单，不需要使用带有下拉菜单功能的elsubmen
    -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <!---
         1.这一部分是 app-link 标签的内部。 因此下面的内容将会被放置到 app-linK 组件的插槽中
         2. 在elementui中 
         <el-menu-item index="3" disabled>
          <i class="el-icon-document"></i>
          <span slot="title">导航三</span>
        </el-menu-item>
        我们这里是想用item组件 来替换 el-menu-item中的内容
        -->
        <el-menu-item
          :index="resolvePath(onlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': !isNest }"
        >
          <item
            :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"
            :title="onlyOneChild.meta.title"
          />
        </el-menu-item>
      </app-link>
    </template>

    <!---
      1.下面的 el-submen 中使用了v-else  这个v-else是和 template标签上的v-if 成对的，
    因此 SidebarItem这个组件，要么渲染 template 标签，要么渲染 el-submenu
    2. 为什么下面 使用了 el-submen ,既然有sub ，那么el-submen 应该位于el-menu 的内部，这个el-menu又在哪里呢？ el-menu 位于index.vue 中，index.vue 使用到了sidebaritem vue，而这里的sidebaritem vue中 会使用el-submenu 所以是合理的
    3.popper-append-to-body	是否将弹出菜单插入至 body 元素。在菜单的定位出现问题时，可尝试修改该属性  
    -->
    <el-submenu
      v-else
      ref="subMenu"
      :index="resolvePath(item.path)"
      popper-append-to-body
    >
      <!---
     1.这里为 template 指定一个具体名称为title的插槽，那么问题就是 <slot name='title'></stlo> 在哪里定义的. 这个是 element ui 中的el-menu 中定义的，比如 
      https://element.eleme.io/#/zh-CN/component/menu

      2. 为什么下面 要使用 template 标签，slot=‘title’ ？  el-submen 是说 当前菜单 存在子菜单。 子菜单 我们通过 <sidebar-item></sidebar-item>来渲染
      对于当前菜单 需要展示的名称，我们通过下面的这个template 来展示，这个template绑定到了element-ui的el-submenu组件的名称为title的slot插槽上。 
    -->
      <template slot="title">
        <item
          v-if="item.meta"
          :icon="item.meta && item.meta.icon"
          :title="item.meta.title"
        />
      </template>
      <!---
      1.vue component组件内部自己引用自己
      2.   :base-path="resolvePath(child.path)"
       这就使得sidebar-item的basePath 属性根据路由项Item不断的拼接 路由的path
      -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils/validate";

import Item from "./Item";
import AppLink from "./Link";
import FixiOSBug from "./FixiOSBug";

export default {
  /**
   * //在这里name就相当于注册了当前的组件。可以直接引用自己了。先看一下官网中的name作用
   * 允许组件模板递归地调用自身。注意，组件在全局用 Vue.component() 注册时，全局 ID 自动作为组件的 name。
   */
  name: "SidebarItem",
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    // 因为： v-for="route in routes" :key="route.path" :item="route"  所以item时路由 表中的每一个路由项
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    //问题：为什么这个only onlyChild 需要这样写,而不是放置到return 的data中
    //这种写法 onlyOneChild 不是响应式数据，在Chrome Dev 中的Vue组件中的看不到onlyOneChild属性
    this.onlyOneChild = null;
    return {};
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      //parent {path: '/', component: {…}, redirect: '/dashboard', children: Array(1)}
      console.log("parent", parent);
      /**
       * test {path: 'spu', name: 'Spu', meta: {…}, component: ƒ}
       * 这个输出和上面的parent没什么区别， 也就是说 对一个对象 进行扩展 {...parent} 得到的结果其实
       * 还是这个对象，实际上是对这个对象的浅拷贝
       *
       * 扩展运算符在对象上使用，更多的是 如下写法,  将parent的属性浅拷贝，同时携带其他属性 创建一个新对象this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
       *
       */
      console.log("test", { ...parent });
      // 错误写法：...parent没有使用花括号括起来  console.log("test",...parent)

      /**
       * 参数children是 item.children，过滤出hidden不为true的 children
       *
       */
      const showingChildren = children.filter((item) => {
        if (item.hidden) {
          return false;
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item;
          return true;
        }
      });

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        // 需要展示的子路由的长度=1
        return true;
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        /**
         * 问题： 三个点 ：（1） Es6的reset参数， 形式为  "...变量名"，用于获取函数的多余参数 ，这样不需要使用arguments对象了，  function add(...values)
         * (2) 扩展运算符是三个点， 他如同rest参数的逆向运算，将一个数组转为用逗号分割的参数序列
         *
         * 2 问题：  下面对..parent 进行扩展，parent本身含有path属性，但是我们 又定义了一个 path:""
         *
         * 3. onlyOneChild 有什么作用呢？ 在渲染菜单的时候，如果这个路由没有子路由 或者子路由中只有一个需要展示  那么我们将当前的 路由渲染为 menu-item 而不是下拉菜单。
         * 但是当子路由只有一个路由的情况下 我们还需要注意这个子路由可能有多个子路由，那么这种情况下 这个子路由就需要是一个 下拉菜单。
         *
         *
         */
        this.onlyOneChild = { ...parent, path: "", noShowingChildren: true };
        //console.log("onlyOneChild",this.onlyOneChild)
        return true;
      }

      return false;
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      /**
       *
       * 1. path 是： D:\LocalProjects\尚品汇\bilibili-vue-shangguigu\vue-admin-template\node_modules\@types\node\ts4.8\path.d.ts
       * 也就是Node中的一个模块
       *
       * path.resolve() 该方法将一些的 路径/路径段 解析为绝对路径。
       * path.resolve('/foo/bar','./baz');相当于：
       * cd /foo/bar //此时当前路径为 /foo/bar
       * cd ./baz //此时路径为 /foo/bar/baz
       *
       * path.resolve('/foo/bar', '/tmp/file/');相当于
       * cd /foo/bar //此时路径为 /foo/bar
       * cd /tmp/file/ //此时路径为 /tmp/file
       *
       * path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');// 如果当前工作目录为 /home/myself/node，相当于：
       * cd wwwroot //此时路径为/home/myself/node/wwwroot
       * cd static_files/png/ //此时路径为/home/myself/node/wwwroot/static_files/png/
       * cd ../gif/image.gif //这里用cd描述其实是不对的。。。。此时路径为/home/myself/node/wwwroot/static_files/gif/image.gif
       *
       * -----------------------
       *2.
       * 在路由配置项中有一个顶层路由配置
       *{
       *    path: "external-link",
       *    component: Layout,
       *    children: [
       *      {
       *        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
       *        meta: { title: "External Link", icon: "link" },
       *      },
       *    ],
       *  },
       *
       * 在sidebar.vue 组件中，对每一个顶层路由 都会使用一个sidebar-item 组件渲染。
       * 同时传递当前路由项的path值 给 sidebar-item组件的basePath属性。
       *
       * 对于上面的路由配置项，交割sidebar-item 渲染， sidebar-item会发现这个路由项中的chidren只有一个元素，因此会使用app-link 来渲染，而不是使用el-submen来渲染。
       * 因此    <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)"> 中的 resolvePath的参数就是 https://panjiachen.xxxx
       *
       *
       *
       *
       *
       *
       *
       */
      console.log("this.basePath", this.basePath);
      console.log("routePath", routePath);
      return path.resolve(this.basePath, routePath);
    },
  },
};
</script>
