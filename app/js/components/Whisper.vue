<template>
	<div id="whisper" class="options-div">
		<div style="text-align:center">
			<div class="title">
				<strong>{{msg}}</strong>
			</div>
			<div class="error-message" v-if="!isEnabled">
              <div>The node you are using does not support Whispe or</div>
              <div>The node uses an unsupported version of Whisper</div>
			</div>
		</div>

        
        <h2>Listen To channel</h2>
        <v-form class='form' v-model="valid_form_1" v-on:submit.prevent="listenToChannel($event)">
        	<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="listenTo"
			        	:rules="requiredRules"
			        	required
			        	label="Channel name">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_1"
						color="blue"
						class="white--text"
						light
						@click="listenToChannel"
						>Start Listening
					</v-btn>
				</v-flex>
			</v-layout>
            
            <div id="subscribeList">
            	<p v-for="channel in subscribedChannels" v-html="channel"></p>
            </div>
            <p>messages received:</p>
            <div id="messagesList">
            	<p v-for="msg in messageList" v-html="msg"></p>
            </div>
        </v-form>

        <h2>Send Message</h2>
        <v-form class='form' v-model="valid_form_2" v-on:submit.prevent="sendMessage($event)">
        	<v-layout row wrap>
	    		<v-flex lg-3>
			        <v-text-field
			        	v-model="channel"
			        	:rules="requiredRules"
			        	required
			        	label="Channel"
			        	style="margin-right: 15px">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
			        <v-text-field
			        	v-model="message"
			        	:rules="requiredRules"
			        	required
			        	label="Message">
					</v-text-field>
				</v-flex>
				<v-flex lg-3>
					<v-btn
						:disabled="!valid_form_2"
						color="blue"
						class="white--text"
						light
						@click="sendMessage"
						>Send Message
					</v-btn>
				</v-flex>
			</v-layout>
        </v-form>

        <p>Javascript calls being made: </p>
        <div class="logs" v-if="logs.length > 0">
        	<p v-for="log in logs">
	    		{{log}}
	    	</p>
        </div>
	</div>
</template>

<script>
import EmbarkJS from 'Embark/EmbarkJS'

export default {
  name: 'WhisperDemo',
  computed: {
  	isEnabled() {
  		return this.$store.state.whisperEnabled
  	}
  },
  data () {
    return {
		msg: 'Whisper Demo',
		valid_form_1: false,
    	valid_form_2: false,
		listenTo: '',
		channel: '',
		message: '',
		subscribedChannels: [],
		messageList: [],
		
		logs: [
			"EmbarkJS.Messages.setProvider('whisper')"
		],
		requiredRules: [
    	  	v => !!v || 'Required',
	    ]

    }
  },
  methods: {
  	listenToChannel(e) {
	    this.subscribedChannels.push(`<span>Subscribed to <b>${this.listenTo}</b>. Now try sending a message</span>`)

	    this.channel = this.listenTo
	    
	    EmbarkJS.Messages.listenTo({topic: [this.listenTo]}, (error, message) => {
			if (error) {
				this.messageList.push(`<span class="alert-danger">Error: ${error}</span>`)
			} else {
				this.messageList.push(`<span>Channel: <b>${message.topic}</b> |  Message: <b>${message.data}</b></span>`)
			}
	    });

	    this._addToLog(`EmbarkJS.Messages.listenTo({topic: ["${this.listenTo}"]}).then(function(error, message) {})`)
  	},
  	sendMessage(e) {
  		EmbarkJS.Messages.sendMessage({topic: this.channel, data: this.message});
    	this._addToLog(`EmbarkJS.Messages.sendMessage({topic: "${this.channel}", data: "${this.message}"})`);
  	},

  	_addToLog(txt) {
  		this.logs.push(txt)
  	}
  }
}
</script>

<style scoped>
.alert-danger {
	color: red
}
</style>