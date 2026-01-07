'use client';

import React, { useState, useMemo } from 'react';
import {
    Search,
    Target,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Sparkles,
    BarChart3,
} from 'lucide-react';
import {
    KeywordAnalysis,
    TopKeyword,
    calculateKeywordDensity,
    getTopKeywords,
    getTopPhrases,
    extractTextFromHTML,
} from '../utils/textAnalyzer';

interface KeywordDensityProps {
    html: string;
    focusKeyword: string;
    onFocusKeywordChange: (keyword: string) => void;
}

export const KeywordDensity: React.FC<KeywordDensityProps> = ({
    html,
    focusKeyword,
    onFocusKeywordChange,
}) => {
    const [showTopKeywords, setShowTopKeywords] = useState(true);
    const [showPhrases, setShowPhrases] = useState(false);

    const text = useMemo(() => extractTextFromHTML(html), [html]);

    const keywordAnalysis = useMemo(() => {
        if (!focusKeyword.trim()) return null;
        return calculateKeywordDensity(focusKeyword, text, html);
    }, [focusKeyword, text, html]);

    const topKeywords = useMemo(() => getTopKeywords(text, 8), [text]);
    const topPhrases = useMemo(() => getTopPhrases(text, 5), [text]);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'optimal':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'low':
                return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'high':
                return <AlertTriangle className="w-4 h-4 text-red-500" />;
            default:
                return <XCircle className="w-4 h-4 text-gray-400" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'optimal':
                return 'bg-green-100 border-green-300 text-green-800';
            case 'low':
                return 'bg-amber-100 border-amber-300 text-amber-800';
            case 'high':
                return 'bg-red-100 border-red-300 text-red-800';
            default:
                return 'bg-gray-100 border-gray-300 text-gray-600';
        }
    };

    const getDensityBarWidth = (density: number) => {
        // Optimal range is 1-3%
        const maxDensity = 5;
        return Math.min((density / maxDensity) * 100, 100);
    };

    const getDensityBarColor = (density: number) => {
        if (density === 0) return 'bg-gray-300';
        if (density < 0.5) return 'bg-amber-400';
        if (density <= 3) return 'bg-green-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-4">
            {/* Focus Keyword Input */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-blue-600" />
                        Focus Keyword
                    </div>
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        value={focusKeyword}
                        onChange={(e) => onFocusKeywordChange(e.target.value)}
                        placeholder="Enter your target keyword..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Keyword Analysis Results */}
            {keywordAnalysis && focusKeyword.trim() && (
                <div className={`rounded-lg border p-4 ${getStatusColor(keywordAnalysis.status)}`}>
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            {getStatusIcon(keywordAnalysis.status)}
                            <span className="font-semibold text-sm">
                                "{keywordAnalysis.keyword}"
                            </span>
                        </div>
                        <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded">
                            {keywordAnalysis.status.toUpperCase()}
                        </span>
                    </div>

                    {/* Density Meter */}
                    <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                            <span>Keyword Density</span>
                            <span className="font-bold">{keywordAnalysis.density}%</span>
                        </div>
                        <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getDensityBarColor(keywordAnalysis.density)} transition-all duration-300`}
                                style={{ width: `${getDensityBarWidth(keywordAnalysis.density)}%` }}
                            />
                        </div>
                        <div className="flex justify-between text-xs mt-1 opacity-75">
                            <span>0%</span>
                            <span className="text-green-700">Optimal: 1-3%</span>
                            <span>5%+</span>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-white/50 rounded p-2 text-center">
                            <div className="text-lg font-bold">{keywordAnalysis.count}</div>
                            <div className="text-xs opacity-75">Occurrences</div>
                        </div>
                        <div className="bg-white/50 rounded p-2 text-center">
                            <div className="text-lg font-bold">{keywordAnalysis.prominence}%</div>
                            <div className="text-xs opacity-75">Prominence</div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            {keywordAnalysis.inTitle ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={keywordAnalysis.inTitle ? 'text-green-800' : 'opacity-60'}>
                                In title/H1
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {keywordAnalysis.inFirstParagraph ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={keywordAnalysis.inFirstParagraph ? 'text-green-800' : 'opacity-60'}>
                                In first paragraph
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {keywordAnalysis.inHeadings ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <XCircle className="w-4 h-4 text-gray-400" />
                            )}
                            <span className={keywordAnalysis.inHeadings ? 'text-green-800' : 'opacity-60'}>
                                In subheadings
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {keywordAnalysis.distribution === 'good' ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-amber-500" />
                            )}
                            <span>
                                Distribution: <span className="font-medium">{keywordAnalysis.distribution}</span>
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Keywords */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                    onClick={() => setShowTopKeywords(!showTopKeywords)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-700">Top Keywords</span>
                    </div>
                    {showTopKeywords ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                </button>

                {showTopKeywords && (
                    <div className="border-t border-gray-100 p-3">
                        {topKeywords.length > 0 ? (
                            <div className="space-y-2">
                                {topKeywords.map((kw, index) => (
                                    <div
                                        key={kw.word}
                                        className="flex items-center gap-2 group cursor-pointer"
                                        onClick={() => onFocusKeywordChange(kw.word)}
                                    >
                                        <span className="w-5 h-5 flex items-center justify-center text-xs font-medium text-gray-400">
                                            {index + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700 truncate group-hover:text-blue-600 transition-colors">
                                                    {kw.word}
                                                </span>
                                                <span className="text-xs text-gray-500 ml-2">
                                                    {kw.count}× ({kw.density}%)
                                                </span>
                                            </div>
                                            <div className="h-1 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                                <div
                                                    className="h-full bg-purple-400 rounded-full"
                                                    style={{
                                                        width: `${(kw.count / topKeywords[0].count) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-2">
                                Start typing to see top keywords
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Top Phrases */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                    onClick={() => setShowPhrases(!showPhrases)}
                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-gray-700">Top Phrases</span>
                    </div>
                    {showPhrases ? (
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                </button>

                {showPhrases && (
                    <div className="border-t border-gray-100 p-3">
                        {topPhrases.length > 0 ? (
                            <div className="space-y-2">
                                {topPhrases.map((phrase, index) => (
                                    <div
                                        key={phrase.word}
                                        className="flex items-center justify-between text-sm cursor-pointer hover:bg-gray-50 p-1 rounded"
                                        onClick={() => onFocusKeywordChange(phrase.word)}
                                    >
                                        <span className="text-gray-700">"{phrase.word}"</span>
                                        <span className="text-gray-500">{phrase.count}×</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center py-2">
                                Write more content to see phrases
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default KeywordDensity;
