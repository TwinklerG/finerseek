import "./style.css";
import { useWindowSize } from "./hooks/use-window-size";
import React, { Dispatch, SetStateAction } from "react";
import { useState, useEffect, useRef } from 'react';
import {IconSettings, IconSend, IconTrash, IconLogin, IconLogout, IconUser} from "@tabler/icons-react";

export const TopBarBtn = ({ isTopBarOpen, setIsTopBarOpen }: {
    isTopBarOpen: boolean;
    setIsTopBarOpen: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <div className="flex justify-center w-full p-1 bg-white dark:bg-custom-gray">
            {isTopBarOpen ? (
                // 顶栏展开时显示收起按钮
                <div className="flex justify-center w-full p-0 bg-white dark:bg-custom-gray hover:bg-base-200 dark:hover:bg-gray-800" onClick={() => setIsTopBarOpen(false)}>
                    <span className="icon-[tabler--chevron-compact-up] text-base-content size-[1.375rem]"></span>
                </div>
            ) : (
                // 顶栏收起时显示展开按钮
                <div className="flex justify-center w-full p-0 bg-white dark:bg-custom-gray hover:bg-base-200 dark:hover:bg-gray-800" onClick={() => setIsTopBarOpen(true)}>
                    <span className="icon-[tabler--chevron-compact-down] text-base-content size-[1.375rem]"></span>
                </div>
            )}
        </div>
    );
}

export const NewDialogBtn1 = ({setId, setHide,}:{
    setId: Dispatch<SetStateAction<number>>;
    setHide: Dispatch<SetStateAction<boolean>>;
}) => {
    const windowSize = useWindowSize();
    return (
        <div className="group relative inline-block">
            {/*<div*/}
            {/*    className="bg-gray-400 hover:bg-gray-500 dark:bg-blue-700 dark:hover:bg-blue-800 shadow-lg hover:shadow-xl transition-all hover:translate-x-0.5 hover:translate-y-0.5 rounded-md p-2 mb-5 hover:cursor-pointer text-center"*/}
            {/*    onClick={() => {*/}
            {/*        setId(-1); // 新建对话的逻辑*/}
            {/*        if (windowSize.width < 768) {*/}
            {/*            setHide(true); // 如果是移动端，收起侧栏*/}
            {/*        }*/}
            {/*    }}*/}
            {/*>*/}
            <button id="dropdown-scrollable" type="button"
                    className="dropdown-toggle btn btn-circle btn-text dropdown-open:bg-base-content/10 size-10"
                    onClick={() => {
                        setId(-1); // 新建对话的逻辑
                        if (windowSize.width < 768) {
                            setHide(true); // 如果是移动端，收起侧栏
                        }
                    }}>
                <span className="icon-[tabler--message-plus] text-base-content size-[1.375rem]"></span>
            </button>
            {/*</div>*/}
            <div
                className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 px-4 py-2 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                开启新对话
            </div>
        </div>
    )
}

export const NewDialogBtn2 = ({setId, setHide,}:{
    setId: Dispatch<SetStateAction<number>>;
    setHide: Dispatch<SetStateAction<boolean>>;
}) => {
    const windowSize = useWindowSize();
    return (
        <div className="w-full p-4 ">
            <ul className="menu p-2 items-center bg-white dark:bg-custom-gray">
                <li className="bg-base-200 dark:bg-gray-700 rounded-md shadow overflow-hidden text-base-content dark:text-white">
                    <a href="#">
                        <span className="icon-[tabler--message-plus] size-5 justify-center"
                              onClick={() => {
                                  setId(-1);
                                  if (windowSize.width < 768) {
                                      setHide(true);
                                  }
                              }}></span>
                        开启新对话
                    </a>
                </li>
            </ul>
        </div>
    )
}

export const OpenSidebarBtn = ({setHide}: { setHide: Dispatch<SetStateAction<boolean>>; }) => {
    return (
        <div className="group relative inline-block p-4">
            <button id="dropdown-scrollable" type="button"
                    className="dropdown-toggle btn btn-text btn-circle dropdown-open:bg-base-content/10 size-10"
                    onClick={() => setHide(false)}>
                <span className="icon-[tabler--layout-sidebar-left-expand] text-base-content size-[1.375rem]"></span>
            </button>
            <div
                className="absolute left-full top-1/2 transform -translate-y-1/2 px-4 py-2 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                展开边栏
            </div>
        </div>
    )
}

