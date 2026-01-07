'use client';

import React, { useState } from 'react';
import {
    Copy,
    Check,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    AlertCircle,
    Zap,
    Layout,
} from 'lucide-react';

interface CopyInstructionsProps {
    className?: string;
}

const SCRIPT_TAG = `<script src="https://cdn.jsdelivr.net/gh/oathanrex/script@v1.0.0/widget.js"></script>`;

export const CopyInstructions: React.FC<CopyInstructionsProps> = ({ className = '' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyScriptTag = async () => {
        try {
            await navigator.clipboard.writeText(SCRIPT_TAG);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className={`bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 overflow-hidden ${className}`}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 rounded-lg">
                        <Zap className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="font-bold text-purple-900">Widget.js Setup</h3>
                        <p className="text-sm text-purple-600">One-time installation for Blogger</p>
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-purple-600" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-purple-600" />
                )}
            </button>

            {/* Expanded Content */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Script Tag Box */}
                    <div className="bg-gray-900 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400 font-medium">SCRIPT TAG</span>
                            <button
                                onClick={copyScriptTag}
                                className={`
                  flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all
                  ${copied
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                    }
                `}
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3" />
                                        Copy
                                    </>
                                )}
                            </button>
                        </div>
                        <code className="text-sm text-green-400 break-all font-mono">
                            {SCRIPT_TAG}
                        </code>
                    </div>

                    {/* Steps */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-purple-900 flex items-center gap-2">
                            <Layout className="w-4 h-4" />
                            Installation Steps
                        </h4>

                        <div className="space-y-2">
                            {[
                                {
                                    step: 1,
                                    title: 'Open Blogger Dashboard',
                                    desc: 'Go to your Blogger account and select your blog',
                                },
                                {
                                    step: 2,
                                    title: 'Navigate to Theme',
                                    desc: 'Click on "Theme" in the left sidebar',
                                },
                                {
                                    step: 3,
                                    title: 'Edit HTML',
                                    desc: 'Click the dropdown arrow next to "Customize" → "Edit HTML"',
                                },
                                {
                                    step: 4,
                                    title: 'Find </body> tag',
                                    desc: 'Press Ctrl+F and search for </body>',
                                },
                                {
                                    step: 5,
                                    title: 'Paste the script',
                                    desc: 'Add the script tag just BEFORE the </body> tag',
                                },
                                {
                                    step: 6,
                                    title: 'Save theme',
                                    desc: 'Click the save icon (💾) to save changes',
                                },
                            ].map((item) => (
                                <div
                                    key={item.step}
                                    className="flex gap-3 p-2 rounded-lg hover:bg-white/50 transition-colors"
                                >
                                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                                        {item.step}
                                    </div>
                                    <div>
                                        <div className="font-medium text-purple-900 text-sm">{item.title}</div>
                                        <div className="text-xs text-purple-600">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Note */}
                    <div className="flex items-start gap-2 p-3 bg-amber-100 rounded-lg border border-amber-200">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-800">
                            <strong>Important:</strong> You only need to add the script tag once.
                            After installation, just paste the generated HTML content directly into your blog posts.
                        </div>
                    </div>

                    {/* CDN Link */}
                    <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                        <span className="text-sm text-purple-700">Hosted on jsDelivr CDN</span>
                        <a
                            href="https://cdn.jsdelivr.net/gh/oathanrex/script@v1.0.0/widget.js"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1 font-medium"
                        >
                            View Script <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CopyInstructions;
