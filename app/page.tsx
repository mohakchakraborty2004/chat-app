import useSocket from "@/hooks/useSocket";
import { useEffect, useState } from "react";


export default function Home() {

  const [msg, setMsg] = useState<any[]>([]);
  const [senderID , setSenderID] = useState<string>("");
  const [content , setContent] = useState<string>("");
  const [GroupID, setGroupID] = useState<string>("");

const socket = useSocket();

   useEffect(()=> {
     if(!socket){
      console.log("no socket detected")
      return;
     }

     socket.onmessage = (event) => {
      if(typeof event.data === "string"){
        const message = JSON.parse(event.data);
      

        if(message.action == "join-grp") {
          
        setMsg((prev) => [...prev, message.content])

          socket.send(
            JSON.stringify({
              "action": "join-grp",
              "GroupID": message.GroupID,
              "senderID": message.senderID
            })
          )
        
        
          
        }

        if(message.action == "message-grp"){
           
          socket.send(
            JSON.stringify({
              "action": "message-grp",
              "GroupID": message.GroupID,
              "senderID": message.senderID,
              "content" : message.content
          })
        )
        }
      }

    
     
     }
   }, [socket])


   if(!senderID || !GroupID) {
    // input boxes : 2
    //set sender and group id 
    return (
      <div>
        
      </div>
    )
   }

  return (

    //text area : setContent
    // button on click : {content , senderID , GroupID , action : "message-grp"} json.stringify 
    //messages showing : iterating through msg state and displaying one by one , senderID on its side tbd how to show.
<>

</>
  );
}
