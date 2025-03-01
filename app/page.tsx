import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
      <Link href="/api/py/hello">
        前往后端<code className="font-mono font-bold">api/index.py</code>
      </Link>
      <Link href="/app/chatbot">
        前往前端chatbot部分
        <code className="font-mono font-bold">app/app/chatbot</code>
      </Link>
      <Link href="/app/artifacts">
        前往前端artifacts部分
        <code className="font-mono font-bold">app/app/artifacts</code>
      </Link>
    </div>
  );
}
