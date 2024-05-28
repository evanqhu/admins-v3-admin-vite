<script lang="ts" setup>
import { useUserStore } from "@/store/modules/user"
import Admin from "./components/Admin.vue"
import Editor from "./components/Editor.vue"

const userStore = useUserStore()
const isAdmin = userStore.roles.includes("admin")
</script>

<!-- component 动态组件 -->
<template>
  <component :is="isAdmin ? Admin : Editor" />
</template>
