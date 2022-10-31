<template>
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
        <!--
          乳沟redirect未noRedirect 或者 索引是最后一个，那么就面包屑就不带有链接
        -->
        <span v-if="item.redirect==='noRedirect'||index==levelList.length-1" class="no-redirect">{{ item.meta.title }}</span>
        <!---设置面包屑具有可跳转的链接，
          prevent: 阻止事件冒泡
        -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import pathToRegexp from 'path-to-regexp'

export default {
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    /**
     * wath一个对象的时候  需要等到该属性变化的时候才会 得到检测。 我们可以
     * 通过配置一个属性值 ：immediate=true表示立即触发。
     * 在这里我们通过 生命周期created函数来立即触发
     */
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      /**
       * 1.实现
       * http://localhost:9528/product/attr   这个路由地址会匹配到两个路由
       * matched 是一个数组，这个数组有两个元素：
       * {
       *   name:"product" //路由名称
       *   meta:{
       *   title : 商品管理 
       *  }
       * 
       * }，
       * {
       *   name:"Attr" //路由名称
       *   meta:{
       *   title : 平台属性管理 
       *  }
       * }
       * 
       * 因此面包屑的内容就是 商品管理/平台属性管理
       * 
       * 2.matched 表示 给定路由地址匹配的标准化的路由记录数组
       */
      console.log("matched",this.$route.matched)
      console.log("currentRoteMatched",  this.$router.currentRoute.matched)
      console.log(this.$route.matched==this.$router.currentRoute.matched)//true
      console.log(typeof this.$route.matched)
      console.log(this.$router.currentRoute.meta)//{title: '平台属性管理'}





      // only show routes with meta.title
      let matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      }

      /**
       * item.meta.breadcrumb 这个breadcrumb 是定义路由数组中meta 新增的属性
       */
      this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false) 
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      /**
       * 设置连接跳转。 item是路由配置条目，路由配置条目中可以设置redirect属性。
       */
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
