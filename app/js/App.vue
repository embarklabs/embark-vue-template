<template>
  <div id="app">
    <div>
    <v-tabs 
      v-model="active"
      slider-color="#73B784"
    >
      <v-tab
        v-for="item in options"
        :key="item.id"
        :to="item.to"
        router>
        {{item.label}}
        <span v-if="item.id > 0" :class="getStatusClass(item.service)"></span>
      </v-tab>
    </v-tabs>
    </div>
    <div class="error-message" v-if="hasErrors">
      <div>
        Something went wrong connecting to Ethereum. Please make sure you have a node running or are using metamask to connect to the ethereum network:
      </div>
      <div>
        {{getError}}
      </div>
    </div>
    
    <v-layout row wrap>
      <v-flex lg-12>
        <div style="text-align:center">
          <img src="./assets/embark.png" height="200px">
          <img src="./assets/logo.png">
        </div>
      </v-flex>
    </v-layout>

    <router-view/>
  </div>
</template>

<script>
import EmbarkJS from 'Embark/EmbarkJS'

export default {
  name: 'App',
  computed: {
    hasErrors () {
      return !!this.$store.state.error
    },

    getError () {
      return this.$store.state.error
    },

  },
  mounted: function () {
    this.$nextTick(() => {
      EmbarkJS.onReady((err) => {
        this.$store.commit('blockchainEnabled', true)
        if (err) {
          // If err is not null then it means something went wrong connecting to ethereum
          // you can use this to ask the user to enable metamask for e.g
          return this.$store.commit('setError', err.message || err)
        }

        EmbarkJS.Messages.Providers.whisper.getWhisperVersion((err, _version) => {
          if (err) {
            return console.log(err);
          }
          this.$store.commit('whisperEnabled', true)
        });

        EmbarkJS.Storage.isAvailable().then((result) => {
          this.$store.commit('storageEnabled', result)
        }).catch(() => {
          this.$store.commit('storageEnabled', false)
        })

        const watcher = setInterval(() => {
          console.log('waiting for ENS resolver to initialize')
          const ensEnabled = EmbarkJS.Names.currentNameSystems && EmbarkJS.Names.isAvailable()
          if(ensEnabled) {
            this.$store.commit('ensEnabled', (EmbarkJS.Names.currentNameSystems 
            && EmbarkJS.Names.isAvailable()))
            clearInterval(watcher)    
          }

        }, 3000)

        this.$store.commit('setError', null)
      })
    })

  },
  data () {
    return {
      options: [
        {
          id: 0,
          label: 'Home',
          to: '/'
        },
        {
          id: 1,
          label: 'Blockchain',
          to: '/blockchain',
          service: 'blockchain'
        },
        {
          id: 2,
          label: 'Decentralized Storage',
          to: '/ipfs',
          service: 'storage'
        },
        {
          id: 3,
          label: 'P2P communication (Whisper)',
          to: '/whisper',
          service: 'whisper'
        },
        {
          id: 4,
          label: 'Naming (ENS)',
          to: '/ens',
          service: 'ens'
        },

      ],
      active: null,
    }
  },
  methods: {
    getStatusClass(service) {
      return 'status pull-right ' + (this.$store.state[service + 'Enabled'] ? 'online':'offline')
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.options-div {
  margin: 10px 50px 10px 50px;
  text-align: left;

}

.logs {
  background-color: black;
  font-size: 14px;
  color: white;
  font-weight: bold;
  padding: 10px;
  border-radius: 8px;
}

h2 {
  margin-top: 30px;
}

.title {
  font-size: 24px;
}

.form {
  margin-right: 50%;
  margin-left: 15px;
}

.error-message {
  color: red;
  border: solid 1px white;
  margin: 20px 20px;
  border-radius: 5px;
  padding: 10;
  background-color: #FBEFEF;
}

.success-message {
  color: black;
  border: solid 1px white;
  margin: 20px 20px;
  border-radius: 5px;
  padding: 10;
  background-color: #E3F0D8;
}

.status {
  vertical-align: middle;
  margin-left: 5px;
  width: 12px;
  height: 12px;
  -moz-border-radius: 10px;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

.online {
  background: mediumseagreen;
}

.offline {
  background: red;
}

.pull-right {
  float: right!important;
}
</style>
