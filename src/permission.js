import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/login'
import { filterAsyncRouter } from './store/modules/permission'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

/** 导航守卫
 * to: 即将进入的路由对象
 * from: 正在离开的路由对象
 * next: 执行下一步，要保证被调用
 */
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) {    // 判断是否有token
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => {    // 拉取user_info
          buildMenus().then(res => {
            console.log(res);
            /** detail: Array(3) 数组中是字典：
             * {id: 1, name: "系统管理", path: "/system", redirect: "noredirect", component: "Layout",
             *  alwaysShow: true, sort:0, pid:null, meta:{title: "系统管理", icon: "system"},
             *  children: [{id: 2, name: "用户管理", path: "users", component: "system/user/index", meta: {title: "用户管理", icon: "user"},
             *  pid: 1, sort: 11}, {...}, {...}]}
             */
            // 遍历后台传来的路由字符串，转换为组件对象
            const asyncRouter = filterAsyncRouter(res.detail)
            asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
            store.dispatch('GenerateRoutes', asyncRouter).then(() => {   // 存储可访问路由表
              router.addRoutes(asyncRouter)         // 动态添加可访问路由表
              // next(to.path);
              next({ ...to, replace: true })    // hack方法 确保addRoutes已完成
            })
          })
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else {
        next()    //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
});

router.afterEach(() => {
  NProgress.done()    // finish progress bar
});
