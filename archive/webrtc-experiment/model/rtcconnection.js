/*globals RTCMultiConnection */
"use strict";

function RTCConnectionManager() {
}

RTCConnectionManager.getConnection = function () {
  var connection = new RTCMultiConnection();
  connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';
  connection.session = {
    audio: false,
    video: false,
    data: true
  };
  connection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: false,
    OfferToReceiveVideo: false
  };
  connection.onstream = function () {
    console.log("onstream");
  };
  connection.onopen = function (event) {
    console.log("onopen");
    console.log(event);
  };
  connection.openOrJoin("11111");
  return connection;
};