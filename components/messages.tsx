"use client";

import { useParams } from "next/navigation";

export function Messages() {
  const params = useParams<{ id: string }>();

  return (
    <div className="inline-block w-full h-full p-5">
      <div className="w-full h-[70%] rounded-lg border-2 flex items-center justify-center animate-scaleIn">
        <div className="text-2xl">
          {params.id === undefined
            ? "Welcome to finerseek!"
            : `You are in history record ${params.id}`}
        </div>
      </div>
      <div className="w-full h-[30%] flex items-center justify-center p-2">
        <div className="rounded-lg border-2 w-full h-full text-center">
          <div className="text-2xl">Input your question here</div>
        </div>
      </div>
    </div>
  );
}
