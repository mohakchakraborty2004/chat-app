import Redis from "ioredis";


class RedisPubSub {
    private sub: Redis;
    private pub: Redis;

    constructor() {
        this.sub = new Redis()
        this.pub = new Redis()
    }

    public async publish(grpId : string, message: any) {
        const channel = `group:${grpId}`;
         await this.pub.publish(channel, message);
         console.log("published")
    }

    public async subscribe(groupID: string, callback: (message: any) => void) {
          const channel = `group:${groupID}`;
          await this.sub.subscribe(channel);
   

         this.sub.on("message", (subscribedChannel, message) => {
            if(subscribedChannel == channel){
                callback(message);
            }
        })
    }
}

export default RedisPubSub;