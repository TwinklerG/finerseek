"use client";

import { Messages } from "@/components/messages";
import NavigationMenuDemo from "@/components/navigation-menu";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export default function Page() {
  const [hideSidebar, setHideSidebar] = useState(false);
  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="bg-blue-500">实时资讯</div>
      <div className="h-full w-full flex">
        <Sidebar hide={hideSidebar} />
        <div className="relative flex flex-col w-full">
          {hideSidebar ? (
            <ArrowRightIcon
              className="absolute top-0 left-0 z-20 hover:cursor-pointer"
              onClick={() => {
                setHideSidebar(false);
              }}
            />
          ) : (
            <ArrowLeftIcon
              className="absolute top-0 left-0 z-20 hover:cursor-pointer"
              onClick={() => {
                setHideSidebar(true);
              }}
            />
          )}
          <NavigationMenuDemo />
          <Messages />
        </div>
      </div>
    </div>
  );
}
