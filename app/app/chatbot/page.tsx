"use client";

import { Messages } from "@/components/messages";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Suspense, useState } from "react";

export default function Page() {
  const [hideSidebar, setHideSidebar] = useState(false);
  const [id, setId] = useState(-1);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="bg-blue-500 h-[3vh]">实时资讯</div>
      <div className="h-[97vh] w-full flex">
        <Sidebar hide={hideSidebar} id={id} setId={setId} />
        <div className="h-full relative flex flex-col w-full">
          <div className="flex h-[10%]">
            <div
              className="hover:cursor-pointer hover:bg-gray-800 rounded-md transition-all m-2 p-2"
              onClick={() => {
                setHideSidebar(!hideSidebar);
              }}
            >
              {hideSidebar ? <ArrowRightIcon /> : <ArrowLeftIcon />}
            </div>
            <div className="text-2xl">This is Menu</div>
          </div>
          <Suspense fallback={<></>}>
            <Messages id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
