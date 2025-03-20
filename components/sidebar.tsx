import { historys } from "@/lib/placeholders-data";
import clsx from "clsx";
import { Dispatch, memo, SetStateAction } from "react";
import { useWindowSize } from "./hooks/use-window-size";
import {
  NewDialogBtn1,
  NewDialogBtn2,
  OpenSidebarBtn,
  CloseSidebarBtn,
  UserBtn1,
  UserBtn2,
} from "./btn"
import "./style.css";

const PureSieBar = ({
                      hide, setHide, id, setId, isLoggedIn, setIsLoggedIn,
                    }: {
  hide: boolean;
  setHide: Dispatch<SetStateAction<boolean>>;
  id: number;
  setId: Dispatch<SetStateAction<number>>;
  isLoggedIn: boolean;
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}) => {
  const windowSize = useWindowSize();

  return (
      <div
          className={clsx(
              "bg-white dark:bg-custom-gray transition-all duration-300 flex flex-col",
              hide
                  ? "sidebar-hidden" // 使用新的样式
                  : windowSize.width < 768
                      ? "absolute w-full z-10 left-0 top-0"
                      : "w-[25%]",
          )}
      >

        {hide ? (
            // 当 hide 为 true 时显示的内容
            <div className="bg-white dark:bg-custom-gray flex flex-col items-center justify-start h-full p-5">

              <div className="mb-3 mt-2"> {/* 添加 margin-bottom 以与按钮保持间距 */}
                <img
                    src="/finerseek_logo.png"
                    alt="Logo"
                    className="w-10 h-11" // 根据需要调整 Logo 的大小
                />
              </div>

              <OpenSidebarBtn setHide={setHide} />
              <NewDialogBtn1 setHide={setHide} setId={setId} />
              <UserBtn1 isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

            </div>
        ) : (
            // 当 hide 为 false 时显示的完整内容
            <>

              <div className="flex flex-row justify-between items-center p-2 pl-1">
                <div className="title-text">FinerSeek</div>
                <CloseSidebarBtn setHide={setHide} />
              </div>

              <div style={{fontSize: "0.5em", paddingLeft: "20px"}}>
                Build your better AI financial assistant.
              </div>

              <NewDialogBtn2 setHide={setHide} setId={setId} />

              <div className="flex-grow overflow-y-scroll sidebar-scrollable transition-all duration-300 ">
                <ul className="menu p-2 bg-white dark:bg-custom-gray">
                  {historys.map((history, index) =>
                      id === index ? (
                          <li
                              key={index}
                              className="bg-base-200 dark:bg-custom-gray  rounded-md overflow-hidden translate-x-0.5 translate-y-0.5 hover:cursor-pointer dark:hover:border h-10 p-2 m-2 text-center shadow-md"
                          >
                            {history}
                          </li>
                      ) : (
                          <li
                              key={index}
                              className="bg-white hover:bg-base-200 dark:bg-gray-800 text-base-content dark:text-white overflow-hidden dark:hover:bg-custom-gray rounded-md shadow-md hover:translate-x-0.5 hover:translate-y-0.5 hover:cursor-pointer transition-all h-10 p-2 m-2 text-center"
                              onClick={() => {
                                setId(index);
                                if (windowSize.width < 768) {
                                  setHide(true);
                                }
                              }}
                          >
                            {history}
                          </li>
                      )
                  )}
                </ul>
              </div>
              <UserBtn2 isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </>
        )}
      </div>
  );
};

export const Sidebar = memo(PureSieBar, (prevProps, nextProps) => {
  return prevProps === nextProps;
});
