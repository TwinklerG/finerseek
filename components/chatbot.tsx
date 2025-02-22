"use client";

import { Messages } from "@/components/messages";
import NavigationMenuDemo from "@/components/navigation-menu";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { Suspense, useState } from "react";

export function Chatbot() {
  const [hideSidebar, setHideSidebar] = useState(false);
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="bg-blue-500 h-[3vh]">实时资讯</div>
      <div className="h-[97vh] w-full flex">
        <Sidebar hide={hideSidebar} />
        <div className="h-full relative flex flex-col w-full">
          <div
            className="absolute top-0 left-0 z-20 hover:cursor-pointer p-4 hover:bg-gray-800 rounded-md transition-all m-2"
            onClick={() => {
              setHideSidebar(!hideSidebar);
            }}
          >
            {hideSidebar ? <ArrowRightIcon /> : <ArrowLeftIcon />}
          </div>

          <NavigationMenuDemo />
          <Suspense fallback={<></>}>
            <Messages />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
