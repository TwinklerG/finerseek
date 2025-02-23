import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";

export function ChatInput({
  messages,
  setMessages,
}: {
  messages: { role: string; content: string }[];
  setMessages: Dispatch<SetStateAction<{ role: string; content: string }[]>>;
}) {
  const [inputContent, setInputContent] = useState("");

  const handleSubmit = () => {
    setMessages((messages) => [
      ...messages,
      { role: "user", content: inputContent },
    ]);
    setInputContent("");
    const options = {
      method: "POST",
      headers: {
        // Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
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

  return (
    <>
      <input
        className="w-full h-[70%] text-center"
        value={inputContent}
        onChange={(event) => {
          setInputContent(event.target.value);
        }}
        onKeyDown={(event) => {
          console.log(inputContent);
          if (event.key === "Enter") {
            if (event.shiftKey === false) {
              handleSubmit();
            }
          }
        }}
      ></input>
      <div className="flex items-center justify-end ">
        <button
          className="bg-slate-300 hover:bg-slate-500 p-1 m-1 rounded-full transition-all"
          onClick={handleSubmit}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </>
  );
}
