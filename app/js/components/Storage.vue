<template>
	<div id="storage" class="options-div">
		<div style="text-align: center">
			<div class="title">
				<strong>{{msg}}</strong>
			</div>
			<div class="error-message" v-if="!isEnabled">
			The node you are using does not support IPFS. Please ensure <a
              href="https://github.com/ipfs/js-ipfs-api#cors" target="_blank">CORS</a> is setup for the IPFSnode.
          	</div>
          	<div class="error-message" v-if="storageError">
          		{{storageError}}
          	</div>
		</div>

      	<h2>Save text to storage</h2>
		<v-form class='form' v-model="valid_form_1" v-on:submit.prevent="setText($event)">
			<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="textToSave"
			        	:rules="requiredRules"
			        	required
			        	label="Text">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_1"
						color="blue"
						class="white--text"
						light
						@click="setText"
						>Save Text
					</v-btn>
				</v-flex>
			</v-layout>
		  	<div>generated Hash: <span>{{generatedHash}}</span></div>
		</v-form>

      	<h2>Load text from storage given a hash</h2>
      	<v-form class='form' v-model="valid_form_2" v-on:submit.prevent="loadHash($event)">

      		<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="loadText"
			        	:rules="requiredRules"
			        	required
			        	label="Hash">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_2"
						color="blue"
						class="white--text"
						light
						@click="loadHash"
						>Load
					</v-btn>
				</v-flex>
			</v-layout>
          	<div>result: <span>{{storedText}}</span></div>
      	</v-form>

      	<h2>Upload file to storage</h2>

      	<input type="file" @change="handleFileUpload">

      	<v-btn
      		:disabled="!fileToUpload"
			color="blue"
			class="white--text"
			light
			@click="uploadFile"
			>Upload
		</v-btn>
		<div>generated hash: <span>{{fileHash}}</span></div>

      	<h2>Get file or image from storage</h2>
      	<v-form  class='form' v-model="valid_form_3" v-on:submit.prevent="loadFile($event)">

      		<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="imageToDownload"
			        	:rules="requiredRules"
			        	required
			        	label="File Hash">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_3"
						color="blue"
						class="white--text"
						light
						@click="loadFile"
						>Download
					</v-btn>
				</v-flex>
			</v-layout>
			<div>file available at: <span><a :href="url" target="_blank">{{url}}</a></span></div>
          	<div><img :src="url"/></div>
        	
        	<div class="error-message" v-if="!isIPFS">The 2 functions below are only available with IPFS</div>
        </v-form>

      	<h2>Register to IPNS</h2>
		<v-form class='form' v-model="valid_form_4" v-on:submit.prevent="ipnsRegister($event)">
			<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="valueRegister"
			        	:rules="requiredRules"
			        	required
			        	label="Value to Register">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_4"
						color="blue"
						class="white--text"
						light
						@click="ipnsRegister"
						>{{registering ? 'Registering...' : 'Register'}}
					</v-btn>
				</v-flex>
			</v-layout>
			<div>It will take around 1 minute</div>
			<div :class="isRegisterError?'error-message':'success-message'" v-if="responseRegister">
				<span>Response: {{responseRegister}}</span>
			</div>
		</v-form>
		
      	<h2>Resolve name</h2>
      	<v-form class='form' v-model="valid_form_5" v-on:submit.prevent="ipnsResolve($event)">
      		<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="valueResolver"
			        	:rules="requiredRules"
			        	required
			        	label="Value to Resolve">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_5"
						color="blue"
						class="white--text"
						light
						@click="ipnsResolve"
						>{{resolving ? 'Resolving...' : 'Resolve' }}
					</v-btn>
				</v-flex>
			</v-layout>

			<div :class="isResolverError?'error-message':'success-message'" v-if="responseResolver">
				 <span>Response: {{responseResolver}}</span>	
			</div>
           
		</v-form>

      	<p>Javascript calls being made: </p>
	    <div class="logs" v-if="logs.length > 0">
	    	<!-- TODO -->
	    	<!-- <p>EmbarkJS.Storage.setProvider('ipfs',{'{'}server: 'localhost', port: '5001'{'}'})</p> -->
	    	<p v-for="log in logs">
	    		{{log}}
	    	</p>
	    </div>
	</div>

