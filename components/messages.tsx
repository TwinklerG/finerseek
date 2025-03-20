"use client";

import clsx from "clsx";
import { ChatInput } from "./chat-input";
import React, { useEffect, useState } from "react";
import useScrollToBottom from "./hooks/use-scroll-to-bottom";
import { chats } from "@/lib/placeholders-data";
import { TopBar } from "@/components/topbar";
import { TopBarBtn } from "@/components/btn";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./style.css";

export function Messages({ id }: { id: number }) {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [isTopBarOpen, setIsTopBarOpen] = useState(true);
    const [messagesContainerRef, messagesEndRef] = useScrollToBottom<HTMLDivElement>();
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null); // 记录哪个消息的复制按钮被点击
    const [likedIndex, setLikedIndex] = useState<number | null>(null); // 记录哪个消息的赞同按钮被点击
    const [dislikedIndex, setDislikedIndex] = useState<number | null>(null); // 记录哪个消息的不赞同按钮被点击

    useEffect(() => {
        setMessages(id === -1 ? [] : chats);
    }, [id]);

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, messagesContainerRef]);

    const handleCopy = (content: string, index: number) => {
        navigator.clipboard
            .writeText(content)
            .then(() => {
                setCopiedIndex(index); // 设置当前消息的复制按钮状态
                setTimeout(() => setCopiedIndex(null), 2000); // 2秒后恢复原状
            })
            .catch(() => {
                alert("复制失败，请重试！");
            });
    };

    const handleLike = (index: number) => {
        if (likedIndex === index) {
            setLikedIndex(null); // 如果已经赞同，则取消赞同
        } else {
            setLikedIndex(index); // 否则设置赞同
            setDislikedIndex(null); // 取消不赞同（如果存在）
        }
    };

    const handleDislike = (index: number) => {
        if (dislikedIndex === index) {
            setDislikedIndex(null); // 如果已经不赞同，则取消不赞同
        } else {
            setDislikedIndex(index); // 否则设置不赞同
            setLikedIndex(null); // 取消赞同（如果存在）
        }
    };

    const handleRegenerate = () => {
        // 这里可以调用 API 重新生成消息
    };

    return (
        <div className="flex flex-col items-center h-full w-full transition-all duration-300">
            <TopBar isTopBarOpen={isTopBarOpen} />
            <TopBarBtn isTopBarOpen={isTopBarOpen} setIsTopBarOpen={setIsTopBarOpen} />

            <div className={clsx("flex flex-col w-full h-full bg-white dark:bg-custom-gray items-center transition-all duration-300 overflow-auto")}>
                <div ref={messagesContainerRef} className="flex flex-col w-[50%] h-full">
                    {messages.map((message, index) => (
                        <div key={index} className={clsx("chat flex flex-row gap-2", message.role === "user" ? "justify-end" : "justify-start")}>
                            <div className={clsx("flex", message.role === "user" && "flex-row-reverse")}>
                                <div className={clsx("max-w-2xl", message.role === "user" ? "chat-bubble1" : "chat-bubble2")}>
                                    <Markdown skipHtml={false} rehypePlugins={[rehypeRaw]}>
                                        {message.content}
                                    </Markdown>
                                    {message.role === "assistant" && (
                                        <div className="flex gap-2 mt-2">
                                            <div className="group relative inline-block">
                                                <button
                                                    className="flex items-center gap-1 p-1 text-sm bg-white hover:bg-base-200 dark:bg-custom-gray dark:hover:bg-gray-700 rounded-full"
                                                    onClick={() => handleCopy(message.content, index)}
                                                >
                                                    {copiedIndex === index ? (
                                                        <span className="icon-[tabler--check] text-gray-400 size-[1.2rem]"></span>
                                                    ) : (
                                                        <span className="icon-[tabler--copy] text-gray-400  size-[1.2rem]"></span>
                                                    )}
                                                </button>
                                                <div
                                                    className="absolute bottom-full  transform left-0 -translate-y-1/4 -translate-x-1/4 px-3 py-1 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                                                    复制
                                                </div>
                                            </div>
                                            <div className="group relative inline-block">
                                                <button
                                                    className="flex items-center gap-1 p-1 text-sm bg-white hover:bg-base-200 dark:bg-custom-gray dark:hover:bg-gray-700 rounded-full"
                                                    onClick={() => handleRegenerate()}
                                                >
                                                    <span className="icon-[tabler--refresh] text-gray-400  size-[1.2rem]"></span>
                                                </button>
                                                <div
                                                    className="absolute bottom-full transform left-0 -translate-y-1/4 -translate-x-1/4 px-3 py-1 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                                                    重新回答
                                                </div>
                                            </div>
                                            <div className="group relative inline-block">
                                                <button
                                                    className="flex items-center gap-1 p-1 text-sm bg-white hover:bg-base-200 dark:bg-custom-gray dark:hover:bg-gray-700 rounded-full"
                                                    onClick={() => handleLike(index)}
                                                >
                                                    {likedIndex === index ? (
                                                        <span className="icon-[tabler--thumb-up-filled] text-gray-400 size-[1.2rem]"></span>
                                                    ) : (
                                                        <span className="icon-[tabler--thumb-up] text-gray-400 size-[1.2rem]"></span>
                                                    )}
                                                </button>
                                                <div
                                                    className="absolute bottom-full transform left-0 -translate-y-1/4 -translate-x-1/4 px-3 py-1 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                                                    喜欢
                                                </div>
                                            </div>
                                            <div className="group relative inline-block">
                                                <button
                                                    className="flex items-center gap-1 p-1 text-sm bg-white hover:bg-base-200 dark:bg-custom-gray dark:hover:bg-gray-700 rounded-full"
                                                    onClick={() => handleDislike(index)}
                                                >
                                                    {dislikedIndex === index ? (
                                                        <span className="icon-[tabler--thumb-down-filled] text-gray-400 size-[1.2rem]"></span>
                                                    ) : (
                                                        <span className="icon-[tabler--thumb-down] text-gray-400 size-[1.2rem]"></span>
                                                    )}
                                                </button>
                                                <div
                                                    className="absolute bottom-full transform left-0 -translate-y-1/4 -translate-x-1/4 px-3 py-1 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                                                    不喜欢
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}></div>
                </div>
            </div>

            <div className="rounded-lg border-1 w-[50%] h-[20%] items-center justify-center flex flex-col animate-scaleIn transition-all duration-300">
                <ChatInput messages={messages} setMessages={setMessages} />
            </div>
        </div>
    );
}