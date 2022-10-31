<template>
  <!---
   <component> 标签是动态组件， 多个组件使用同一个挂载点，然后再他们之间切换，动态绑定到他的is属性可以指定组件的类型
    2. v-bind 没有指定属性名， 当不带参数使用时，可以用于绑定一个包含了多个 attribute 名称-绑定值对的对象。 也就是将 linkProps(to)的返回值对象 中的key-value键值对绑定到组件对应的属性上。 组件的属性可以是dom的属性，也可以是组件的响应式属性
    3.当 is 是字符串，它既可以是 HTML 标签名也可以是组件的注册名。
    4. 为什么这里要加  v-bind="linkProps(to)" 这是因为 当前的组件是一个动态组件， 当is 绑定的type是router-link的时候 那么当前的<component ></component>就会渲染成
    router-link ，然后 router-link 组件必须要设置to属性。 因此我们使用v-bind  将linkProps方法返回的对象的属性绑定到 router-link组件的属性上。
  -->
  <component :is="type" v-bind="linkProps(to)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from "@/utils/validate";

export default {
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.to);
    },
    type() {
      /**
       * 如果是外部链接 就使用a标签
       *
       * 问题： 动态组件中的is 属性 指定的是使用哪个组件，也就是组件的名称，这里返回 a，那么
       * 这个a是什么组件？ 还是说a 会被认为是a标签？
       * component 标签会被渲染成 a标签，然后再a标签 中放置一个 <slot>
       *
       *
       */
      if (this.isExternal) {
        return "a";
      }
      /**
       *如果是内部链接就使用router-link
       *
       * 这个地方有一个注意事项：  我们这里的动态组件内部使用了 <slot></slot>
       * 然后再sidebarItem中 使用当前组件的方式是
       * <app-link>
       * <el-menu-item></el-menu-item>
       * </app-link>
       *
       * 因此 el-menu-item会被放置到 插槽的地方。
       * 如果动态组件是a 那么就展示
       * <a>
       * <el-menu-item></el-menu-item>
       * </a>
       * 
       * 如果动态组件是 router-link 
       * <router-link>
       * <el-menu-item></el-menu-item>
       * </router-link>
       * 
       * 而router-link 这个内置组件 本身支持 在 <router-link>标签之内放置内容，因此el-menu-item能够被渲染出来。 
       * 但是有些 组件 本身不支持在标签中放置内容，因此就无法渲染中间slot插入的 el-menu-item
       * 
       *
       */
      return "router-link";
    },
  },
  methods: {
    /**
     * 再SidebarItem vue 组件中  使用AppLink组件， 会将路由项的path属性
     * resolvePath(path) 之后绑定到当前组件的to属性上。
     *
     *
     * @param {*} to
     */
    linkProps(to) {
      if (this.isExternal) {
        //a 标签需要的属性， 通过v-bind 指令透传到动态组件内部
        return {
          href: to,
          target: "_blank",
          rel: "noopener",
        };
      }
      return {
        // router-link 组件的to属性
        to: to,
      };
    },
  },
  created(){
    console.log("AppLink created",this.$attrs)
  }
};
</script>
