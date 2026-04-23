import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import pinia from './stores'
import '@/assets/main.scss'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import PageContainer  from "@/components/PageContainer.vue";

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.component('PageContainer',PageContainer)
app.mount('#app')
