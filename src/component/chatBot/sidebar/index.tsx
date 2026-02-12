import { postRequest } from "@/utils";
import { Button } from "@heroui/react"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus, FiStar, FiTrash2 } from "react-icons/fi"
interface ChatSession {
    id: string;
    name: string;
    updatedAt: Date;
    // messageCount: number;
    pinned?: boolean;
}
export const RightSideBar = ({ chats }: { chats: ChatSession[] }) => {
    const [chatHistory, setChatHistory] = useState<ChatSession[]>(chats);
    const router = useRouter();

    useEffect(() => {
        setChatHistory(chats);
    }, [chats])
    const handleNewChat = () => {
        const newChat: ChatSession = {
            id: Date.now().toString(),
            name: "New Chat",
            updatedAt: new Date(),

        };
        setChatHistory([newChat, ...chatHistory]);
        
        postRequest("chatbot", {
            name: newChat.name, "mood": "anxiety",
            "score": 0
}, {
                "authorization": "Bearer " + localStorage.getItem("token")
            }).then((res: any) => {


            })
        
    };

    const handleDeleteChat = (id: string) => {
        setChatHistory(chatHistory.filter((chat) => chat.id !== id));
    };

    const togglePin = (id: string) => {
        setChatHistory(
            chatHistory.map((chat) =>
                chat.id === id ? { ...chat, pinned: !chat.pinned } : chat
            )
        );
    };

    const formatDate = (date: Date | string) => {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        const now = new Date();
        const diffMs = now.getTime() - dateObj.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
        return dateObj.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    const pinnedChats = chatHistory.filter((chat) => chat.pinned);
    const recentChats = chatHistory.filter((chat) => !chat.pinned);

    return <aside className="w-80 border-l border-gray-300 bg-gray-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-300 bg-white">
            <h2 className="text-lg font-bold text-gray-900 mb-4">AI Assistant</h2>
            <Button
                onPress={handleNewChat}
                className="w-full bg-black text-white rounded-full flex items-center justify-center gap-2 font-semibold py-2 hover:bg-gray-800 transition"
            >
                <FiPlus size={18} />
                Start New Chat
            </Button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
            {/* Pinned Chats */}
            {pinnedChats.length > 0 && (
                <div className="px-4 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 mb-3">
                        <FiStar size={16} className="text-gray-500" />
                        <p className="text-xs font-semibold text-gray-600 uppercase">Pinned Chats</p>
                    </div>
                    <div className="space-y-2">
                        {pinnedChats.map((chat) => (
                            <div
                                key={chat.id}
                                className="group p-3 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">
                                            {chat.name}
                                        </p>
                                        <p className="text-xs text-gray-600">
                                            {/* {chat.messageCount} messages */}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteChat(chat.id)}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition ml-2"
                                    >
                                        <FiTrash2 size={14} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Recent Chats */}
            <div className="px-4 py-4">
                <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Recent</p>
                <div className="space-y-2">
                    {recentChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={()=>{
                                router.push(`/chatBot/${chat.id}`)
                            }}
                            className="group p-3 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {chat.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-blue-600 font-medium">
                                            {formatDate(chat.updatedAt)}
                                        </span>
                                        <span className="text-xs text-gray-600">
                                            {/* {chat.messageCount} messages */}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => togglePin(chat.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition ml-2"
                                    title="Pin chat"
                                >
                                    <FiStar size={14} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </aside>
}