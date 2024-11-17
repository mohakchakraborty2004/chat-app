"use server";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var chatManager_1 = require("./chatManager");
var uuid_1 = require("uuid");
var port = 8000;
var wss = new ws_1.WebSocketServer({ port: port });
var ChatManager = new chatManager_1.default();
wss.on("connection", function connection(socket) {
    var userID = (0, uuid_1.v4)();
    ChatManager.connect(userID, socket);
    socket.on("message", function (message) {
        ChatManager.handleMessages(message.toString(), socket);
    });
});
