"use client";

import { useWindowSize } from "@/components/hooks/use-window-size";
import { Messages } from "@/components/messages";
import { Sidebar } from "@/components/sidebar";
import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { Suspense, useState } from "react";

export default function Page() {
  const windowSize = useWindowSize();
  const [hideSidebar, setHideSidebar] = useState(windowSize.width < 768);
  const [id, setId] = useState(-1);

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="bg-blue-200 dark:bg-blue-600 h-[4vh] text-center">
        实时资讯
      </div>
      <div className={clsx("h-[96vh] w-full flex relative")}>
        <Sidebar
          hide={hideSidebar}
          setHide={setHideSidebar}
          id={id}
          setId={setId}
        />
        <div
          className={clsx(
            "bg-slate-200 dark:bg-gray-800 h-full relative flex flex-col w-full"
          )}
        >
          <div className="flex h-[10%]">
            <div
              className="bg-slate-300 hover:bg-slate-400 dark:bg-gray-900 dark:hover:bg-gray-950 hover:cursor-pointer my-4 mx-5 p-2 transition-all flex items-center justify-center rounded-full"
              onClick={() => {
                setHideSidebar(!hideSidebar);
              }}
            >
              {hideSidebar ? <ArrowRightIcon /> : <ArrowLeftIcon />}
            </div>
            <div
              className={clsx(
                windowSize.width < 768 && "hidden",
                "text-2xl flex items-center justify-center w-full"
              )}
            >
              {["Nav1", "Nav2", "Nav3"].map((navItem, index) => (
                <div
                  key={index}
                  className="px-2 mx-2 bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 hover:cursor-pointer rounded-md transition-all hover:translate-x-0.5 hover:translate-y-0.5"
                >
                  {navItem}
                </div>
              ))}
            </div>
          </div>
          <Suspense fallback={<></>}>
            <Messages id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
