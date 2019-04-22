import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI, { Message, Loading } from 'element-ui'
import storage from 'good-storage'
import filter from './assets/vue_filter/filter';
import './assets/css/reset.css'
import './assets/css/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.token = storage.get('_token_');

axios.defaults.timeout = 10000
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*'

/** 请求拦截器 */
let loadinginstace = null;
axios.interceptors.request.use(
  config => {
    let token = storage.get('_token_');
    token && (config.headers.token = token);
    loadinginstace = Loading.service({
      fullscreen: true,
      background: 'rgba(0,0,0,0.4)',
      text: '加载中...'
    });
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

/** 响应拦截器 */
axios.interceptors.response.use(
  response => {
    if (response.data.code !== 200) {
      Message.error({
        message: response.data.info,
        type: 'error'
      });
      let rCode = [40002, 403];
      rCode.forEach((item, index) => {
        if (response.data.code === item) {
          /** 40002登录超时，403token错误，重新登录 */
          setTimeout(() => {
            router.replace({
              name: 'login'
            });
          }, 300);
        }
      });
    }
    loadinginstace.close();
    return Promise.resolve(response);
  },
  error => {
    /** 服务器状态码不是200的情况 */
    Message.error({
      message: '请求错误！',
      type: 'error'
    });
    loadinginstace.close();
    return Promise.reject(error.response);
  }
);

new Vue({
  router,
  store,
  render: h => h(App),
  filters: filter,
}).$mount('#app')

router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    storage.clear()
  }
  if (to.meta.requireAuth) {
    if (storage.get('_token_') !== '' && storage.get('_token_') !== null) {
      next();
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next();
  }
})
