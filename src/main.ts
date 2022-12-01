import { createApp } from 'vue-termui'
import App from './App.vue'

const app = createApp(App)
app.mount()

process.on('exit', () => {
  app.unmount()
})
