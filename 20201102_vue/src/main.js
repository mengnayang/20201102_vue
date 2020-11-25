// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//引入全局样式
import './assets/css/global.css'
//引入全局element组件
import './plugins/element.js'
//引入axios并挂载
import axios from 'axios'
axios.defaults.baseURL='http://localhost:8080';
Vue.prototype.$axios = axios
//引入mockjs
import '../mock/mock.js'

import qs from 'qs'
Vue.prototype.$qs = qs

Vue.config.productionTip = false


// //添加请求拦截器
// axios.interceptors.request.use(function (config) {
//   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//   if(config.method === 'post') { // post请求时，处理数据
//       config.data = qs.stringify( {
//           ...config.data //后台数据接收这块需要以表单形式提交数据，而axios中post默认的提交是json数据,所以这里选用qs模块来处理数据，也有其他处理方式，但个人觉得这个方式最简单好用
//       })
//   } 
//   return config;
// }, function (error) {
//   loadinginstace.close()
//   return Promise.reject(error);
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
