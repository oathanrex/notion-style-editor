'use client';

import React from 'react';
import { Clock, Volume2, BookOpen, Zap } from 'lucide-react';
import { TextStats } from '../utils/textAnalyzer';

interface ReadingTimeProps {
    stats: TextStats;
}

export const ReadingTime: React.FC<ReadingTimeProps> = ({ stats }) => {
    const { readingTime, speakingTime, wordCount } = stats;

    // Calculate progress for visual indicator
    const getReadingLevel = (words: number): { level: string; color: string; progress: number } => {
        if (words < 300) {
            return { level: 'Quick Read', color: 'text-green-600', progress: 25 };
        } else if (words < 1000) {
            return { level: 'Short Article', color: 'text-blue-600', progress: 50 };
        } else if (words < 2000) {
            return { level: 'Medium Article', color: 'text-purple-600', progress: 75 };
        } else {
            return { level: 'Long Form', color: 'text-orange-600', progress: 100 };
        }
    };

    const readingLevel = getReadingLevel(wordCount);

    return (
        <div className="space-y-4">
            {/* Main Reading Time Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Clock className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-medium text-blue-900">Reading Time</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${readingLevel.color} bg-white/80`}>
                        {readingLevel.level}
                    </span>
                </div>

                <div className="text-3xl font-bold text-blue-900 mb-1">
                    {readingTime.text}
                </div>

                <div className="text-sm text-blue-700">
                    ~{readingTime.minutes > 0 ? `${readingTime.minutes}m ${readingTime.seconds}s` : `${readingTime.seconds}s`} at 200 wpm
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                        style={{ width: `${Math.min(readingLevel.progress, 100)}%` }}
                    />
                </div>
            </div>

            {/* Speaking Time Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-purple-100 rounded">
                        <Volume2 className="w-3.5 h-3.5 text-purple-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">Speaking Time</span>
                </div>
                <div className="text-xl font-bold text-gray-800">
                    {speakingTime.minutes > 0
                        ? `${speakingTime.minutes}m ${speakingTime.seconds}s`
                        : `${speakingTime.seconds}s`
                    }
                </div>
                <div className="text-xs text-gray-500 mt-1">
                    At average speaking pace (130 wpm)
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <BookOpen className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-800">
                        {Math.ceil(wordCount / 250)}
                    </div>
                    <div className="text-xs text-gray-500">Pages (250 wpg)</div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
                    <Zap className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-800">
                        {Math.round(wordCount / Math.max(stats.sentenceCount, 1))}
                    </div>
                    <div className="text-xs text-gray-500">Words/Sentence</div>
                </div>
            </div>
        </div>
    );
};

export default ReadingTime;
