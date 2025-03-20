import "./style.css";
import { useState, useEffect } from 'react';

const fetchData = [
    { name: '原油', value: 79.16, change: 0.73 },
    { name: '黄金', value: 2049.6, change: -0.09 },
    { name: '北证50', value: 809.702, change: -0.58 },
    { name: 'EURUSD', value: 1.0767, change: 0.12 },
    { name: 'USDCNY', value: 7.1049, change: -0.05 },
    { name: '恒生指数', value: 16081.89, change: -0.34 },
    { name: '标普500', value: 4954.23, change: 0.23 },
];

export const TopBar = ({ isTopBarOpen }: {
    isTopBarOpen: boolean;
}) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // 定时切换
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev === 0 ? 1 : 0));
        }, 5000); // 每5秒切换一次

        return () => clearInterval(interval); // 清除定时器
    }, []);

    // 手动切换
    const handleTabChange = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <div className="flex flex-col">
            {/* 顶栏内容 */}
            <div
                className={`transition-all duration-300 ease-in-out ${isTopBarOpen ? 'max-h-96' : 'max-h-0'}`}
            >
                <div className="flex items-center justify-between p-2 bg-white dark:bg-custom-gray w-full">
                    {/* 内容区域 */}
                    <div className="carousel w-full max-w-4xl mx-auto">
                        {/* 实时资讯 */}
                        <div
                            id="slide1"
                            className={`carousel-item relative w-full ${activeIndex === 0 ? 'block' : 'hidden'}`}
                        >
                            <div className="stats">
                                {fetchData.map((item, index) => (
                                    <div className="stat" key={index}>
                                        <div className="stat-title">{item.name}</div>
                                        <div className="stat-value">{item.value}</div>
                                        <div className={`stat-desc ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {item.change > 0 ? '↗︎' : '↘︎'} {Math.abs(item.change)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* 新闻资讯 */}
                        <div
                            id="slide2"
                            className={`carousel-item relative w-full ${activeIndex === 1 ? 'block' : 'hidden'}`}
                        >
                            <div className="stats stats-horizontal w-full">
                                <div className="stat">
                                    <div className="stat-title">新闻资讯</div>
                                    <div className="stat-value">内容</div>
                                    <div className="stat-desc">2023-10-01</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 导航按钮 */}
                <nav className="tabs tabs-bordered justify-center mt-0 mb-1" aria-label="Tabs" role="tablist">
                    <button
                        type="button"
                        role="tab"
                        className={`tab ${activeIndex === 0 ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange(0)}
                        aria-selected={activeIndex === 0}
                        aria-controls="tabpanel-0" // 关联的 tabpanel 的 id
                        id="tab-0" // 当前 tab 的 id
                    >
                    </button>
                    <button
                        type="button"
                        role="tab"
                        className={`tab ${activeIndex === 1 ? 'tab-active' : ''}`}
                        onClick={() => handleTabChange(1)}
                        aria-selected={activeIndex === 1}
                        aria-controls="tabpanel-1" // 关联的 tabpanel 的 id
                        id="tab-1" // 当前 tab 的 id
                    >
                    </button>
                </nav>
            </div>
        </div>
    );
};