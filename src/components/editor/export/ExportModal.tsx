'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import {
    X,
    Code,
    FileJson,
    Settings,
    ChevronDown,
    ChevronUp,
    Sparkles,
    Eye,
} from 'lucide-react';
import { exportContent, downloadAsFile, FullExport } from './ExportManager';
import CopyButton from './CopyButton';
import CopyInstructions from './CopyInstructions';

interface ExportModalProps {
    editor: Editor;
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'html' | 'preview' | 'json';

export const ExportModal: React.FC<ExportModalProps> = ({ editor, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('html');
    const [exportResult, setExportResult] = useState<FullExport | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    // Export options
    const [includeTOC, setIncludeTOC] = useState(true);
    const [tocPosition, setTocPosition] = useState<'top' | 'afterFirstHeading'>('top');
    const [minify, setMinify] = useState(false);

    useEffect(() => {
        if (isOpen && editor) {
            const result = exportContent(editor, {
                format: 'html',
                includeTOC,
                tocPosition,
                minify,
            });
            setExportResult(result);
        }
    }, [isOpen, editor, includeTOC, tocPosition, minify]);

    if (!isOpen || !exportResult) return null;

    const handleDownload = (content: string, extension: string) => {
        const filename = `blogger-post-${Date.now()}.${extension}`;
        const mimeType = extension === 'json' ? 'application/json' : 'text/html';
        downloadAsFile(content, filename, mimeType);
    };

    const getTabContent = (): string => {
        switch (activeTab) {
            case 'html':
                return exportResult.html;
            case 'json':
                return JSON.stringify(exportResult.json, null, 2);
            default:
                return exportResult.html;
        }
    };

    const tabs = [
        { id: 'html' as TabType, label: 'HTML Code', icon: Code },
        { id: 'preview' as TabType, label: 'Preview', icon: Eye },
        { id: 'json' as TabType, label: 'JSON', icon: FileJson },
    ];

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">Generate Code</h2>
                                <p className="text-sm text-gray-500">Export your content for Blogger</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 mt-4">
                        <div className="px-3 py-1.5 bg-white rounded-full border border-blue-200 text-blue-700 text-sm font-medium">
                            📝 {exportResult.stats.wordCount} words
                        </div>
                        <div className="px-3 py-1.5 bg-white rounded-full border border-purple-200 text-purple-700 text-sm font-medium">
                            📑 {exportResult.stats.headings} headings
                        </div>
                        {exportResult.stats.faqs > 0 && (
                            <div className="px-3 py-1.5 bg-white rounded-full border border-amber-200 text-amber-700 text-sm font-medium">
                                ❓ {exportResult.stats.faqs} FAQs
                            </div>
                        )}
                        {exportResult.stats.ctas > 0 && (
                            <div className="px-3 py-1.5 bg-white rounded-full border border-emerald-200 text-emerald-700 text-sm font-medium">
                                📢 {exportResult.stats.ctas} CTAs
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content - Two Column Layout */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Column - Code/Preview */}
                    <div className="flex-1 flex flex-col border-r border-gray-200">
                        {/* Options Toggle */}
                        <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                            <button
                                onClick={() => setShowOptions(!showOptions)}
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
                            >
                                <Settings className="w-4 h-4" />
                                Export Options
                                {showOptions ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {showOptions && (
                                <div className="mt-3 flex flex-wrap gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={includeTOC}
                                            onChange={(e) => setIncludeTOC(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Include TOC</span>
                                    </label>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-600">Position:</span>
                                        <select
                                            value={tocPosition}
                                            onChange={(e) => setTocPosition(e.target.value as 'top' | 'afterFirstHeading')}
                                            disabled={!includeTOC}
                                            className="text-sm border border-gray-300 rounded px-2 py-1 disabled:opacity-50"
                                        >
                                            <option value="top">Top</option>
                                            <option value="afterFirstHeading">After First Heading</option>
                                        </select>
                                    </div>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={minify}
                                            onChange={(e) => setMinify(e.target.checked)}
                                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="text-sm text-gray-700">Minify</span>
                                    </label>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                    flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors
                    ${activeTab === tab.id
                                            ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                        }
                  `}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 overflow-auto bg-gray-50 p-4">
                            {activeTab === 'preview' ? (
                                <div
                                    className="prose max-w-none bg-white p-8 rounded shadow-sm border border-gray-200"
                                    dangerouslySetInnerHTML={{ __html: exportResult.html }}
                                />
                            ) : (
                                <div className="relative">
                                    <pre className="p-4 bg-gray-900 text-gray-300 rounded-lg text-sm font-mono overflow-auto max-h-[500px]">
                                        {getTabContent()}
                                    </pre>
                                    <button
                                        onClick={() => handleDownload(getTabContent(), activeTab === 'json' ? 'json' : 'html')}
                                        className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                                        title="Download File"
                                    >
                                        <FileJson className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="w-96 bg-gray-50 border-l border-gray-200 p-6 flex flex-col gap-6 overflow-y-auto">
                        {/* Primary Action */}
                        <div className="space-y-4">
                            <CopyButton
                                htmlContent={exportResult.html}
                                variant="full"
                                className="w-full"
                            />

                            {/* Installation Instructions */}
                            <CopyInstructions />

                            {/* Quick Tips */}
                            <div className="bg-white rounded-xl border border-gray-200 p-4">
                                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Quick Tips
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        Widget.js handles all styling automatically
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        TOC is generated from your headings
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        FAQ blocks include SEO schema
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportModal;
