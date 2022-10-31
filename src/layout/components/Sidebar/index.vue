<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!--
        1.defaultActive : 当前激活菜单的index。 实际上 defaultActive的值可以是一个字符串 “/product/sku” ,然后只要这个字符串能够匹配到 el-submenu 或者el-menu-item的index属性就好
        2.defaultActive 表示当前激活的菜单index，而不是默认激活的菜单index。 注意理解语义。在这里我们根据地址栏来计算当前激活的菜单。每一个sidebar-item他的
    -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <!--
        问题： 1. 这里的 :base-path  在子组件中使用了props basePath 这种驼峰命名
       权威指南Vue.js： HTML 中的 attribute 名是大小写不敏感的，所以浏览器会把所有大写字符解释为小写字符。这意味着当你使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名 

        --->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo },
  computed: {
    //...扩展运算符将返回值扩展到当前的Vue对象的身上
    //使用对象展开运算符将此对象混入到外部对象中
    ...mapGetters(["sidebar"]),
    routes() {
      //options： 创建Router时传递的原始的配置对象，只读
      //routes : options对象（RouterOptions）的routes属性时 添加到路由的路由列表
      return this.$router.options.routes;
    },
    activeMenu() {
      const route = this.$route;
      
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      //opened=1 或者0 ，1：展开，0关闭
      return !this.sidebar.opened;
    },
  },
};
</script>
