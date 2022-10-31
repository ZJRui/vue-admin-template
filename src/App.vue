<template>
  <!--

    注意这里有个id=app， 然后在index.html 中也有一个id为app的div。 
    main.js文件最终会编译之后 被index.html 加载，然后再main.js文件中创建了一个Vue对象。
    这个Vue对象 被挂载到了 id为app的div上。这个div就是index.html页面的div，而不是这里的div。

    然后main.js中创建Vue对象时指定了渲染函数为 render(app.vue)
    因此这个时候才会加载App 这个Vue组件。

  -->
  <div id="app">
    <!--
     1.router-view会根据当前路由动态渲染不同的页面组件。
     从路由配置项中我们配置了每一个路由会使用到的Vue组件。

        2. 我们在App.Vue 中 使用了 <router-view> 来控制 整个页面显示什么。 AppMain.vue 这里的router-view控制什么？ 
        如果 把appMain.Vue文件中的router-view注释掉 就意味着 appmain 这个组件的内容是空白。

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


        从这里我们也可以看到， 在路由配置项 中每一个层级的路由 都应该对应着一个<router-view></router-view> 。 路由配置项中 最深的路由层级 就是  总共使用的 <router-view></router-view>的个数。
     
        3.app.vue 是顶层组件。 如果你访问的url 匹配不到任何路由项中的路由那么  router-view就无法渲染，因此展示的结果就是空白
    -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>
