"use client";

import clsx from "clsx";
import { ChatInput } from "./chat-input";
import React, { useEffect, useState } from "react";
import useScrollToBottom from "./hooks/use-scroll-to-bottom";
import { chats } from "@/lib/placeholders-data";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export function Messages({ id }: { id: number }) {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  useEffect(() => {
    setMessages(id === -1 ? [] : chats);
  }, [id]);

  return (
    <div className="w-full h-[90%] p-5">
      <div
        ref={messagesContainerRef}
        className="shadow-md w-full h-[70%] rounded-lg border-2 flex flex-col animate-scaleIn overflow-y-scroll overflow-x-hidden"
      >
        <div
          className={clsx(
            "",
            messages.length === 0 &&
              "flex items-center justify-center h-full w-full text-3xl"
          )}
        >
          {messages.length === 0
            ? "Welcome to finerseek!"
            : `You are in history record ${id}`}
        </div>
        {messages.map((message, index) => (
          <div
            key={index}
            className={clsx(
              "flex flex-row gap-2 ",
              message.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div className={clsx("flex", message.role === "user" && "flex-row-reverse")}>
              <div>{message.role === "user"? "user": "fs"}</div>
              <article className="p-2 m-2 bg-gray-200 rounded prose-sm shadow-lg">
                <Markdown skipHtml={false} rehypePlugins={[rehypeRaw]}>
                  {message.content}
                </Markdown>
              </article>
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} className=""></div>
      </div>
      <div className="relative w-full h-[30%] p-2 overflow-hidden">
        <div className="rounded-lg border-2 w-full h-full">
          <ChatInput messages={messages} setMessages={setMessages} />
        </div>
      </div>
    </div>
  );
}
