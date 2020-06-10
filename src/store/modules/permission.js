import { constantRouterMap } from '@/router'
import Layout from '@/views/layout/Layout'

// 通过用户的权限和之前在router.js里面asyncRouterMap的每一个页面所需要的权限做匹配.
// 最后返回一个该用户能够访问路由有哪些。

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {     // 提交mutation修改state
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, asyncRouter) {
      commit('SET_ROUTERS', asyncRouter)
    }
  }
}

// 遍历后台传来的路由字符串，转换为组件对象
export const filterAsyncRouter = (routers) => {
  const accessedRouters = routers.filter(router => {
    if (router.component) {
      if (router.component === 'Layout') { // Layout组件特殊处理
        router.component = Layout
      } else {
        const component = router.component
        router.component = loadView(component)
      }
    }
    if (router.children && router.children.length) {
      router.children = filterAsyncRouter(router.children)
    }
    return true
  })
  return accessedRouters
}

export const loadView = (view) => { // 路由懒加载
  return () => import(`@/views/${view}`)
}

export default permission
