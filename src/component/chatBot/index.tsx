"use client";
import { useChat } from "@ai-sdk/react";
import { Button, Input } from "@heroui/react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Lottie from "lottie-react";
import robots from "./../../assets/robotsLottie.json";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { RightSideBar } from "./sidebar";
import { getRequest, postRequest } from "@/utils";
import { useRouter } from "next/navigation";

// Typing animation component
const TypingAnimation = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
      <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
    </div>
  );
};



export const Chatbot = ({ id }: any) => {
  const router = useRouter();
  useEffect(() => {
    getRequest("chatbot", {
      "authorization": "Bearer " + localStorage.getItem("token")
    }).then((res: any) => {

      setChatData(res.data.chats);
    })

  }, [])
  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages, status } = useChat({
    id: id || "creation",
    api: "/api/chatbox",
  });
  const [response, setResponse] = useState(false);
  const [chatData, setChatData] = useState<any>([]);
  const [chatMessages, setChatMessages] = useState<any>([]);
  const [lastSavedAssistantId, setLastSavedAssistantId] = useState<string | null>(null);
  const [name, setName] = useState("New Chat");
  useEffect(() => {
    console.log("status:", status, "response:", response, "messages length:", messages.length);

    if (response && status === "ready" && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];

      // Only save if it's an assistant message and hasn't been saved yet
      if (lastMessage.role === "assistant" && lastMessage.content && lastMessage.id !== lastSavedAssistantId) {
        console.log("Saving assistant response:", lastMessage.content);

        postRequest(`chatbot/messages/${id}`, {
          "sender": "assistant",
          "content": lastMessage.content
        }, {
          "authorization": "Bearer " + localStorage.getItem("token")
        }).then((res: any) => {
          console.log("Assistant response saved:", res);
          setLastSavedAssistantId(lastMessage.id);
          setResponse(false);
          setChatData((prevChats: any) => {
            const updatedChats = prevChats.map((chat: any) => {
              if (chat.id === id) {
                return { ...res.data.chat };
              }
              return chat;
            }
            )
            return updatedChats;
          });
          setChatMessages([...chatMessages, lastMessage]);
        }).catch((err: any) => {
          console.error("Failed to save assistant response:", err);
          setResponse(false);
        });
      }
    }
  }, [status, response, messages, id, lastSavedAssistantId]);

  useEffect(() => {
    getRequest(`chatbot/messages/${id}`, {
      "authorization": "Bearer " + localStorage.getItem("token")
    }).then((res: any) => {
      const chatDetails = res?.data?.chats;
      const messagesFromApi = Array.isArray(res?.data?.messages) ? res.data.messages : [];

      if (!chatDetails) {
        setName("New Chat");
        setChatMessages([]);
        setMessages([]);

        getRequest("chatbot", {
          "authorization": "Bearer " + localStorage.getItem("token")
        }).then((chatRes: any) => {
          const chats = chatRes?.data?.chats || [];
          setChatData(chats);
          const latestChatId = chats?.[0]?.id;
          if (latestChatId) {
            router.push(`/chatBot/${latestChatId}`);
          } else {
            router.push("/chatBot");
          }
        });
        return;
      }

      const formattedMessages = messagesFromApi.map((msg: any) => ({
        id: msg.id,
        role: msg.sender === "user" ? "user" : "assistant",
        content: msg.content,
        createdAt: msg.createdAt,
        updatedAt: msg.updatedAt,
        parts: [{ type: "text", text: msg.content }]
      }));
      setChatMessages(formattedMessages);
      setName(chatDetails.name);
      // Initialize useChat messages with backend data for context preservation
      setMessages(formattedMessages);
    }).catch(() => {
      setName("New Chat");
      setChatMessages([]);
      setMessages([]);
    })

  }, [id, setMessages, router])


  return (
    <div className="flex h-full w-full bg-gray-50">
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="border-b border-gray-300 bg-white px-8 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
            <p className="text-sm text-gray-600">Updated 1 second ago . {messages.length} messages</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-8  bg-gray-50 relative">
          <div className="absolute bottom-0 right-0">
            <div className="absolute">

              {/* <MessageCircle className="-rotate-90 absolute" strokeWidth={0.1} rotate={270} size={100} /> */}
            </div>
            <div className="w-40 h-40 mb-6 abosolute ">
              {/*  <Lottie animationData={robots} loop={true} /> */}
            </div>
          </div>
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="w-40 h-40 mb-6">
                <Lottie animationData={robots} loop={true} />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No messages yet. Say hello to start.
              </h3>
              <p className="text-gray-600 text-center max-w-md">
                Start a conversation about your mental health and well-being. I'm here to listen and support you.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-w-4xl">
              {messages.map((message: any) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`max-w-2xl !bg-black  rounded-lg px-4 py-3 ${message.role === "user"
                      ? " text-white rounded-br-none"
                      : "!bg-white text-gray-800 rounded-bl-none border border-gray-200"
                      }`}
                  >
                    {message.parts.map((part: any) => {
                      if (part.type === "text") {
                        return (
                          <ReactMarkdown
                            key={message.id}
                            components={{
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }: any) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                return !inline && match ? (
                                  <SyntaxHighlighter
                                    style={tomorrow}
                                    language={match[1]}
                                    PreTag="div"
                                    {...props}
                                  >
                                    {String(children).replace(/\n$/, "")}
                                  </SyntaxHighlighter>
                                ) : (
                                  <code className={className} {...props}>
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {part.text}
                          </ReactMarkdown>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg px-4 py-3 rounded-bl-none border border-gray-200">
                    <TypingAnimation />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-300 p-6 bg-white">
          <div className="max-w-4xl mx-auto flex gap-3 border-1 rounded-md">
            <Input
              value={input}
              placeholder="Share your thoughts with me..."
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  // Save user message to backend
                  postRequest(`chatbot/messages/${id}`, {
                    "sender": "user",
                    "content": input
                  }, {
                    "authorization": "Bearer " + localStorage.getItem("token")
                  }).then((res: any) => {
                    setResponse(true);
                  }).catch((err: any) => {
                    console.error("Failed to save user message:", err);
                  });
                  // Let useChat handle adding the message
                  handleSubmit();
                }
              }}
              className="flex-1"
              classNames={{
                input: "bg-gray-100 text-gray-900",
              }}
            />
            <Button
              onPress={() => {
                // Save user message to backend
                postRequest(`chatbot/messages/${id}`, {
                  "sender": "user",
                  "content": input
                }, {
                  "authorization": "Bearer " + localStorage.getItem("token")
                }).then((res: any) => {
                  setResponse(true);
                }).catch((err: any) => {
                  console.error("Failed to save user message:", err);
                });
                // Let useChat handle adding the message
                handleSubmit();
              }}
              className="bg-gray-700 text-white px-6 font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Send
            </Button>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Chat History */}
      <RightSideBar chats={chatData} currentChatId={id} />
    </div>
  );
};
