interface User {
    id: string
    name: string
    email: string
    password?: string
    image: string
}

interface Chat {
    id: string
    messages: Message[]
}

interface Message {
    id: string
    senderId: string
    receiverId: string
    text: string
    createdAt: number
}

interface FriendRequest {
    id: string
    senderId: string
    receiverId: string
}