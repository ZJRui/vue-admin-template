import Cookies from "js-cookie";

function getInitOpened() {
  console.log("sidebarStatus-getInitOpened函数执行");
  let opened = Cookies.get("sidebarStatus");
  console.log("sidebarStatus", opened);
  let tmpOpened = Cookies.get("sidebarStatus")
    ? !!+Cookies.get("sidebarStatus")
    : true;
  console.log("!!+sidebarStatus", tmpOpened);
  //如果没有值 则返回true ，表示默认是打开的
  if (opened === 0) {
    return false;
  }
  if (opened === 1) {
    return true;
  }
  return true;
  //如果 是1 则表示opened，则返回true
  //如果是0，则表示closed 返回false
}

const state = {
  sidebar: {
    /**
     * !!a 表示 先计算（！a）然后再计算 !(!a)
     * !!+a 表示先计算 +a,然后 计算 !(+a) 再计算!(!(+a))
     * +a表示 将a转为数字
     *
     */
    // opened: Cookies.get("sidebarStatus")
    //   ? !!+Cookies.get("sidebarStatus")
    //   : true,
    opened: getInitOpened(),
    withoutAnimation: false,
  },
  device: "desktop",
};

const mutations = {
  TOGGLE_SIDEBAR: (state) => {
    state.sidebar.opened = !state.sidebar.opened;
    state.sidebar.withoutAnimation = false;
    if (state.sidebar.opened) {
      Cookies.set("sidebarStatus", 1);
    } else {
      Cookies.set("sidebarStatus", 0);
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set("sidebarStatus", 0);
    state.sidebar.opened = false;
    state.sidebar.withoutAnimation = withoutAnimation;
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device;
  },
};

const actions = {
  /**
   * 1.action函数接收一个与store实例具有相同方法和属性的context对象，因此我们可以调用context.commit 提交一个mutation
   *
   * 2.{commit} 结构 context对象中的commit属性
   *
   * 3. 因为我们 下面export的时候 开启了命名空间属性 namespaced: true。 当前的
   * 局部状态通过 context.state 暴露出来。 根节点状态则为 context.rootState
   * 
   * @param {*} context
   */
  testAction(context) {
    context.commit("TEST_ACTION");
  },
  toggleSideBar({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit("CLOSE_SIDEBAR", withoutAnimation);
  },
  toggleDevice({ commit }, device) {
    commit("TOGGLE_DEVICE", device);
  },
};

export default {
  // 注意 这里配置了namespace=true， 这就导致每一个模块的actions mutations等属性之间是相互隔离的
  // https://vuex.vuejs.org/zh/guide/modules.html#%E5%91%BD%E5%90%8D%E7%A9%BA%E9%97%B4
  namespaced: true,
  state,
  mutations,
  actions,
};
