import WebSocket from "ws";
import RedisPubSub from "./redisManager";


//const RedisManager = new RedisPubSub();

interface GrpMessage {
    action : string //imporve it to better type 
    GroupID : string
    senderID : string
    content? : string 
}

type GroupsMap = Map<String, Set<WebSocket>>

class groupChat {
    
    private groups: GroupsMap;
    private redisManager : RedisPubSub;

    constructor() {
        this.groups = new Map();
        this.redisManager = new RedisPubSub();
    }

    public join(groupID : string, ws: WebSocket) {
    if(!this.groups.has(groupID)){
        this.groups.set(groupID, new Set());
        this.redisManager.subscribe(groupID, (message) => {
            this.sendMessage(message);
        })
    }

    this.groups.get(groupID)!.add(ws);
    }

    public handleMessage(message: string, ws: WebSocket) {
        // groupid 
        // message content 
        const parsedMessage: GrpMessage = JSON.parse(message)
        if (parsedMessage.action == "join-grp" && parsedMessage.senderID && parsedMessage.GroupID){
            this.join(parsedMessage.GroupID, ws)
        }
        else if (parsedMessage.action== "message-grp"){
           this.redisManager.publish(parsedMessage.GroupID, parsedMessage.content)
        }
    }

    public sendMessage(message: any) {
        const parsedMessage: GrpMessage = JSON.parse(message)
        if(this.groups.has(parsedMessage.GroupID)){
            const members = this.groups.get(parsedMessage.GroupID);

            if(members){
                for(const member of members){
                    if(member.readyState === WebSocket.OPEN){
                        member.send(JSON.stringify(message))
                    }
                }
            }
        }
    }

}