import Vue from 'vue'
import Router from 'vue-router'
import comps from '../components/'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: comps.HelloWorld
    },
    {
      path: '/blockchain',
      name: 'BlockchainDemo',
      component: comps.Blockchain
    },
    {
      path: '/ipfs',
      name: 'IPFSDemo',
      component: comps.Storage
    },
    {
      path: '/whisper',
      name: 'WhisperDemo',
      component: comps.Whisper
    },
    {
      path: '/ens',
      name: 'ENSDemo',
      component: comps.Ens
    },
  ]
})
