/** 全局路由守卫 */
import router from "@/router"
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

/** 页签标题 */
const { setTitle } = useTitle()

/** NProgress 配置 */
NProgress.configure({ showSpinner: false })

/** 路由前置守卫 */
router.beforeEach(async (to, _from, next) => {
  // 开启进度条
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  const token = getToken()

  // 1. 没有登录
  if (!token) {
    // 如果在免登录的白名单中，则直接进入
    if (isWhiteList(to)) return next()
    // 其他没有访问权限的页面将被重定向到登录页面
    return next("/login")
  }

  // 2. 已经登录，并准备进入 Login 页面，则重定向到主页
  if (to.path === "/login") {
    return next({ path: "/" })
  }

  // 3. 已经登录，用户已经获得其权限角色，放行
  if (userStore.roles.length !== 0) return next()

  // 4. 已经登录，无权限角色，则重新获取权限角色，添加动态路由
  try {
    await userStore.getInfo()
    // 注意：角色必须是一个数组！ 例如: ["admin"] 或 ["developer", "editor"]
    const roles = userStore.roles
    // 生成可访问的 Routes
    routeSettings.dynamic ? permissionStore.setRoutes(roles) : permissionStore.setAllRoutes()
    // 将 "有访问权限的动态路由" 添加到 Router 中（路由器中初始化包含所有常量路由）
    permissionStore.addRoutes.forEach((route) => router.addRoute(route))
    // 确保添加路由已完成
    // 设置 replace: true, 因此导航将不会留下历史记录
    next({ ...to, replace: true })
  } catch (err: any) {
    // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
    userStore.resetToken()
    ElMessage.error(err.message || "路由守卫过程发生错误")
    next("/login")
  }
})

/** 路由后置守卫 */
router.afterEach((to) => {
  // 触发路由变化事件，缓存最新的路由信息
  setRouteChange(to)
  // 设置页签标题
  setTitle(to.meta.title)
  // 关闭进度条
  NProgress.done()
})
