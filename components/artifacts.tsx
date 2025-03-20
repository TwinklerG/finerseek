import React, { useRef} from "react";

export function Artifacts() {
    const artifactsRef = useRef<HTMLInputElement>(null);
    // const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    // const fileContainerRef = useRef<HTMLDivElement>(null);
    //
    // // 监听文件显示区域的高度变化
    // useEffect(() => {
    //     if (fileContainerRef.current) {
    //         const height = fileContainerRef.current.clientHeight;
    //         onHeightChange(height); // 通知父组件高度变化
    //     }
    // }, [uploadedFiles, onHeightChange]);
    //
    // // 处理文件选择
    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const files = event.target.files;
    //     if (files && files.length > 0) {
    //         const selectedFile = files[0];
    //         setUploadedFiles((prevFiles) => [...prevFiles, selectedFile]); // 添加到已上传文件列表
    //     }
    // };

    return (
        // <div className="w-full" ref={fileContainerRef}>
        //     {/* 显示已上传文件 */}
        //     {uploadedFiles.length > 0 && (
        //         <div className="flex flex-wrap gap-2">
        //             {uploadedFiles.map((file, index) => (
        //                 <div
        //                     key={index}
        //                     className="flex items-center bg-base-200 dark:bg-gray-700 rounded-lg p-2"
        //                 >
        //       <span className="text-sm text-base-content dark:text-white">
        //         {file.name} ({Math.round(file.size / 1024)} KB)
        //       </span>
        //                     <button
        //                         onClick={() => {
        //                             setUploadedFiles((prevFiles) =>
        //                                 prevFiles.filter((_, i) => i !== index)
        //                             );
        //                         }}
        //                         className="ml-2 text-red-500 hover:text-red-700"
        //                     >
        //                         ×
        //                     </button>
        //                 </div>
        //             ))}
        //         </div>
        //     )}
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
                ref={artifactsRef}
                id="upload-artifact"
                type="file"
                className="hidden"
                // onChange={handleFileChange}
            />
        </div>
    );
}