import Image from "next/image";

export default function Page() {
  const lst = ["张三", "李氏"];

  return (
    <div className="flex flex-col w-screen h-screen">
      <div className="w-full h-[3vh] flex items-center">
        <div className="rounded-lg border-2">主要交易品种实时行情</div>
      </div>
      <hr></hr>
      <div className="flex flex-row h-[97vh] w-full">
        <div className="bg-slate-400 md:w-[20vw] w-[10vw]  h-full flex flex-col items-center">
          <ul className="p-2 rounded-lg border-2">
            <li>
              <Image alt="logo" src="/next.svg" width={180} height={60} />
            </li>
            <div className="bg-slate-300  items-center justify-center">
              <div className="sm:my-2 my-1 rounded-md p-2">新建对话</div>
            </div>
            {lst.map((item, index) => (
              <li
                key={index}
                className="flex flex-row sm:m-2 m-1 bg-slate-500 rounded-md p-2 hover:cursor-pointer"
              >
                <Image
                  alt="description"
                  src="/file.svg"
                  width={26}
                  height={26}
                />
                <div className="hidden md:block">{item}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full h-full">
          <div className="rounded-lg h-[8vh] flex items-center justify-center">
            多种功能界面Menu
          </div>
          <hr/>
          <div className="w-fulltext-center text-3xl">
            ChatBot
            <div>产品logo及名称(暂未确定)</div>
            <div className="h-[70%]">
              <br />
              <div className="flex justify-center">
                <div className="text-xl rounded-md">示例提示展开对话1</div>
                <div className="text-xl rounded-md">示例提示展开对话2</div>
              </div>
            </div>
            <div className="rounded-lg w-full bg-slate-600">
              <div className="flex">提问框</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
