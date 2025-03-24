import React, { useState } from "react";

export function Artifacts() {

    const [files, setFiles] = useState([]);

    return (
        <div>
            <div className="group relative inline-block">
                <label
                    className="flex items-center justify-center p-2 rounded-full bg-base-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-800 cursor-pointer transition-all"
                    htmlFor="upload-artifact" // 关联文件输入框
                >
                    <span className="icon-[tabler--paperclip] text-base-content dark:text-white size-[1.3rem]"></span>
                </label>
                <div
                    className="absolute bottom-full left-0 transform -translate-x-1/4 -translate-y-1/4 px-3 py-1 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30"
                >
                    上传附件
                </div>
            </div>

            {/* 文件输入框 */}
            <input
                // ref={artifactsRef}
                id="upload-artifact"
                type="file"
                className="hidden"
                value={files}
                onChange={async (event) => {
                    const files = event.target.files;
                    if (!files) {
                        return;
                    }
                    const formData = new FormData();
                    formData.append("file", files[0]);
                    // fetch("http://localhost:3000/api/upload", {
                    //     method: "POST",
                    //     body: formData
                    // }).then(res => {
                    //     console.log(res);
                    // }).catch(err => {
                    //     console.log(err)
                    // })
                    fetch("http://localhost:3000/api/py/chat/upload", {
                        method: "POST",
                        body: formData
                    }).then(res => {
                        alert("文档上传编码 成功")
                        console.log(res);
                    }).catch(err => {
                        console.log(err)
                    })
                    setFiles([]);
                }}
            />
        </div>
    );
}