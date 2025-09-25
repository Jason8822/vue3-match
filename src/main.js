import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

// 引入 Naive UI
import naive from 'naive-ui'

const app = createApp(App)
app.use(naive)
app.mount('#app')
