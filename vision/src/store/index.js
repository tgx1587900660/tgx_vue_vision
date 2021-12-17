import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const vuex = new Vuex.Store({
    state: {
        theme: 'chalk'
    },
    mutations: {
        changeTheme(state) {
            if (state.theme === 'chalk') {
                state.theme = 'vintage'
            } else {
                state.theme = 'chalk'
            }
        }
    },
    actions: {},
    modules: {}
})

export default vuex