</template>

<script>
import EmbarkJS from 'Embark/EmbarkJS'

export default {
  name: 'IPFSDemo',
  computed: {
  	isEnabled() {
  		return this.$store.state.storageEnabled
  	}
  },
  data () {
    return {
      msg: 'IPFS Demo',
      valid_form_1: false,
      valid_form_2: false,
      valid_form_3: false,
      valid_form_4: false,
      valid_form_5: false,
      
      textToSave: 'hello world!',
      generatedHash: '',
      loadText: '',
      storedText: '',
      
      fileToUpload: null,
      fileHash: '',
      imageToDownload: '',
      url: '',

      storageError: '',
      valueRegister: '',
      valueResolver: '',

      registering: false,
      responseRegister: null,
      isRegisterError: false,
      
      resolving: false,
      responseResolver: null,
      isResolverError: false,

      logs: [],

      requiredRules: [
      	v => !!v || 'Required',
      ]
    }
  },
  methods: {

  	setText(e) {
  		EmbarkJS.Storage.saveText(this.textToSave).then((hash) => {
  			this.generatedHash = hash
  			this.loadText = hash
  			this.storageError = ''
	        
	        this._addToLog(`EmbarkJS.Storage.saveText("${this.textToSave}").then(function(hash) { })`)
	      })
	      .catch((err) => {
	        if (err) {
	        	this.storageError = err.message || err
	          	console.log("Storage saveText Error => " + err.message)
	        }
	      });
  	},

  	loadHash(e) {
  		EmbarkJS.Storage.get(this.loadText).then((content) => {
  			this.storedText = content
  			this.storageError = ''
	        this._addToLog(`EmbarkJS.Storage.get("${this.loadText}").then(function(content) { })`)
	      })
	      .catch((err) => {
	        if (err) {
	        	this.storageError = err.message || err
	          	console.log("Storage get Error => " + err.message)
	        }
	      });
  	},

  	handleFileUpload(e) {
  		this.fileToUpload = e.target
  	},

  	uploadFile(e) {
  		e.preventDefault();

	    EmbarkJS.Storage.uploadFile([this.fileToUpload]).then((hash) => {
			this.fileHash = hash
			this.imageToDownload = hash
			this.storageError = ''
        	this._addToLog(`EmbarkJS.Storage.uploadFile(${this.fileToUpload}).then(function(hash) { })`)
      	})
      	.catch((err) => {
	        if (err) {
	        	this.storageError = err.message || err
	          	console.log("Storage uploadFile Error => " + err.message);
	        }
	    })

  	},

  	loadFile(e) {
  		this.url = EmbarkJS.Storage.getUrl(this.imageToDownload)
	    this._addToLog(`EmbarkJS.Storage.getUrl("${this.imageToDownload}")`)
  	},

  	isIPFS() {
  		return EmbarkJS.Storage.currentProviderName === 'ipfs'
  	},

  	ipnsRegister(e) {
  		this.registering = true
  		this.responseRegister = false
	    this._addToLog(`EmbarkJS.Storage.register(<IPFSHash>).then(function(hash) { })`)

	    EmbarkJS.Storage.register(this.valueRegister, (err, name) => {
	      this.responseRegister = err ? "Name Register Error: " + (err.message || err):name
	      this.valueResolver = !err ? name:''
	      this.isRegisterError = !!err
	      this.registering = false
	    });

  	},

  	ipnsResolve(e) {
  		this.resolving = true
  		this.responseResolver = false
	    this._addToLog(`EmbarkJS.Storage.resolve("${this.valueResolver}", function(err, path) { })`)
	    EmbarkJS.Storage.resolve(this.valueResolver, (err, path) => {
	    	this.responseResolver = err ? "Name Resolve Error: " + (err.message || err):path
	    	this.isResolverError = !!err
	    	this.resolving = false
	    });

  	},

  	_addToLog(txt) {
  		this.logs.push(txt)

  	}
  }
}
</script>