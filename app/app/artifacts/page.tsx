"use client";

import { useState } from "react";

export default function Page() {
  const [files, setFiles] = useState<File[] | null>();

  const handleSubmit = async () => {
    if (files) {
      for (const file of files) {
        const content = await file.arrayBuffer();
        console.log(content);
      }
    }
  };

  return (
    <div className="min-h-screen min-w-full flex items-center justify-center">
      <div className="w-[90%] md:w-2/3 border-2 shadow-md min-h-screen flex flex-col items-center">
        <label
          htmlFor="upload-artifact"
          className="p-1 bg-sky-100 hover:bg-sky-200 transition-all m-1 rounded-md hover:cursor-pointer"
        >
          Upload Artifacts
        </label>
        <input
          type="file"
          className="hidden"
          id="upload-artifact"
          onChange={(event) => {
            if (event.target.files === null) {
              return;
            }
            setFiles((files) => {
              return files
                ? [...files, ...Array.from(event.target.files ?? [])]
                : Array.from(event.target.files ?? []);
            });
          }}
        />
        {files?.map((file, index) => (
          <div key={index}>{file.name}</div>
        ))}
        <button
          className="p-1 rounded-md bg-sky-100 hover:bg-sky-200 transition-all"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
