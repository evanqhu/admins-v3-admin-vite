<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from "vue-router"
import { useAppStore } from "@/store/modules/app"
import { usePermissionStore } from "@/store/modules/permission"
import { useSettingsStore } from "@/store/modules/settings"
import SidebarItem from "./SidebarItem.vue"
import Logo from "../Logo/index.vue"
import { useDevice } from "@/hooks/useDevice"
import { useLayoutMode } from "@/hooks/useLayoutMode"
import { getCssVariableValue } from "@/utils"

// 获取自定义的 CSS 变量，用来设置侧边栏菜单的背景颜色、文字颜色和激活项的文字颜色
const v3SidebarMenuBgColor = getCssVariableValue("--v3-sidebar-menu-bg-color")
const v3SidebarMenuTextColor = getCssVariableValue("--v3-sidebar-menu-text-color")
const v3SidebarMenuActiveTextColor = getCssVariableValue("--v3-sidebar-menu-active-text-color")

const { isMobile } = useDevice()
const { isLeft, isTop } = useLayoutMode()
const route = useRoute()
const appStore = useAppStore()
const permissionStore = usePermissionStore()
const settingsStore = useSettingsStore()

// 优先取 route.meta.activeMenu，如果没有定义，则使用当前路由路径 route.path
const activeMenu = computed(() => {
  const {
    meta: { activeMenu },
    path
  } = route
  return activeMenu ? activeMenu : path
})
// 保留那些没有被标记为 meta.hidden: true 的路由
const noHiddenRoutes = computed(() => permissionStore.routes.filter((item) => !item.meta?.hidden))
// 若侧边栏未打开则返回 true
const isCollapse = computed(() => !appStore.sidebar.opened)
// 只有在左侧布局且 showLogo 为 true 时才显示 logo
const isLogo = computed(() => isLeft.value && settingsStore.showLogo)
// 是否为左侧模式决定是否应用 CSS 变量定义的颜色
const backgroundColor = computed(() => (isLeft.value ? v3SidebarMenuBgColor : undefined))
const textColor = computed(() => (isLeft.value ? v3SidebarMenuTextColor : undefined))
const activeTextColor = computed(() => (isLeft.value ? v3SidebarMenuActiveTextColor : undefined))
// 根据布局模式（顶部模式或左侧模式）返回不同的菜单项高度
const sidebarMenuItemHeight = computed(() => {
  return !isTop.value ? "var(--v3-sidebar-menu-item-height)" : "var(--v3-navigationbar-height)"
})
const sidebarMenuHoverBgColor = computed(() => {
  return !isTop.value ? "var(--v3-sidebar-menu-hover-bg-color)" : "transparent"
})
// 决定菜单项的底部提示线宽度
const tipLineWidth = computed(() => {
  return !isTop.value ? "2px" : "0px"
})
// 当为顶部模式时，隐藏侧边栏的垂直滚动条
const hiddenScrollbarVerticalBar = computed(() => {
  return isTop.value ? "none" : "block"
})
</script>

<template>
  <!-- 根据 isLogo 的值动态地添加或移除类名 has-logo -->
  <div :class="{ 'has-logo': isLogo }">
    <Logo v-if="isLogo" :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse && !isTop"
        :background-color="backgroundColor"
        :text-color="textColor"
        :active-text-color="activeTextColor"
        :unique-opened="true"
        :collapse-transition="true"
        :mode="isTop && !isMobile ? 'horizontal' : 'vertical'"
      >
        <SidebarItem v-for="route in noHiddenRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
// 占位符选择器
%tip-line {
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: v-bind(tipLineWidth);
    height: 100%;
    background-color: var(--v3-sidebar-menu-tip-line-bg-color);
  }
}

.has-logo {
  .el-scrollbar {
    // 多 1% 是为了在左侧模式时侧边栏最底部不显示 1px 左右的白色线条
    height: calc(101% - var(--v3-header-height));
  }
}

.el-scrollbar {
  // 多 1% 是为了在顶部模式时防止垂直滚动
  height: 101%;
  :deep(.scrollbar-wrapper) {
    // 限制水平宽度
    overflow-x: hidden !important;
    .el-scrollbar__view {
      height: 100%;
    }
  }
  // 滚动条
  :deep(.el-scrollbar__bar) {
    &.is-horizontal {
      // 隐藏水平滚动条
      display: none;
    }
    &.is-vertical {
      // 当为顶部模式时隐藏垂直滚动条
      display: v-bind(hiddenScrollbarVerticalBar);
    }
  }
}

.el-menu {
  border: none;
  min-height: 100%;
  width: 100% !important;
}

.el-menu--horizontal {
  height: v-bind(sidebarMenuItemHeight);
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title),
:deep(.el-sub-menu .el-menu-item),
:deep(.el-menu--horizontal .el-menu-item) {
  height: v-bind(sidebarMenuItemHeight);
  line-height: v-bind(sidebarMenuItemHeight);
  &.is-active,
  &:hover {
    background-color: v-bind(sidebarMenuHoverBgColor);
  }
}

:deep(.el-sub-menu) {
  &.is-active {
    > .el-sub-menu__title {
      color: v-bind(activeTextColor) !important;
    }
  }
}

:deep(.el-menu-item.is-active) {
  @extend %tip-line;
}

.el-menu--collapse {
  :deep(.el-sub-menu.is-active) {
    .el-sub-menu__title {
      @extend %tip-line;
    }
  }
}
</style>
