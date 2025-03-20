import { IconArrowUp } from "@tabler/icons-react";
import { Artifacts } from "@/components/artifacts";
import React, { Dispatch, SetStateAction, useState, useRef } from "react";
import './style.css';

export function ChatInput({
                            messages,
                            setMessages,
                          }: {
  messages: { role: string; content: string }[];
  setMessages: Dispatch<SetStateAction<{ role: string; content: string }[]>>;
}) {
  const [inputContent, setInputContent] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null); // 用于绑定 textarea

  const handleSubmit = () => {
    // 检查输入内容是否为空或只包含换行符
    if (!inputContent.trim()) {
      // 如果输入内容为空或只包含换行符，显示提示信息
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 3000); // 3秒后隐藏提示信息
      return; // 阻止发送
    }

    // 正常处理发送逻辑
    setMessages((messages) => [
      ...messages,
      { role: "user", content: inputContent },
    ]);
    setInputContent("");
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `{"stream":true,"messages":${JSON.stringify([
        ...messages,
        { role: "user", content: inputContent },
      ])},"model":"deepseek-ai/DeepSeek-R1-Distill-Llama-8B"}`,
    };

    fetch("/api/py/chat/completions", options).then((response) => {
      const reader = response.body?.getReader(); // Get the reader for the response body
      const decoder = new TextDecoder(); // To decode the incoming byte stream
      // Read the stream in chunks
      let newMessage = "";
      setMessages((messages) => [
        ...messages,
        { role: "assistant", content: newMessage },
      ]);
      async function readStream() {
        const stream = await reader?.read();
        if (stream?.done) {
          return;
        }
        newMessage += decoder.decode(stream?.value, { stream: true });
        setMessages((messages) => [
          ...messages.slice(0, -1),
          { ...messages[messages.length - 1], content: newMessage },
        ]);
        await readStream();
      }
      // Start the stream reading
      readStream().then(() => {});
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputContent(value);

    // 如果输入内容有效，隐藏提示信息
    if (value.trim()) {
      setShowTooltip(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // 阻止默认换行行为

      // 如果输入内容为空或只包含换行符
      if (!inputContent.trim()) {
        setShowTooltip(true); // 显示提示信息
        setTimeout(() => setShowTooltip(false), 3000); // 3秒后隐藏提示信息
      } else {
        handleSubmit(); // 否则，触发发送逻辑
      }
    }
  };

  return (
      <>
        <div className="bottom-7 w-full z-30">
          <div className="flex items-center justify-center w-full p-5">
            {/* 输入区域容器 */}
            <div className="flex items-end w-full relative">
              {/* 文本输入框 */}
              <textarea
                  ref={textareaRef}
                  className="bg-base-200 dark:bg-gray-700 rounded-xl p-3 w-full resize-none
                  focus-visible:outline-none focus-visible:ring-0 border-2 border-gray-300 dark:border-gray-800 sidebar-scrollable"
                  style={{ paddingRight: "100px" }} // 动态调整 padding-top
                  placeholder="给FinerSeek发送消息"
                  value={inputContent}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  rows={4} // 固定行数为 4 行
              />

              <div className="absolute right-3 bottom-3 flex items-center gap-2">
                <Artifacts />

                {/* 发送按钮 */}
                <div className="group relative inline-block">
                  <button
                      className={`flex items-center justify-center p-2 rounded-full aspect-square transition-all mr-2.5
                      ${
                          inputContent.length === 0 || !inputContent.trim()
                              ? "bg-gray-300 dark:bg-gray-500 cursor-not-allowed" // 禁用状态样式
                              : "bg-blue-300 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-800" // 正常状态样式
                      }`}
                      onClick={handleSubmit}
                      disabled={inputContent.length === 0 || !inputContent.trim()} // 禁用按钮
                  >
                    <IconArrowUp
                        className={`size-[1.3rem] transition-colors ${
                            inputContent.length === 0 || !inputContent.trim() ? "text-gray-100" : "text-white" // 动态设置图标颜色
                        }`}
                    />
                  </button>
                  {/* 提示信息 */}
                  {showTooltip && (
                      <div
                          className="absolute bottom-full left-1/2 transform -translate-y-1/4 -translate-x-1/2 px-3 py-1 bg-base-content text-white text-sm rounded whitespace-nowrap z-30"
                      >
                        请输入你的问题
                      </div>
                  )}
                  {inputContent.length === 0 && (
                      <div
                          className="absolute bottom-full left-1/2 transform -translate-y-1/4 -translate-x-1/2 px-3 py-1 bg-base-content text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30"
                      >
                        请输入你的问题
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
}