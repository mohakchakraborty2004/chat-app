"use server";

import { log } from "console";
import WebSocket from "ws"; 

interface Message {
    action : string //imporve it to better type 
    recipientID? : string
    senderID : string
    content? : string 
}

type ClientsMap = Map<String, WebSocket>

class chatManager {
    
    private clients: ClientsMap;

    constructor() {
        this.clients = new Map();
    }

   public connect(clientID : string, ws: WebSocket) {
    //adding user authentication for better checks.
        if(!clientID){
            console.log("user not connected");
        }

        this.clients.set(clientID, ws);
        console.log("user connected");
    }

    public async sendMessage (recipientID: string , senderID: string, content: string) {
         console.log("recipient id is :", recipientID);
         console.log("sender id is :" , senderID);
            const recipientWS = this.clients.get(recipientID)
            if (!recipientWS) {
                console.log("reciever not found");
            }

            const message = JSON.stringify({senderID, content});

            recipientWS?.send(message);
            console.log("message sent");

            
    }


    public handleMessages(message : string , ws: WebSocket) {
           const parsedMessage : Message = JSON.parse(message)

           if(parsedMessage.action == "message" && parsedMessage.recipientID && parsedMessage.content && parsedMessage.senderID){
            this.sendMessage( parsedMessage.recipientID,parsedMessage.senderID, parsedMessage.content);
           }
           else if(parsedMessage.action == "connect" && parsedMessage.senderID){
            this.connect(parsedMessage.senderID, ws)
           }
           else{
            console.log("invalid message format");
           }
    }
}

export default chatManager;