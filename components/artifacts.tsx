import { PlusIcon } from "@radix-ui/react-icons";
import { useRef } from "react";

export function Artifacts() {
  const artifactsRef = useRef(null);

  return (
    <div className="w-full bg-blue-100 rounded-md">
      <label htmlFor="upload-artifact">
        <div
          className="w-fit bg-blue-200 hover:bg-blue-300 dark:bg-blue-700 dark:hover:bg-blue-800 transition-all p-1 m-1 rounded-full hover:cursor-pointer"
          onClick={() => {}}
        >
          <PlusIcon />
        </div>
      </label>
      <input
        ref={artifactsRef}
        id="upload-artifact"
        type="file"
        className="hidden"
      />
    </div>
  );
}
