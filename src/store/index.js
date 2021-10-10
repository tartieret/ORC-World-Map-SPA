import Vue from 'vue'
import Vuex from 'vuex'


import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state: {
        projects: []
    },
    getters,
    actions,
    mutations,
    strict: debug,
})