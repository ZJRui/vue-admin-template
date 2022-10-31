<template>
  <!--isExternal 为true表示外部连接， 使用 style样式 表示 -->
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$listeners"
  />
  <!---
  以使用v-bind="$attrs"：传递所有属性、v-on="$listeners"传递所有方法
  -->
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <!---
     参考： https://blog.csdn.net/weixin_41615439/article/details/104497492
     <use xlink:href="#C" x="0" y="0"/>
     vue.config.js中配置了svg-sprite-loader 插件会将 require到的svg文件变为 
     样式名称 比如 dashboard.svg 变成#icon-dashboard ，因此我们可以使用样式名引用svg文件
    -->
    <use :xlink:href="iconName" />
  </svg>
</template>

<script>
// doc: https://panjiachen.github.io/vue-element-admin-site/feature/component/svg-icon.html#usage
import { isExternal } from "@/utils/validate";

/**
 * className:""
iconClass:"dashboard"
iconName:"#icon-dashboard"
isExternal:false
styleExternalIcon:Object
-webkit-mask:"url(dashboard) no-repeat 50% 50%"
mask:"url(dashboard) no-repeat 50% 50%"
svgClass:"svg-icon"
 */
export default {
  name: "SvgIcon",
  props: {
    iconClass: {
      type: String,
      required: true,
      describe:"MenuItem 组件的render函数中将 MenUItem的icons属性传递过来，MenuItem的icon属性 来自 route.meta.icon"
    },
    className: {
      type: String,
      default: "",
    },
  },
  computed: {
    isExternal() {
      return isExternal(this.iconClass);
    },
    iconName() {
      return `#icon-${this.iconClass}`;//"#icon-table" "#icon-dashboard" "#icon-link"
    },
    svgClass() {
      /**
       * "当前组件只在 menuItem的render中使用，render中并没有设置className"
       * 因此 className=''
       */
      if (this.className) {
        return "svg-icon " + this.className;
      } else {
        return "svg-icon";
      }
    },
    styleExternalIcon() {
      return {
        // CSS 属性 mask 允许使用者通过遮罩或者裁切特定区域的图片的方式来隐藏一个元素的部分或者全部可见区域。
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        "-webkit-mask": `url(${this.iconClass}) no-repeat 50% 50%`,
      };
    },
  },
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
