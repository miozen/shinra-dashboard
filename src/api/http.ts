// api 层 · axios 实例的全局拦截器。
// 这是 api 层唯一允许依赖 store/setup 的地方:请求需要从 activeBackend 取得
// 当前连接目标(baseURL / 鉴权)。其余 api 文件不得依赖上层。
import { getUrlFromBackend } from '@/helper/utils'
import { activeBackend } from '@/store/setup'
import axios, { AxiosError } from 'axios'

axios.interceptors.request.use((config) => {
  if (activeBackend.value) {
    config.baseURL = getUrlFromBackend(activeBackend.value)
    config.headers['Authorization'] = 'Bearer ' + activeBackend.value.password
  }
  return config
})

axios.interceptors.response.use(
  null,
  (
    error: AxiosError<{
      message: string
    }>,
  ) => {
    return Promise.reject(error)
  },
)
