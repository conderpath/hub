/**++----------------------------------------------------------------------------------------------------------------------------------------------------------------------
1.功能：Vuex 通用
2.作者：Object
-----------------------------------------------------------------------------------------------------------------------------------------------------------------------++*/

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store =  new Vuex.Store({
  state: {
    count:0
  },
  mutations: {
    COUNT(state,num){
      state.count = num
    }
  },
  actions: {
    addCount({commit, state}){
      let count = state.count +1
      console.log('dsadad',count)
      commit('COUNT',count)
    },
    importExternalJs ({commit, state},url) {
     return new Promise((resolve, reject)=>{
       let jsLink = document.createElement('script')
       jsLink.src = url
       window.document.head.appendChild(jsLink)
       jsLink.onload = jsLink.onreadystatechange = function() {
         if (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete') {
           resolve()
         }
         jsLink.onload = jsLink.onreadystatechange = null;
       }
      })
    }
  },
  getters:{
      getCount:state => state.count
  }
})
