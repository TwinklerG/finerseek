import { ArrowUpIcon } from "@radix-ui/react-icons";
import { ChangeEventHandler, Dispatch, SetStateAction, useState } from "react";

export function ChatInput({
  setMessages,
}: {
  setMessages: Dispatch<SetStateAction<{ role: string; message: string }[]>>;
}) {
  const [inputContent, setInputContent] = useState("");

  // const [fileContent, setFileContent] = useState("");

  // interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
  //   target: HTMLInputElement & EventTarget;
  // }

  // interface FileReaderEvent extends ProgressEvent<FileReader> {
  //   target: FileReader & EventTarget;
  // }

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = () =>
    // event: FileChangeEvent
    {
      // const file = event.target.files?.[0];
      // console.log(event.target.value);
      // if (file) {
      //   const reader = new FileReader();
      //   reader.onload = (e: ProgressEvent<FileReader>) => {
      //     if (e.target) {
      //       setFileContent(e.target.result as string);
      //       console.log(e.target.result);
      //     }
      //   };
      //   reader.readAsText(file);
      // }
    };

  return (
    <>
      <input
        className="w-full h-[80%]"
        value={inputContent}
        onChange={(event) => {
          setInputContent(event.target.value);
        }}
      ></input>
      <div className="flex items-center justify-end ">
        <input type="file" onChange={handleFileChange} />
        <button
          className="hover:bg-slate-500 p-1 rounded-full"
          onClick={() => {
            setMessages((messages) => [
              ...messages,
              { role: "user", message: inputContent },
            ]);
            setInputContent("");
            // Send Messages to backend
            // TODO: CODE HERE
            setTimeout(() => {
              const response = "服务器繁忙，请稍后重试";
              setMessages((messages) => [
                ...messages,
                { role: "assistant", message: response },
              ]);
            }, 1000);
          }}
        >
          <ArrowUpIcon />
        </button>
      </div>
    </>
  );
}
