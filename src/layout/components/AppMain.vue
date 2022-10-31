<template>
  <!---
  section元素表示文档或应用的一个部分。所谓“部分”，这里是指按照主题分组的内容区域，通常会带有标题。【也就是每个section对应不同的主题。注意是内容本身的主题，而不是其他人为设定的划分标准。】
  注意：section不是通用容器元素。如果仅仅是用于设置样式或脚本处理，应用div元素。一条简单的准则是，只有元素内容会被列在文档大纲中时，才适合用section元素。
  -->
  <section class="app-main">
        <!---
       问题： 为什么这个router-view  也需要绑定key？ 好像不绑定key 也没问题
       2. 我们在App.Vue 中 使用了 <router-view> 来控制 整个页面显示什么。 AppMain.vue 这里的router-view控制什么？ 
        如果 把下面的router-view注释掉 就意味着 appmain 这个组件的内容是空白。

        首先main.js文件在编译打包之后被 index.html 引入。main.js文件中创建了一个Vue对象，这个Vue对象挂载到了 id=app的div上。这个div就是index.html页面的div。 同时 在创建Vue对象时制定了render(App.vue)渲染函数，因此会加载App.vue组件。 

        在App.vue组件中使用到了 router-view 路由，因此这个时候会根据 访问的请求来决定使用哪个组件渲染。
        比如当前的地址是 http://localhost:9528/product/trademark。
        根据router.js配置的路由规则 会先匹配到 /product. 此时会使用 Layout 组件渲染。

        Layout组件中包含了 sidebar、navbar、appmain组件。
        appmain这个组件 页面 位置 展示的内容是根据路由变化的，因此 我们需要在appmain组件中使用 router-view。

        如果appmain组件中 不使用router-view，那么就意味着 appmain组件时空白。 那么Layouy组件的渲染嫩容就完了。

        因此 当发现appmain 组件中 存在router-view，此时又会进行二级路由,/trademark路由 匹配到 Trademark组件渲染， 因此 appMain组件中展示的内容就是 TradeMark。

        这就是为什么AppMain中需要使用路由router-view的原因。

        那么问题： 为什么要在 App.vue中使用 router-view呢？  因为在路由的配置项中， 对于绝大部分的一级路由 都配置了Layout组件渲染， 但是/login这个路由是由 login.vue渲染的。 所以 App.vue 中需要区分 路由 决定使用哪个组件。 如果假设所有的路由配置项中 一级路由都是Layout组件渲染，那么就可以直接在App.vue中  使用Layout组件了，不再需要使用router-view了

        3.这里的router-view和 app.vue中的router-view 共享 路由配置吗？共享路由配置，路由配置被所有的router-view共享。

        4.<router-view>不设置key
首先，vue会复用相同组件，对于路由有多个子路由来说，当在子路由来回切换时，会导致页面不刷新的问题，这是因为不再执行created和mounted这些钩子函数，可以通过watch来监听$route的变化从而加载不同的组件

      -->
      
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header+.app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
