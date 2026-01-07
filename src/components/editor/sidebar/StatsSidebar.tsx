'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
    BarChart3,
    Clock,
    Search,
    ChevronLeft,
    ChevronRight,
    Settings,
    X,
} from 'lucide-react';
import { getTextStats, TextStats } from '../utils/textAnalyzer';
import ContentStats from './ContentStats';
import ReadingTime from './ReadingTime';
import KeywordDensity from './KeywordDensity';

type TabType = 'stats' | 'reading' | 'keywords';

interface StatsSidebarProps {
    html: string;
    isOpen: boolean;
    onToggle: () => void;
}

export const StatsSidebar: React.FC<StatsSidebarProps> = ({
    html,
    isOpen,
    onToggle,
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('stats');
    const [focusKeyword, setFocusKeyword] = useState('');

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Calculate stats whenever HTML changes
    const stats = useMemo<TextStats>(() => {
        if (!isMounted) {
            // Return default stats for SSR and first client render to match server
            return {
                characterCount: 0,
                characterCountNoSpaces: 0,
                wordCount: 0,
                sentenceCount: 0,
                paragraphCount: 0,
                readingTime: { minutes: 0, seconds: 0, text: '0 min read' },
                speakingTime: { minutes: 0, seconds: 0, text: '0s speaking' },
                headingCount: { h1: 0, h2: 0, h3: 0, total: 0 },
                linkCount: { internal: 0, external: 0, total: 0 },
                imageCount: 0,
            };
        }
        return getTextStats(html);
    }, [html, isMounted]);

    const tabs = [
        { id: 'stats' as TabType, label: 'Stats', icon: BarChart3 },
        { id: 'reading' as TabType, label: 'Reading', icon: Clock },
        { id: 'keywords' as TabType, label: 'Keywords', icon: Search },
    ];

    return (
        <>
            {/* Toggle Button (when sidebar is closed) */}
            {!isOpen && (
                <button
                    onClick={onToggle}
                    className="fixed right-0 top-1/2 -translate-y-1/2 z-40
                   bg-white border border-r-0 border-gray-200 rounded-l-lg
                   p-2 shadow-lg hover:bg-gray-50 transition-colors"
                    title="Open Stats Sidebar"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`
          fixed right-0 top-0 h-full bg-gray-50 border-l border-gray-200 
          shadow-xl z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
                style={{ width: '340px' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-600" />
                        Content Analysis
                    </h2>
                    <button
                        onClick={onToggle}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Quick Stats Bar */}
                <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-700 font-medium">
                            {stats.wordCount.toLocaleString()} words
                        </span>
                        <span className="text-blue-600">
                            {stats.readingTime.text}
                        </span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 bg-white">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`
                flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-medium
                transition-colors border-b-2 -mb-px
                ${activeTab === tab.id
                                    ? 'text-blue-600 border-blue-600 bg-blue-50/50'
                                    : 'text-gray-500 border-transparent hover:text-gray-700 hover:bg-gray-50'
                                }
              `}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-y-auto p-4" style={{ height: 'calc(100vh - 180px)' }}>
                    {activeTab === 'stats' && <ContentStats stats={stats} />}
                    {activeTab === 'reading' && <ReadingTime stats={stats} />}
                    {activeTab === 'keywords' && (
                        <KeywordDensity
                            html={html}
                            focusKeyword={focusKeyword}
                            onFocusKeywordChange={setFocusKeyword}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 px-4 py-2 bg-white border-t border-gray-200">
                    <div className="text-xs text-gray-400 text-center">
                        Stats update as you type
                    </div>
                </div>
            </div>
        </>
    );
};

export default StatsSidebar;
