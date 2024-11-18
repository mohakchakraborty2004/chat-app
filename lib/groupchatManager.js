"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redisManager_1 = require("./redisManager");
var groupChat = /** @class */ (function () {
    function groupChat() {
        this.groups = new Map();
        this.redisManager = new redisManager_1.default();
    }
    groupChat.prototype.join = function (groupID, ws) {
        var _this = this;
        if (!this.groups.has(groupID)) {
            this.groups.set(groupID, new Set());
            console.log("new grp created");
            this.redisManager.subscribe(groupID, function (message) {
                _this.sendMessage(message);
                console.log("inside join group subscribing block");
            });
        }
        this.groups.get(groupID).add(ws);
        console.log("joined group");
    };
    groupChat.prototype.handleMessage = function (message, ws) {
        // groupid 
        // message content 
        var parsedMessage = JSON.parse(message);
        if (parsedMessage.action == "join-grp" && parsedMessage.senderID && parsedMessage.GroupID) {
            this.join(parsedMessage.GroupID, ws);
        }
        else if (parsedMessage.action == "message-grp") {
            this.redisManager.publish(parsedMessage.GroupID, message);
            console.log("message published on redis");
        }
    };
    groupChat.prototype.sendMessage = function (message) {
        var _a;
        console.log("----------------", message);
        var parsedMessage = JSON.parse(message);
        console.log("parsed msg : ", parsedMessage);
        var grpid = this.groups.has(parsedMessage.GroupID);
        console.log("--------", grpid);
        if (this.groups.has(parsedMessage.GroupID)) {
            (_a = this.groups.get(parsedMessage.GroupID)) === null || _a === void 0 ? void 0 : _a.forEach(function (member) {
                // if (member.readyState === WebSocket.OPEN) {
                //   member.send(JSON.stringify(parsedMessage));
                // }
                member.send(JSON.stringify(parsedMessage));
            });
            // const members = this.groups.get(parsedMessage.GroupID);
            // console.log("members :", members)
            // if(members && members.size > 0){
            //     console.log("0")
            //     for(const member of members){
            //         console.log("1")
            //         console.log(member.readyState === WebSocket.OPEN)
            //         if(member.readyState === WebSocket.OPEN){
            //             console.log("2")
            //             member.send(JSON.stringify(parsedMessage))
            //             console.log("inside sendMessage block of group chat")
            //         }
            //     }
            // }
        }
    };
    return groupChat;
}());
exports.default = groupChat;
