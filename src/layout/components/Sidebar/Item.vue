<script>
export default {
  name: "MenuItem",
  /**
   * 1.functional 为true 是vue2的函数式组件写法
   * 
   * 2.之前创建的锚点标题组件是比较简单，没有管理任何状态，也没有监听任何传递给它的状态，也没 有生命周期方法。实际上，它只是一个接受一些  prop  的函数。在这样的场景下，我们可以将组件标 记为  ，这意味它无状态  (没有 响应式数据 )，也没有实例  (没有  上下文)。一个 函  functional  this 数式组件 就像这样： 
   * render:function(h,context){ }
   * 
   */
  functional: true,
  props: {
    icon: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
  render(h, context) {
    // 在添加functional:true 之后，需要更新我们的render渲染函数，为其增加context参数。
    //也就是说 一版情况下 render(h){} 一个参数就可以了
    console.log("context",context)// FunctionalRenderContext
    // render 函数中的this是当前的vue组件
    //该渲染函数接收一个 createElement (h函数 )方法作为第一个参数用来创建 Vnode 。  createElement  VN
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      if (icon.includes("el-icon")) { //如果路由配置项的meta的icon中 配置的式el-icon 开头则表示 使用的是 elementui的样式。 不然的化就表示菜单的图标是本地项目 icons/svg 文件夹下的样式
        // 这个地方为什么 push的参数 没有使用 引号引起来，而是直接书写 html标签？ 这是
        //因为有Babel插件， 用于在vue中使用jsx语法，他可以让我们回到更接近于模板的语法上
        //render函数的返回值必须要是VNode， 如果我们不使用jsx语法，那么就需要使用h('div' ) 来创建VNode，在使用了jsx的情况下 可以直接将 html标签作为返回值 返回。  插件 会将 这个标签转为vnode
        vnodes.push(<i class={[icon, "sub-el-icon"]} />);
      } else {
        /**
         * 因为 全局注册了 Vue.component("svg-icon", SvgIcon);
         * 所以这里可以使用
         */
        vnodes.push(<svg-icon icon-class={icon} />);
      }
    }

    if (title) {
      /**
       * 注意这里的 slot=‘title’
       * span 标签并没有slot属性， slot属性 其实是指定 span标签对应的 具名slot
       * 
       * 
       * 那么问题就是 <slot name='title'></stlo> 在哪里定义的. 这个是 element ui 中的el-menu 中定义的，比如   https://element.eleme.io/#/zh-CN/component/menu 
       * 
       * 在elementui中 
       * <el-menu-item index="3" disabled>
       * <i class="el-icon-document"></i>
       * <span slot="title">导航三</span>
       * </el-menu-item>
       * 
       *item组件用来替换el-menu-item 标签中的内容。因为在SlidebarItem 组件中 的写法就是
        <el-men-item><item></item></el-men-item>
        item组件中有两部分内容，一个是上面 if(icon) 插入一个 i或者svg-icon标签，这部分会被放置到到
        el-menu-item 的默认插槽中。 另一部分就是下面的span 会被放置到 el-menu-item 的title slot中
       * 
       */
      vnodes.push(<span slot="title">{title}</span>);
    }
    console.log("vnodes", vnodes);
    return vnodes;
  },
};
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
