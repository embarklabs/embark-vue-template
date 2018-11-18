import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		error: null,
		activeKey: 1,
		ensEnabled: false,
		whisperEnabled: false,
		storageEnabled: false,
		blockchainEnabled: false

	},
	mutations: {
		setError(state, error) {
			state.error = error
		},
		blockchainEnabled(state, isEnabled) {
			state.blockchainEnabled = isEnabled
		},
		storageEnabled(state, isEnabled) {
			state.storageEnabled = isEnabled
		},
		whisperEnabled(state, isEnabled) {
			state.whisperEnabled = isEnabled
		},
		ensEnabled(state, isEnabled) {
			state.ensEnabled = isEnabled
		}
	},
	actions: {

	},
	getters: {
		
	}

})