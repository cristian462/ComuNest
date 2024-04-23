import { createStore } from 'vuex'

export default createStore({
  state: {
    user: {
      id: 0,
      nombre: "",
      nivel: 0
    }
  },
  getters: {
    destroy(state){
      state.user = {
        id: 0,
        nombre: "",
        nivel: 0
      }
    }
  },
  mutations: {
     setUser(state, usuario){
      state.user = usuario;
    }
  },
  actions: {
  },
  modules: {
  }
})
