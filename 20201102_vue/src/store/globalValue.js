import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    imgBaseURL:'http://localhost:8888'
  },
  mutations: {
    //定义各种方法，一般用于axios
  }
})