import { pusherClient } from "@/lib/pusher";
import { useEffect, useState } from "react";


 export const useTyping = () => {
    const [currentTypingUser, setCurrentTypingUser] = useState('')
    let typingInterval: NodeJS.Timer | undefined
    const TYPING_INTERVAL_DURATION = 3000

    const handleStartTyping = (friendName:string) => {
        clearInterval(typingInterval)
    }

    const handleStopTyping = () => {
        clearInterval(typingInterval)
        setCurrentTypingUser("")
    }

    useEffect(() => {
        pusherClient.subscribe('typing-channel')
        pusherClient.bind('start-typing', (username:string) => setCurrentTypingUser(username))
        pusherClient.bind('stop-typing', () => setCurrentTypingUser(""))

        return () => {
            pusherClient.unsubscribe('typing-channel')
            pusherClient.unbind('start-typing', (username:string) => setCurrentTypingUser(username))
            pusherClient.unbind('stop-typing', () => setCurrentTypingUser(""))
        }

    }, [])

    return {currentTypingUser, handleStartTyping, handleStopTyping}
 }