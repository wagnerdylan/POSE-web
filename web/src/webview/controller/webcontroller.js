
import { web_view } from '../webview.js';
import { SimDataBuffer } from './databuffer.js';

// Google protobuf 
var messages = require('../../proto/sim_pb.js');

var web_controller = {
    setup: function () {

        this.sim_data_buffer = new SimDataBuffer();

        // Connect to data source
        this.connect_web_socket();
    },

    connect_web_socket: function () {
        var ws_uri = (window.location.protocol == 'https:' && 'wss://' || 'ws://') + window.location.host + '/ws/';
        this.ws_connection = new WebSocket(ws_uri);
        this.ws_connection.binaryType = "arraybuffer";

        this.ws_connection.onopen = function () {
            console.log("WebSocket connected");
        }

        this.ws_connection.onclose = function () {
            console.log("Websocket closed");
        }

        this.ws_connection.onmessage = function (ws_payload) {
            console.log("Websocket msg received");
            web_controller.handle_sim_data(ws_payload.data);
        }
    },

    handle_sim_data: function (sim_data) {
        // Data sim_data needs to be deserialized
        var sim_update = messages.SimUpdate.deserializeBinary(sim_data);

        this.sim_data_buffer.insert_sim_data(sim_update);
        
    }
}

export { web_controller };
