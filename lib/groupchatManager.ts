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
        console.log("new grp created");
        this.redisManager.subscribe(groupID, (message) => {
            console.log("inside join group subscribing block")
            this.sendMessage(message);
        })
    }

    this.groups.get(groupID)!.add(ws);

    console.log("joined group")
    }



    public handleMessage(message: string, ws: WebSocket) {
        // groupid 
        // message content 
        const parsedMessage: GrpMessage = JSON.parse(message)
        if (parsedMessage.action == "join-grp" && parsedMessage.senderID && parsedMessage.GroupID){
            this.join(parsedMessage.GroupID, ws)
        }
        else if (parsedMessage.action== "message-grp"){
           this.redisManager.publish(parsedMessage.GroupID, message)
           console.log("message published on redis")
        }
    }

    public sendMessage(message: string) {
      //  console.log("----------------",message)

        const parsedMessage: GrpMessage = JSON.parse(message)

        // console.log("parsed msg : ", parsedMessage)
        // const grpid = this.groups.has(parsedMessage.GroupID)
        // console.log("--------",grpid)


        if(this.groups.has(parsedMessage.GroupID)){
  
            this.groups.get(parsedMessage.GroupID)?.forEach((member) => {
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
    }

}

export default groupChat;