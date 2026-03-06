import { deleteRequest, getRequest, postRequest } from "@/utils";
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
export const RightSideBar = ({ chats, currentChatId }: { chats: ChatSession[], currentChatId?: string }) => {
    const [chatHistory, setChatHistory] = useState<ChatSession[]>(chats);
    const router = useRouter();

    useEffect(() => {
        setChatHistory(chats);
    }, [chats])
    const handleNewChat = async () => {
        try {
            await postRequest("chatbot", {
                name: "New Chat", "mood": "anxiety",
                "score": 0
            }, {
                "authorization": "Bearer " + localStorage.getItem("token")
            });

            const latestChatRes: any = await getRequest("chatbot/latest", {
                "authorization": "Bearer " + localStorage.getItem("token")
            });

            const latestChat = latestChatRes?.data?.chat;
            if (latestChat?.id) {
                setChatHistory((prevChats) => [latestChat, ...prevChats.filter((chat) => chat.id !== latestChat.id)]);
                router.push(`/chatBot/${latestChat.id}`);
            }
        } catch (error) {
            console.error("Failed to create and navigate to latest chat:", error);
        }

    };

    const handleDeleteChat = async (id: string) => {
        try {
            await deleteRequest(`chatbot/${id}`, {}, {
                "authorization": "Bearer " + localStorage.getItem("token")
            });
            setChatHistory((prevChats) => prevChats.filter((chat) => chat.id !== id));
        } catch (error) {
            console.error("Failed to delete chat:", error);
        }
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
                                onClick={() => {
                                    router.push(`/chatBot/${chat.id}`)
                                }}
                                className={`group p-3 rounded-lg transition cursor-pointer ${chat.id === currentChatId
                                    ? 'bg-blue-100 border-l-4 border-blue-600'
                                    : 'hover:bg-gray-100'
                                    }`}
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteChat(chat.id)
                                        }}
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
                            onClick={() => {
                                router.push(`/chatBot/${chat.id}`)
                            }}
                            className={`group p-3 rounded-lg transition cursor-pointer ${chat.id === currentChatId
                                ? 'bg-blue-100 border-l-4 border-blue-600'
                                : 'hover:bg-gray-100'
                                }`}
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
                                <div className="flex items-center gap-1 ml-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            togglePin(chat.id)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded transition"
                                        title="Pin chat"
                                    >
                                        <FiStar size={14} className="text-gray-400" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteChat(chat.id)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded transition"
                                        title="Delete chat"
                                    >
                                        <FiTrash2 size={14} className="text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </aside>
}