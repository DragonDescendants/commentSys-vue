import { createApp } from 'vue'
import App from './App.vue'
// 去除浏览器基本样式
import 'normalize.css'
import router from './router/index'
// 解决ElMessage样式问题
import 'element-plus/theme-chalk/src/index.scss'
import { createPinia } from 'pinia'

const app = createApp(App)
app.use(router).use(createPinia()).mount('#app')

