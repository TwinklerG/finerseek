import { historys } from "@/lib/placeholders-data";
import clsx from "clsx";
import { Dispatch, memo, SetStateAction } from "react";

const PureSieBar = ({
  hide,
  id,
  setId,
}: {
  hide: boolean;
  id: number;
  setId: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div
      className={clsx(
        "bg-slate-200 dark:bg-gray-800 max-h-full transition-all duration-300 flex flex-col overflow-hidden",
        hide ? "w-0" : "w-[25vw]"
      )}
    >
      <div className="w-full p-4">
        <div
          className="bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg hover:shadow-xl transition-all hover:translate-x-0.5 hover:translate-y-0.5 rounded-md p-4 hover:cursor-pointer text-center "
          onClick={() => {
            setId(-1);
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
              className="bg-sky-200 dark:bg-sky-800 rounded-md translate-x-0.5 translate-y-0.5 hover:cursor-pointer h-10 p-2 m-2 text-center shadow-md"
            >
              {history}
            </li>
          ) : (
            <li
              key={index}
              className="bg-sky-200 hover:bg-sky-300 dark:bg-sky-600 dark:hover:bg-sky-700  rounded-md shadow-md hover:translate-x-0.5 hover:translate-y-0.5 hover:cursor-pointer transition-all h-10 p-2 m-2 text-center"
              onClick={() => {
                setId(index);
              }}
            >
              {history}
            </li>
          )
        )}
      </ul>
    </div>
  );
};

export const Sidebar = memo(PureSieBar, (prevProps, nextProps) => {
  return prevProps === nextProps;
});
