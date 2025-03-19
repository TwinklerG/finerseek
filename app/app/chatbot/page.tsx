"use client";


import {useWindowSize} from "@/components/hooks/use-window-size";
import {Messages} from "@/components/messages";
import {Sidebar} from "@/components/sidebar";
import clsx from "clsx";
import {Suspense, useState} from "react";

export default function Page() {
  const windowSize = useWindowSize();
  const [hideSidebar, setHideSidebar] = useState(windowSize.width < 768);
  const [isTopBarOpen, setIsTopBarOpen] = useState(true); // 控制顶栏的展开与收起
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [id, setId] = useState(-1);

  return (

      <div className="h-screen w-screen flex flex-col">
        <div className={clsx("h-full w-full flex relative")}>
          {/*  <Sidebar />*/}
          <Sidebar
              hide={hideSidebar}
              setHide={setHideSidebar}
              id={id}
              setId={setId}
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
          />
          <div
              className={clsx(
                  "bg-white dark:bg-custom-gray h-full relative flex flex-col w-full"
              )}
          >
            <Suspense fallback={<></>}>
              <Messages id={id}/>
            </Suspense>
          </div>
        </div>
      </div>
  );
}


