import React, { useRef } from "react";

export function Artifacts() {
  const artifactsRef = useRef(null);

  return (
    <div className="w-full ">
      <label htmlFor="upload-artifact">
        <div onClick={() => {}}>
            <div className="group relative inline-block">
                {/* 上传文件按钮 */}
                <label
                    className="flex items-center justify-center p-2 rounded-full bg-base-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    htmlFor="file-upload" // 关联文件输入框
                >
                    <span className="icon-[tabler--paperclip] text-base-content dark:text-white size-[1.3rem]"></span>
                </label>
                <div
                    className="absolute bottom-full left-0 transform -translate-x-1/4 -translate-y-1/4 px-3 py-1 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                    上传附件
                </div>
            </div>
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