export const CloseSidebarBtn = ({setHide}:{
    setHide: Dispatch<SetStateAction<boolean>>;
}) => {
    return (
        <div className="group relative inline-block">
            <button id="dropdown-scrollable" type="button"
                    className="dropdown-toggle btn btn-text btn-circle dropdown-open:bg-base-content/10 size-10"
                    onClick={() => setHide(true)}>
                <span className="icon-[tabler--layout-sidebar-left-collapse] text-base-content size-[1.375rem]"></span>
            </button>
            <div
                className="absolute left-full top-1/4 transform -translate-y-1/4 ml-3 px-4 py-2 bg-base-content dark:bg-gray-700 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-30">
                收起边栏
            </div>
        </div>
    )
}

export const UserBtn1 = ({ isLoggedIn }: {
    isLoggedIn: boolean;
}) => {
    const [showOptions, setShowOptions] = useState(false); // 控制选项栏的显示
    const dropdownRef = useRef<HTMLDivElement>(null); // 选项栏的引用
    const buttonRef = useRef<HTMLButtonElement>(null); // 按钮的引用

    // 点击页面其他位置时关闭选项栏
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            // 如果点击的目标不在选项栏或按钮的范围内
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowOptions(false); // 关闭选项栏
            }
        };

        // 添加点击事件监听器
        document.addEventListener("mousedown", handleClickOutside);

        // 清除事件监听器
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="mt-auto relative inline-flex rtl:[--placement:bottom-end]">
            {/* 按钮 */}
            <button
                ref={buttonRef}
                id="dropdown-footer"
                type="button"
                className="btn btn-text btn-circle"
                popoverTarget="popover-1"
                aria-haspopup="menu"
                onClick={() => setShowOptions(!showOptions)}
            >
                <span className="icon-[tabler--user] text-base-content size-[1.375rem] dropdown-open:rotate-180"></span>
            </button>

            {/* 下拉菜单 */}
            {showOptions && (
                <div
                    ref={dropdownRef}
                    className="absolute bottom-full left-0 mb-2 w-50 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10">
                    {isLoggedIn ? (
                        <ul className="dropdown menu w-32 rounded-box bg-base-100 shadow-sm">
                            <li className="p-1 flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                    <IconUser className="size-5" />
                                    我的个人信息
                                </a>
                            </li>
                            <li className="p-0 flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconTrash className="size-5" />
                                    删除所有对话
                                </a>
                            </li>
                            <li className="p-0 flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconSettings className="size-5" />
                                    设置
                                </a>
                            </li>
                            <li className="p-0 flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconSend className="size-5" />
                                    联系我们
                                </a>
                            </li>
                            <li className="p-0 flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconLogout className="size-5" />
                                    退出登录
                                </a>
                            </li>
                        </ul>
                    ) : (
                        <ul className="dropdown menu w-full rounded-box bg-base-100 shadow-sm">
                            <li className="p-0  flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconTrash className="size-5" />
                                    删除所有对话
                                </a>
                            </li>
                            <li className="p-0  flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconSettings className="size-5" />
                                    设置
                                </a>
                            </li>
                            <li className="p-0  flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconSend className="size-5" />
                                    联系我们
                                </a>
                            </li>
                            <li className="p-0  flex justify-center items-center">
                                <a className="dropdown-item text-gray-800 dark:text-gray-200 flex items-center gap-2 whitespace-nowrap">
                                    <IconLogin className="size-5" />
                                    登录
                                </a>
                            </li>
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};
export const UserBtn2 = ({isLoggedIn }:{
            isLoggedIn: boolean;
            setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
        }) => {
            const [showOptions, setShowOptions] = useState(false);

            return (
            <div className="mt-auto relative w-full p-4">
        {/* 登录按钮 */}

            {isLoggedIn ? (
                <ul className="menu p-2 justify-center items-center bg-white dark:bg-custom-gray">
                    <li className="bg-base-200 dark:bg-gray-700 rounded-md w-[90%] text-base-content dark:text-white">
                        <a href="#">
                                    <span className="icon-[tabler--user] size-5 justify-center"
                                          onClick={() => setShowOptions(!showOptions)}></span>
                            个人信息
                        </a>
                    </li>
                </ul>
            ) : (
                <ul className="menu p-2 items-center bg-white dark:bg-custom-gray">
                    <li className="bg-base-200 dark:bg-gray-700 rounded-md shadow overflow-hidden text-base-content dark:text-white">
                        <a href="#">
                        <span className="icon-[tabler--user] size-5 justify-center"
                              onClick={() => setShowOptions(!showOptions)}></span>
                            登录
                        </a>
                    </li>
                </ul>
            )}
        </div>
    )
}
