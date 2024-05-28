/** 入口文件 */
// core
import { createApp } from "vue"
import App from "@/App.vue" // 根组件
import store from "@/store" // Pinia 状态管理器
import router from "@/router" // 路由器
import "@/router/permission" // 路由守卫（在 app.use(router) 之前执行）
// load
import { loadSvg } from "@/icons" // 全局注册组件 SvgIcon
import { loadPlugins } from "@/plugins" // 加载 element-plus 等插件
import { loadDirectives } from "@/directives"
// css
import "uno.css"
import "normalize.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "vxe-table/lib/style.css"
import "vxe-table-plugin-element/dist/style.css"
import "@/styles/index.scss"

const app = createApp(App)

/** 加载插件 */
loadPlugins(app)
/** 加载全局 SVG */
loadSvg(app)
/** 加载自定义指令 */
loadDirectives(app)

app.use(store).use(router)

/** 等待路由器准备完毕，挂载应用 */
router.isReady().then(() => {
  app.mount("#app")
})
