"use client";

import { useParams } from "next/navigation";
import { chats } from "@/lib/placeholders-data";
import clsx from "clsx";
import { Input } from "./input";
import Markdown from "react-markdown";

export function Messages() {
  const params = useParams<{ id: string }>();

  return (
    <div className="inline-block w-full h-full p-5">
      <div className="w-full h-[70%] rounded-lg border-2 flex flex-col animate-scaleIn overflow-y-scroll overflow-x-hidden">
        <div className="text-2xl">
          {params.id === undefined
            ? "Welcome to finerseek!"
            : `You are in history record ${params.id}`}
        </div>
        {chats.map((chat, index) => (
          <div
            key={index}
            className={clsx(
              "flex flex-row gap-2",
              chat.user === "LG" ? "justify-end" : "justify-start"
            )}
          >
            <div className="prose">
              <Markdown>{chat.message}</Markdown>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full h-[30%] flex items-center justify-center p-2">
        <div className="rounded-lg border-2 w-full h-full text-center">
          <Input />
        </div>
      </div>
    </div>
  );
}
