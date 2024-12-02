/** 路由导航守卫 */
import { router } from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { setRouteChange } from "@/hooks/useRouteListener"
import { useTitle } from "@/hooks/useTitle"
import { getToken } from "@/utils/cache/cookies"
import routeSettings from "@/config/route"
import isWhiteList from "@/config/white-list"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

// 配置 NProgress
NProgress.configure({ showSpinner: false })
const { setTitle } = useTitle()
const userStore = useUserStoreHook()
const permissionStore = usePermissionStoreHook()

// 前置路由导航守卫
router.beforeEach(async (to, _from, next) => {
  NProgress.start() // 开始进度条
  // 如果没有登录
  if (!getToken()) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to)) return next()
    // 其他没有访问权限的页面将被重定向到登录页面
    return next("/login")
  }

  // 如果已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  // 如果用户已经获得其权限角色，则直接进入
  if (userStore.roles.length !== 0) return next()

  // 否则要重新获取权限角色
  try {
    await userStore.getInfo()
    // 注意：角色必须是一个数组！ 例如: ["admin"] 或 ["developer", "editor"]
    const roles = userStore.roles
    // 根据用户角色生成可访问的 Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // 将 "有访问权限的动态路由" 添加到 Router 中
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true })
  } catch (error) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error((error as Error).message || "路由守卫过程发生错误")
    next("/login")
  }
})

// 路由导航完成后的钩子
router.afterEach((to) => {
  // 设置路由变化
  setRouteChange(to)
  // 设置页面标题
  setTitle(to.meta.title)
  // 结束进度条
  NProgress.done()
})
