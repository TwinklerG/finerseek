import { ArrowUpIcon } from "@radix-ui/react-icons";

export function Input() {
  return (
    <>
      <textarea className="w-full h-[80%]"></textarea>
      <div className="flex items-center justify-end">
        <button>
          <ArrowUpIcon />
        </button>
      </div>
    </>
  );
}
