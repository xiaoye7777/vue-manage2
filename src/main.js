import Vue from 'vue'
import App from './App.vue'
//import { Button, Select } from 'element-ui'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import router from './router'
import store from './store'
import './api/mock'


Vue.config.productionTip = false

Vue.use(ElementUI)

new Vue({
  render: h => h(App),
  router,
  store,
  created() {
    store.commit('ADDMENU', router)
  }
}).$mount('#app')
