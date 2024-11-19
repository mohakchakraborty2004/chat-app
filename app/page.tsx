"use client";

import Button from "@/components/button";
import useSocket from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import InputBar from "@/components/inputBar";
import MessageInput from "@/components/messageInput";


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
          
        console.log("group joined")

          // socket.send(
          //   JSON.stringify({
          //     "action": "join-grp",
          //     "GroupID": message.GroupID,
          //     "senderID": message.senderID
          //   })
          // )
        
        
          
        }

        if(message.action == "message-grp"){
           
          setMsg((prev) => [...prev, message.content])

        }
      }

    
     
     }
   }, [socket])


   //---------------------------joining

   const Joingrp = (GroupID: string , senderID:string) => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }
    socket.send(
      JSON.stringify({
        "action": "join-grp",
        "GroupID": GroupID,
        "senderID":senderID
      })
    )
   }

   //-------------------------message send

   const sendMessage = (content: string , senderID: string , GroupID: string) => {
    if (!socket) {
      console.error("Socket not initialized");
      return;
    }

    socket.send(
      JSON.stringify({
        "action": "message-grp",
        "GroupID": GroupID,
        "senderID": senderID,
        "content" : content
    })
  )

  setContent("");
   }

//------------------------------------------------------UI starts here-----------------------------------------------------------------------------



   if(!senderID || !GroupID) {
    // input boxes : 2
    //set sender and group id 
    return (
      <div>
      <InputBar onchange={(e : any)=> {
        setSenderID(e.target.value)
      }} title={"SenderID/name"} placeholder={"enter id"}></InputBar>

      <InputBar onchange={(e : any)=> {
        setGroupID(e.target.value)
      }} title={"GroupID"} placeholder={"enter GroupID"}></InputBar>

        <Button onclick={()=> {
             Joingrp(GroupID, senderID);
        }}></Button>
      </div>
    )
   }




  return (

    //text area : setContent
    // button on click : {content , senderID , GroupID , action : "message-grp"} json.stringify 
    //messages showing : iterating through msg state and displaying one by one , senderID on its side tbd how to show.
<>
<div>
         
            
         {msg.map((message, index) => (
         <div key={index} className="bg-green-500 text-white">
           {message}
         </div>
       ))}

   </div>



   <MessageInput onchange={(e : any)=> {
        setContent(e.target.value)
      }} title={"GroupID"} placeholder={"enter GroupID"}></MessageInput>
     <Button onclick={()=> {
             sendMessage(content, senderID, GroupID);
        }}></Button>



</>
  );
}
