<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar + '?imageView2/1/w/80/h/80'" class="user-avatar" />
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> Home </el-dropdown-item>
          </router-link>
          <a
            target="_blank"
            href="https://github.com/PanJiaChen/vue-admin-template/"
          >
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a
            target="_blank"
            href="https://panjiachen.github.io/vue-element-admin-site/#/"
          >
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>
          <!---
         1. .native的作用

Vue 自定义组件添加点击(@click)事件


件分为两种类型： 原生系统事件 比如click 双击 鼠标等、自定义事件。
在Vue开发中自定义组件之后，需要往组件身上添加click之类的一些操作事件，但是加上之后会无效。
原因是因为没有加上 native,官网对于 native 的解释为:.native - 监听组件根元素的原生事件。

因此正确的写法是：
// 无效写法
<custom @click="touchCustom"></custom>     这种写法会被当作组件的自定义事件，也就是组件被点击的时候没有触发组件的原生click事件。     
// 正确写法
<custom @click.native="touchCustom"></custom>

在DOM元素上绑定的事件，监听的是原生事件，在组件上绑定的事件，监听的是自定义事件，需要用this.$emit()来触发。


当我使用@Click给一个组件绑定一个事件的时候，实际上这个事件绑定的是自定义的事件，并不是我期望绑定的原生dom click事件

2. 这里的native是监听 el-dropdown-item 组件的根组件上的原生dom点击事件
          
          -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    /**
     * 
     * 1.mapGetters辅助函数将Store中的getter映射到局部计算属性
     * 
     * 计算属性是说 当组件的某一个属性发生变化的时候  计算属性会重新计算。
     * 那么 当前Vue对象的$store 属性 所对应  Store对象的属性 也可以用来创建
     * Vue对象的计算属性
     * a=this.$store.state.a
     * 
     * 那么为什么下面要使用 getters呢？ 因为Vue对象的计算属性可能 并不等于state对象的属性。 也就是说我们可能 需要对state对象的属性进行逻辑计算之后 得到的值才是计算属性。所以Store中引入了getters
     * 
     * 
     * 
     * 2.
     * 对象展开运算符#
mapState 函数返回的是一个对象。我们如何将它与局部计算属性混合使用呢？通常，我们需要使用一个工具函数将多个对象合并为一个，以使我们可以将最终对象传给 computed 属性。但是自从有了对象展开运算符，我们可以极大地简化写法：
computed: {
  localComputed () {  },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    // ...
  })

  */
    ...mapGetters(["sidebar", "avatar"]),
  },
  methods: {
    toggleSideBar() {
      /**
       * 子组件的点击时触发自定义事件toggleSideBar，从而执行父组件（当前组件）的toggleSideBar方法，修改store 中的sidebar对象中的opened属性值。
       * 而当前组件 存在sidebar 计算属性，这个计算属性依赖于store对象中的sidebar
       * 
       * 然后 当前组件中使用到的 hamburger 组件 又依赖于当前对象的计算属性sidebar的opened属性，因此 最终会影响 hamburger组件的样式
       */
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
