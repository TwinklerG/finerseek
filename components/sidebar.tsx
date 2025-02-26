import { historys } from "@/lib/placeholders-data";
import clsx from "clsx";
import { Dispatch, memo, SetStateAction } from "react";
import { useWindowSize } from "./hooks/use-window-size";
import './style.css';

const PureSieBar = ({
  hide,
  setHide,
  id,
  setId,
}: {
  hide: boolean;
  setHide: Dispatch<SetStateAction<boolean>>;
  id: number;
  setId: Dispatch<SetStateAction<number>>;
}) => {
  const windowSize = useWindowSize();

  return (
    <div
      className={clsx(
        "bg-slate-200 dark:bg-gray-800 max-h-full transition-all duration-300 flex flex-col",
        hide
          ? "sidebar-hidden" // 使用新的样式
          : windowSize.width < 768
          ? "absolute w-full z-10 left-0 top-0"
          : "w-[25%]"
      )}
    >
      {hide ? (
        // 当 hide 为 true 时显示的内容
        <div className="flex items-center justify-center h-full">
          
          <div
              className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg hover:shadow-xl transition-all hover:translate-x-0.5 hover:translate-y-0.5 rounded-md p-4 hover:cursor-pointer text-center"
              onClick={() => {
                setId(-1);
                if (windowSize.width < 768) {
                  setHide(true);
                }
              }}
            >
 
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  {/* 加号的水平线 */}
  <line x1="3" y1="7.5" x2="12" y2="7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  {/* 加号的垂直线 */}
  <line x1="7.5" y1="3" x2="7.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg></div>
        </div>
      ) : (
        // 当 hide 为 false 时显示的完整内容
        <>
          <div style={{ fontSize: '2em', paddingLeft: '20px' }}>FinerSeek</div>
          <div style={{ fontSize: '0.5em', paddingLeft: '20px' }}>Build your better AI financial assistant.</div>
        
          <div className="w-full p-4">
            <div
              className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg hover:shadow-xl transition-all hover:translate-x-0.5 hover:translate-y-0.5 rounded-md p-4 hover:cursor-pointer text-center"
              onClick={() => {
                setId(-1);
                if (windowSize.width < 768) {
                  setHide(true);
                }
              }}
            >
              开启新的对话
            </div>
          </div>
          <ul className="overflow-y-scroll">
            {historys.map((history, index) =>
              id === index ? (
                <li
                  key={index}
                  className="bg-sky-200 dark:bg-sky-800 rounded-md overflow-hidden translate-x-0.5 translate-y-0.5 hover:cursor-pointer h-10 p-2 m-2 text-center shadow-md"
                >
                  {history}
                </li>
              ) : (
                <li
                  key={index}
                  className="bg-white hover:bg-sky-300 dark:bg-custom-gray overflow-hidden dark:hover:bg-sky-700 rounded-md shadow-md hover:translate-x-0.5 hover:translate-y-0.5 hover:cursor-pointer transition-all h-10 p-2 m-2 text-center"
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
        </>
      )}
    </div>
  );
};

export const Sidebar = memo(PureSieBar, (prevProps, nextProps) => {
  return prevProps === nextProps;
});
