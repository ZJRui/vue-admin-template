import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  /**
   * 
   * 正常地址： http://localhost:9528/
   * 如果我们恶意访问一个不存在的地址 http://localhost:9528/ppp
   * 那么 就会变成： http://localhost:9528/pppp#/login?redirect=%2Fdashboard
   * 
   * 首先  http://localhost:9528/ppp 会被当作  http://localhost:9528/ppp#/
   * 也就是访问 /， 根据路由规则配置 /会被重定向到 /dashboard
   * 
   * 然后路由发生变化前执行这里的 beforeEach， from是/  to是/dashboard
   * 
   * beforeEach的函数中 判断没有 token，且to的路径中不包含/login 因此
   * 执行  next(`/login?redirect=${to.path}`) 重定向到 /login
   * 
   * 真正重定向之前 又会再次执行beforeEach， from是/  to是/login?redirect=xx
   * 本地没有token，且to的url中包含了login，因此next放行 。又因为 路由/login 指定了login.vue渲染，
   * 因此展示了登录页面。 此时地址栏的地址就是  http://localhost:9528/pppp#/login?redirect=%2Fdashboard
   * 
   * 
   */
  console.log("beforeEach" )
  console.log(to)
  console.log(from)
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          await store.dispatch('user/getInfo')
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
