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
        "bg-slate-200 dark:bg-gray-800 max-h-full transition-all ease-in-out duration-300 flex flex-col overflow-hidden",
        hide ? "w-0" : "w-[30vw]"
      )}
    >
      <div className="w-full p-4">
        <div
          className="bg-gray-600 rounded-md p-4 hover:cursor-pointer"
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
              className=" bg-gray-600 rounded-md hover:cursor-pointer  h-10 p-2 m-2"
            ></li>
          ) : (
            <li
              key={index}
              className=" bg-gray-500 rounded-md hover:cursor-pointer hover:bg-gray-600 h-10 p-2 m-2"
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
