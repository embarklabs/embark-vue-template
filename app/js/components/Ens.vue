<template>
	<div id="ens" class="options-div">
		<div style="text-align:center">
			<div class="title">
				<strong>{{msg}}</strong>
			</div>
			<div class="error-message" v-if="!isEnabled">
				ENS is not enabled
          	</div>
			<div class="error-message" v-if="globalError">{{globalError}}</div>
		</div>
		
        <h2>Resolve a name</h2>
        <v-form class='form' v-model="valid_form_1" v-on:submit.prevent="resolveName($event)">
        	<div v-if="responseResolve" :class="isResolveError ? 'error-message' : 'success-message'">
        		Resolved address: <span>{{responseResolve}}</span>	
        	</div>

            <v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="valueResolve"
			        	:rules="requiredRules"
			        	required
			        	label="Name">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_1"
						color="blue"
						class="white--text"
						light
						@click="resolveName"
						>Resolve name
					</v-btn>
				</v-flex>
			</v-layout>
        </v-form>

        <h2>Lookup an address</h2>
        <v-form class='form' v-model="valid_form_2" v-on:submit.prevent="lookupAddress($event)">
        	<div v-if="responseLookup" :class="isLookupError ? 'error-message' : 'success-message'">
        		Looked up domain: <span>{{responseLookup}}</span>
        	</div>

        	<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="valueLookup"
			        	:rules="requiredRules"
			        	required
			        	label="Lookup Address">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_2"
						color="blue"
						class="white--text"
						light
						@click="lookupAddress"
						>Lookup address
					</v-btn>
				</v-flex>
			</v-layout>
        </v-form>

        <h2>Register subdomain</h2>
        <v-form class='form' v-model="valid_form_3" v-on:submit.prevent="registerSubDomain($event)">
        	<div v-if="responseRegister" :class="isRegisterError ? 'error-message' : 'success-message'">
        		<span>{{responseRegister}}</span>
        	</div>

        	<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="valueRegister"
			        	:rules="requiredRules"
			        	required
			        	label="Subdomain"
			        	style="margin-right: 15px">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
			        <v-text-field
			        	v-model="addressRegister"
			        	:rules="requiredRules"
			        	required
			        	label="Domain Address">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_3"
						color="blue"
						class="white--text"
						light
						@click="registerSubDomain"
						>Register subdomain
					</v-btn>
				</v-flex>
			</v-layout>
        </v-form>

        <h2>Embark Calls </h2>
        <p>Javascript calls being made: </p>
        <div class="logs" v-if="logs.length > 0">
        	<p v-for="log in logs">
	    		{{log}}
	    	</p>
        </div>
	</div>
</template>

<script>
import EmbarkJS from 'Embark/EmbarkJS';

export default {
  name: 'ENSDemo',
  mounted: function () {
	    this.$nextTick(() => {
			EmbarkJS.onReady((err) => {
		    	this.globalError = !web3.eth.defaultAccount ? 'There is currently no default account. If Metamask is active, please sign in or deactivate it.':null
				this.addressRegister = web3.eth.defaultAccount
				this.valueLookup = web3.eth.defaultAccount
			})
	  	})
  },
  computed: {
  	isEnabled() {
  		return this.$store.state.ensEnabled
  	}
  },
  data () {
    return {
		msg: 'ENS Demo',
		valid_form_1: false,
    	valid_form_2: false,
    	valid_form_3: false,
		globalError: null,
		valueResolve: 'eth',
		responseResolve: null,
		isResolveError: false,
		
		valueLookup: '',
		responseLookup: null,
		isLookupError: false,
		
		valueRegister: '',
		addressRegister: '',
		responseRegister: null,
		isRegisterError: false,
		
     	logs: [],
		requiredRules: [
    	  	v => !!v || 'Required',
	    ]
    }
  },
  methods: {
  	resolveName(e) {

	    this._addToLog(`EmbarkJS.Names.resolve('${this.valueResolve}', console.log)`)

	    EmbarkJS.Names.resolve(this.valueResolve, (err, result) => {
			this.responseResolve = err ? err.message || err : result
			this.isResolveError = !!err
	    })
  	},

  	lookupAddress(e) {

	    this._addToLog(`EmbarkJS.Names.resolve('${this.valueLookup}', console.log)`)

	    EmbarkJS.Names.lookup(this.valueLookup, (err, result) => {
	    	this.responseLookup = err ? err.message || err : result
	    	this.isLookupError = !!err
	    })

  	},

  	registerSubDomain(e) {

	    this._addToLog(`EmbarkJS.Names.registerSubDomain('${this.valueRegister}', '${this.addressRegister}', console.log)`)

	    EmbarkJS.Names.registerSubDomain(this.valueRegister, this.addressRegister, (err, transaction) => {
	     	const message = err ? err : `Successfully registered "${this.valueRegister}" with ${transaction.gasUsed} gas`
	     	this.responseRegister = message
	     	this.isRegisterError = !!err
	    });

  	},

  	_addToLog(txt) {
  		this.logs.push(txt)
  	}

  }
}
</script>