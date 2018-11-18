<template>
	<div id="blockchain" class="options-div">
		<div style="text-align: center" class="title">
			<strong>{{msg}}</strong>
		</div>
		<h2> 1. Set the value in the blockchain</h2>
	    <v-form class='form' v-model="valid" v-on:submit.prevent="setValue($event)">
	    	<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="valueSet"
			        	:rules="numberRules"
			        	required>
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid"
						color="blue"
						class="white--text"
						light
						@click="setValue"
						>Set Value
					</v-btn>
				</v-flex>
			</v-layout>
	    </v-form>
	   	<div>Once you set the value, the transaction will need to be mined and then the value will be updated on the blockchain.</div>

	    <h2> 2. Get the current value</h2>
	    <v-form>
        	<div>Current value is: <span class="value">{{valueGet}}</span></div>
	        <v-btn color="blue" class="white--text" @click="getValue">Get Value</v-btn>
	        <div>Click the button to get the current value. The initial value is 100.</div>
	    </v-form>

	    <h2> 3. Contract Calls </h2>
	    <p>Javascript calls being made: </p>
	    <div class="logs" v-if="logs.length > 0">
	    	<p v-for="log in logs">
	    		{{log}}
	    	</p>
	    </div>
	</div>
</template>

<script>
import SimpleStorage from 'Embark/contracts/SimpleStorage'

export default {
  name: 'BlockchainDemo',
  data: () => ({
      msg: 'Smart contract demo',
      valid: false,
      valueSet: 100,
      valueGet: "",
      logs: [],

      numberRules: [
        v => !!v || 'Required',
        v => /[0-9]+/.test(v) || 'Numbers only'
      ]
    }),

  methods: {

  	setValue(e) {
  		const value = parseInt(this.valueSet, 10)
  		SimpleStorage.methods.set(value).send()
  		this._addToLog(`SimpleStorage.methods.set(${value}).send()`)
  	},

  	getValue(e) {
  		SimpleStorage.methods.get().call().then(_value => this.valueGet = _value)
    	this._addToLog("SimpleStorage.methods.get(console.log)");
  	},

  	_addToLog(txt) {
  		this.logs.push(txt)

  	}
  }
}
</script>

<style scoped>

.value {
	font-weight: 600;
}

div { 
	margin: 5px;
}
</style>