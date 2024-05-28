/** 统一处理 Cookie */

import CacheKey from "@/constants/cache-key"
import Cookies from "js-cookie"

/** 从 cookies 中获取 Token */
export const getToken = () => {
  return Cookies.get(CacheKey.TOKEN)
}

/** 在 cookies 中设置 Token */
export const setToken = (token: string) => {
  Cookies.set(CacheKey.TOKEN, token)
}

/** 从 cookies 中移除 Token */
export const removeToken = () => {
  Cookies.remove(CacheKey.TOKEN)
}
