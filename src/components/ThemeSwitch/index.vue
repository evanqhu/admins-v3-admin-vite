<!-- 主题切换功能 -->
<script lang="ts" setup>
import { type ThemeName, useTheme } from "@/hooks/useTheme"
import { MagicStick } from "@element-plus/icons-vue"

const { themeList, activeThemeName, setTheme } = useTheme()

// 处理主题切换，并添加动画效果
const handleChangeTheme = ({ clientX, clientY }: MouseEvent, themeName: ThemeName) => {
  // 计算从点击位置扩展的最大半径，用于制作水波扩散的效果
  const maxRadius = Math.hypot(
    Math.max(clientX, window.innerWidth - clientX),
    Math.max(clientY, window.innerHeight - clientY)
  )
  // 动态设置自定义的CSS变量
  const style = document.documentElement.style
  style.setProperty("--v3-theme-x", clientX + "px")
  style.setProperty("--v3-theme-y", clientY + "px")
  style.setProperty("--v3-theme-r", maxRadius + "px")
  const handler = () => {
    setTheme(themeName)
  }
  document.startViewTransition ? document.startViewTransition(handler) : handler()
}
</script>

<template>
  <el-dropdown trigger="click">
    <div>
      <!-- 提示信息 -->
      <el-tooltip effect="dark" content="主题模式" placement="bottom">
        <el-icon :size="20">
          <MagicStick />
        </el-icon>
      </el-tooltip>
    </div>
    <!-- 下拉菜单的内容 -->
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="(theme, index) in themeList"
          :key="index"
          :disabled="activeThemeName === theme.name"
          @click="
            (e: MouseEvent) => {
              handleChangeTheme(e, theme.name)
            }
          "
        >
          <span>{{ theme.title }}</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
