import clsx from "clsx";
import { redirect, useParams } from "next/navigation";

export function Sidebar({ hide }: { hide: boolean }) {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const historys = [
    "第1条历史记录",
    "第2条历史记录",
    "第3条历史记录",
    "第4条历史记录",
    "第1条历史记录",
    "第2条历史记录",
    "第3条历史记录",
    "第4条历史记录",
    "第1条历史记录",
    "第2条历史记录",
    "第3条历史记录",
    "第4条历史记录",
    "第1条历史记录",
    "第2条历史记录",
    "第3条历史记录",
    "第4条历史记录",
    "第1条历史记录",
    "第2条历史记录",
    "第3条历史记录",
    "第4条历史记录",
    "第1条历史记录",
    "第2条历史记录",
    "第3条历史记录",
    "第4条历史记录",
    "第1条历史记录",
    "第2条历史记录",
    "第3条历史记录",
    "第4条历史记录",
  ];
  return (
    <div
      className={clsx(
        "bg-slate-200 dark:bg-gray-800 max-h-full transition-all ease-in-out duration-300 flex flex-col overflow-hidden",
        hide ? "w-0" : "w-[30vw]"
      )}
    >
      <div className="w-full p-4">
        <div className="bg-gray-600 rounded-md p-4 hover:cursor-pointer" onClick={() => {
          redirect("/app/chatbot")
        }}>
          开启新的对话
        </div>
      </div>
      <ul className="overflow-y-scroll">
        {historys.map((history, index) =>
          id === index ? (
            <li
              key={index}
              className=" bg-gray-600 rounded-md hover:cursor-pointer  h-10 p-2 m-2"
              onClick={() => {
                redirect(`/app/chatbot/${index}`);
              }}
            ></li>
          ) : (
            <li
              key={index}
              className=" bg-gray-500 rounded-md hover:cursor-pointer hover:bg-gray-600 h-10 p-2 m-2"
              onClick={() => {
                redirect(`/app/chatbot/${index}`);
              }}
            >
              {history}
            </li>
          )
        )}
      </ul>
    </div>
  );
}
