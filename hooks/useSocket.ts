"use client";

import { useEffect, useState } from "react";


export default function useSocket() {
   
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(()=> {
        
        const ws = new WebSocket("ws://localhost:8000")

        ws.onopen = () => {
            console.log("socket connected");
            setSocket(ws);
        }

        ws.onclose = () => {
            console.log("socket disconnected"); 
            setSocket(null);
        }
    }, [])

    return socket;

}