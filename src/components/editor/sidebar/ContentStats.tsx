'use client';

import React from 'react';
import {
    FileText,
    Type,
    AlignLeft,
    Hash,
    Link,
    Image,
    Heading,
} from 'lucide-react';
import { TextStats } from '../utils/textAnalyzer';

interface ContentStatsProps {
    stats: TextStats;
}

export const ContentStats: React.FC<ContentStatsProps> = ({ stats }) => {
    const statItems = [
        {
            icon: Type,
            label: 'Characters',
            value: stats.characterCount.toLocaleString(),
            subValue: `${stats.characterCountNoSpaces.toLocaleString()} without spaces`,
            color: 'text-blue-600 bg-blue-100',
        },
        {
            icon: FileText,
            label: 'Words',
            value: stats.wordCount.toLocaleString(),
            color: 'text-emerald-600 bg-emerald-100',
        },
        {
            icon: AlignLeft,
            label: 'Sentences',
            value: stats.sentenceCount.toLocaleString(),
            color: 'text-purple-600 bg-purple-100',
        },
        {
            icon: Hash,
            label: 'Paragraphs',
            value: stats.paragraphCount.toLocaleString(),
            color: 'text-orange-600 bg-orange-100',
        },
    ];

    return (
        <div className="space-y-4">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <div className={`p-1 rounded ${item.color}`}>
                                <item.icon className="w-3 h-3" />
                            </div>
                            <span className="text-xs text-gray-500">{item.label}</span>
                        </div>
                        <div className="text-lg font-bold text-gray-800">{item.value}</div>
                        {item.subValue && (
                            <div className="text-xs text-gray-400 mt-0.5">{item.subValue}</div>
                        )}
                    </div>
                ))}
            </div>

            {/* Structure Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <Heading className="w-4 h-4" />
                    Content Structure
                </h4>

                <div className="space-y-2">
                    {/* Headings */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Headings</span>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                H2: {stats.headingCount.h2}
                            </span>
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                                H3: {stats.headingCount.h3}
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                            <Link className="w-3 h-3" />
                            Links
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-xs">
                                Internal: {stats.linkCount.internal}
                            </span>
                            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">
                                External: {stats.linkCount.external}
                            </span>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-1">
                            <Image className="w-3 h-3" />
                            Images
                        </span>
                        <span className="font-medium text-gray-800">{stats.imageCount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentStats;
