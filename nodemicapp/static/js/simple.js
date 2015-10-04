$(function () {

	$("#auth").show();
	// or
	$("#demoContainer").hide();

	$("#pwCheck").hide();

	$(document).on('click', '.organiser', function (event) {
		$("#auth").hide();
		$("#pwCheck").show();
	});

	$(document).on('click', '.audience', function (event) {
		$("#auth").hide();
		$("#demoContainer").show();
		$("#connectControls").hide();
	});

	$(document).on('click', '#next1', function (event) {
		console.log("test");
		if ($('#pw').val() == "password") {
			console.log("test2");
			$('#pwCheck').hide();
			$("#demoContainer").show();
		} else {
			$('.error').val() = "Sorry Wrong password Wolf Gang";
		}
	});

	$(document).on('click', '#que', function (event) {
		function connect() {
			easyrtc.setVideoDims(640, 480);
			easyrtc.setRoomOccupantListener(convertListToButtons);
			easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);
		};


	});

});

var selfEasyrtcid = "";





function clearConnectList() {
	var otherClientDiv = document.getElementById("otherClients");
	while (otherClientDiv.hasChildNodes()) {
		otherClientDiv.removeChild(otherClientDiv.lastChild);
	}
}


function convertListToButtons(roomName, data, isPrimary) {
	clearConnectList();
	var otherClientDiv = document.getElementById("otherClients");
	for (var easyrtcid in data) {
		var button = document.createElement("button");
		button.onclick = function (easyrtcid) {
			return function () {
				performCall(easyrtcid);
			};
		}(easyrtcid);

		var label = document.createTextNode(easyrtc.idToName(easyrtcid));
		button.appendChild(label);
		otherClientDiv.appendChild(button);
	}
}


function performCall(otherEasyrtcid) {
	easyrtc.hangupAll();

	var successCB = function () {};
	var failureCB = function () {};
	easyrtc.call(otherEasyrtcid, successCB, failureCB);
}


function loginSuccess(easyrtcid) {
	selfEasyrtcid = easyrtcid;
	document.getElementById("iam").innerHTML = "I am " + easyrtc.cleanId(easyrtcid);
}


function loginFailure(errorCode, message) {
	//easyrtc.showError(errorCode, message);
}