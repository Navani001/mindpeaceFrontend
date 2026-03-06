"use client";

import { getRequest } from "@/utils";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ChatBotPage() {
    const router = useRouter();

    useEffect(() => {
        getRequest("chatbot/latest", {
            authorization: "Bearer " + localStorage.getItem("token"),
        })
            .then((res: any) => {
                const latestChatId = res?.data?.chat?.id;
                if (latestChatId) {
                    router.replace(`/chatBot/${latestChatId}`);
                    return;
                }
                router.replace("/login");
            })
            .catch(() => {
                router.replace("/login");
            });
    }, [router]);

    return <div className="h-screen w-full" />;
}
