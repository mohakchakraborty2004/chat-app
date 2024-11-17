"use server";

import WebSocket, {WebSocketServer} from "ws";
import chatManager from "./chatManager";
import {v4 as uuidv4} from "uuid" ;

const port = 8000;
const wss = new WebSocketServer({port : port});

const ChatManager = new chatManager()

wss.on("connection", function connection(socket){
    
    const userID = uuidv4();

    ChatManager.connect(userID ,socket)

    socket.on("message" , (message) => {
        ChatManager.handleMessages(message.toString(), socket)
    })
})