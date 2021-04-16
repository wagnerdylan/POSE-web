
require('../webview.js');

var messages = require('../../proto/payload_pb.js');

var web_controller = {
    setup: function () {
        // Connect to data source
        this.connect_web_socket();
    },

    connect_web_socket: function () {
        var ws_uri = (window.location.protocol == 'https:' && 'wss://' || 'ws://') + window.location.host + '/ws/';
        this.ws_connection = new WebSocket(ws_uri);

        this.ws_connection.onopen = function () {
            console.log("WebSocket connected");
        }

        this.ws_connection.onclose = function () {
            console.log("Websocket closed");
        }

        this.ws_connection.onmessage = function (ws_payload) {
            console.log("Websocket msg received");
            this.handle_sim_data(ws_payload.data);
        }
    },

    handle_sim_data: function (sim_data) {
        // Data sim_data needs to be deserialized
    }
}

exports.web_controller = web_controller;
