import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let store = new Vuex.Store({

    state: {
      token: ''
    },
    mutations: {
      setToken (state, token) {
          state.token = token;
      }
    }
  });

const initStore = () => store;

export default initStore
