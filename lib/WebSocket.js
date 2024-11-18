"use server";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ws_1 = require("ws");
var chatManager_1 = require("./chatManager");
var uuid_1 = require("uuid");
var groupchatManager_1 = require("./groupchatManager");
var port = 8000;
var wss = new ws_1.WebSocketServer({ port: port });
var ChatManager = new chatManager_1.default();
var GroupChat = new groupchatManager_1.default();
wss.on("connection", function connection(socket) {
    //to add authentication for user id
    var userID = (0, uuid_1.v4)();
    socket.on("message", function (RawMessage) {
        try {
            var message = JSON.parse(RawMessage.toString());
            if (!message.action) {
                socket.send(JSON.stringify({ message: "no action detected" }));
            }
            //connecting for 1 on 1 chat
            if (message.action == "connect") {
                ChatManager.connect(userID, socket);
            }
            // messaging 1 on 1 
            else if (message.action == "message") {
                ChatManager.handleMessages(RawMessage.toString(), socket);
            }
            // for joining a group chat
            else if (message.action == "join-grp") {
                GroupChat.join(message.GroupID, socket);
                socket.send(JSON.stringify({ message: "joind group ".concat(message.GroupID) }));
            }
            // for messaging a group chat
            else if (message.action == "message-grp") {
                if (message.GroupID && message.senderID && message.content) {
                    GroupChat.handleMessage(RawMessage.toString(), socket);
                }
            }
            // default
            else {
                socket.send(JSON.stringify({ message: "error in mesage format" }));
            }
        }
        catch (error) {
            console.log(error);
        }
    });
});
