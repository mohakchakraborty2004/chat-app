"use server";

import WebSocket, {WebSocketServer} from "ws";
import chatManager from "./chatManager";
import {v4 as uuidv4} from "uuid" ;
import groupChat from "./groupchatManager";

const port = 8000;
const wss = new WebSocketServer({port : port});

const ChatManager = new chatManager();
const GroupChat = new groupChat();

wss.on("connection", function connection(socket){
    //to add authentication for user id
    const userID = uuidv4();


    socket.on("message" , (RawMessage) => {

        try {
            
         const message = JSON.parse(RawMessage.toString())

         if(!message.action){
            socket.send(JSON.stringify({ message: "no action detected" }))
         }
       
         //connecting for 1 on 1 chat
         if(message.action == "connect"){
            ChatManager.connect(userID ,socket);
         } 
         // messaging 1 on 1 
         else if(message.action == "message"){
            ChatManager.handleMessages(RawMessage.toString(), socket);
         }
         // for joining a group chat
         else if(message.action == "join-grp"){
            GroupChat.join(message.GroupID, socket);
            socket.send(JSON.stringify({message : `joind group ${message.GroupID}`}))
         }
         // for messaging a group chat
         else if(message.action == "message-grp"){
            if(message.GroupID && message.senderID && message.content){
            GroupChat.handleMessage(RawMessage.toString(), socket);
            }
         }
         // default
         else {
            socket.send(JSON.stringify({message : "error in mesage format"}))
         }

        } catch (error) {
            console.log(error);
        }
   
       
    })
})