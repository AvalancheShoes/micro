/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
$(function () {
	//window.open("http://localhost:3000", "_self")
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

	// PeerJS object
	var peer = new Peer({
		key: 'lwjd5qra8257b9',
		debug: 3
	});

	peer.on('open', function () {
		$('#my-id').text(peer.id);
	});

	// Receiving a call
	peer.on('call', function (call) {
		// Answer the call automatically (instead of prompting user) for demo purposes
		call.answer(window.localStream);
		step3(call);
	});
	peer.on('error', function (err) {
		alert(err.message);
		// Return to step 2 if error occurs
		step2();
	});

	// Click handlers setup
	$(function () {
		$('#make-call').click(function () {
			// Initiate a call!
			var call = peer.call($('#callto-id').val(), window.localStream);

			step3(call);
		});

		$('#end-call').click(function () {
			window.existingCall.close();
			step2();
		});

		// Retry if getUserMedia fails
		$('#step1-retry').click(function () {
			$('#step1-error').hide();
			step1();
		});

		// Get things started
		step1();
	});

	function step1() {
		// Get audio/video stream
		navigator.getUserMedia({
			audio: true,
			video: true
		}, function (stream) {
			// Set your video displays
			$('#my-video').prop('src', URL.createObjectURL(stream));

			window.localStream = stream;
			step2();
		}, function () {
			$('#step1-error').show();
		});
	}

	function step2() {
		$('#step1, #step3').hide();
		$('#step2').show();
	}

	function step3(call) {
		// Hang up on an existing call if present
		if (window.existingCall) {
			window.existingCall.close();
		}

		// Wait for stream on the call, then set peer video display
		call.on('stream', function (stream) {
			$('#their-video').prop('src', URL.createObjectURL(stream));
		});

		// UI stuff
		window.existingCall = call;
		$('#their-id').text(call.peer);
		call.on('close', step2);
		$('#step1, #step2').hide();
		$('#step3').show();
	}
});

var app = {
	// Application Constructor
	initialize: function () {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function () {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function () {
		app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent: function (id) {
		var parentElement = document.getElementById(id);
		var listeningElement = parentElement.querySelector('.listening');
		var receivedElement = parentElement.querySelector('.received');

		listeningElement.setAttribute('style', 'display:none;');
		receivedElement.setAttribute('style', 'display:block;');

		console.log('Received Event: ' + id);
	}
};

app.initialize();