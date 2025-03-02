import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useState } from "react";
import "./style.css";
import { Artifacts } from "./artifacts";
import { Source_Sans_3} from "next/font/google";
const Hei = Source_Sans_3({
  weight: ["400"],
  subsets: ["latin"]
});
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
      <div className="overflow-auto h-full">
        <textarea
          className="bg-white dark:bg-custom-gray rounded-md p-1 w-full h-[70%] focus-visible:outline-none focus-visible:ring-2 border border-gray-300 dark:border-gray-800 focus-visible:border-blue-100"
          value={inputContent}
          onChange={(event) => {
            setInputContent(event.target.value);
          }}
          onKeyDown={(event) => {
            if (
              inputContent.length !== 0 &&
              event.key === "Enter" &&
              event.shiftKey === false
            ) {
              handleSubmit();
              event.preventDefault();
            }
          }}
        ></textarea>

        <div className="flex items-center justify-end h-fit">
          <Artifacts />
          <button
            className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all p-1 m-1 rounded-full"
            onClick={handleSubmit}
          >
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </>
  );
}
