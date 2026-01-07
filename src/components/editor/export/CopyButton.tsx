'use client';

import React, { useState, useCallback } from 'react';
import {
    Copy,
    Check,
    Code,
    FileText,
    Layers,
    ChevronDown,
    ExternalLink,
    Info,
    Clipboard,
    Package,
} from 'lucide-react';

interface CopyButtonProps {
    htmlContent: string;
    variant?: 'default' | 'compact' | 'full';
    className?: string;
}

type CopyMode = 'all' | 'script' | 'html';

const SCRIPT_TAG = `<script src="https://cdn.jsdelivr.net/gh/oathanrex/script@v1.0.0/widget.js"></script>`;

const SCRIPT_INSTRUCTIONS = `<!-- ============================================
   WIDGET.JS INSTALLATION INSTRUCTIONS
   ============================================
   
   Add this script tag ONCE to your Blogger Layout:
   
   1. Go to Blogger Dashboard → Theme → Edit HTML
   2. Find the closing </body> tag
   3. Paste the script tag just BEFORE </body>
   4. Save your theme
   
   This only needs to be done once. After that,
   just paste the HTML content into your posts.
   ============================================ -->

${SCRIPT_TAG}`;

const generateFullOutput = (htmlContent: string): string => {
    const timestamp = new Date().toISOString();

    return `<!-- ============================================
   BLOGGER POST CONTENT
   Generated: ${timestamp}
   ============================================
   
   STEP 1: Add Widget.js (One-time setup)
   ----------------------------------------
   Add this script to your Blogger Layout:
   Go to Theme → Edit HTML → Before </body>
   
${SCRIPT_TAG}
   
   STEP 2: Paste Content Below Into Your Post
   ----------------------------------------
============================================ -->

${htmlContent}

<!-- End of generated content -->`;
};

export const CopyButton: React.FC<CopyButtonProps> = ({
    htmlContent,
    variant = 'default',
    className = '',
}) => {
    const [copied, setCopied] = useState<CopyMode | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const copyToClipboard = useCallback(async (text: string, mode: CopyMode) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(mode);
            setTimeout(() => setCopied(null), 2500);
            setIsDropdownOpen(false);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                setCopied(mode);
                setTimeout(() => setCopied(null), 2500);
            } catch (e) {
                console.error('Failed to copy:', e);
            }

            document.body.removeChild(textArea);
            setIsDropdownOpen(false);
        }
    }, []);

    const handleCopyAll = useCallback(() => {
        const fullOutput = generateFullOutput(htmlContent);
        copyToClipboard(fullOutput, 'all');
    }, [htmlContent, copyToClipboard]);

    const handleCopyScript = useCallback(() => {
        copyToClipboard(SCRIPT_INSTRUCTIONS, 'script');
    }, [copyToClipboard]);

    const handleCopyHtml = useCallback(() => {
        copyToClipboard(htmlContent, 'html');
    }, [htmlContent, copyToClipboard]);

    // Compact variant - single button
    if (variant === 'compact') {
        return (
            <button
                onClick={handleCopyAll}
                className={`
          inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${copied === 'all'
                        ? 'bg-green-600 text-white'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }
          ${className}
        `}
            >
                {copied === 'all' ? (
                    <>
                        <Check className="w-4 h-4" />
                        Copied!
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        Copy to Clipboard
                    </>
                )}
            </button>
        );
    }

    // Full variant - detailed card
    if (variant === 'full') {
        return (
            <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Clipboard className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800">Copy to Clipboard</h3>
                            <p className="text-sm text-gray-500">Choose what to copy</p>
                        </div>
                    </div>
                </div>

                {/* Copy Options */}
                <div className="p-4 space-y-3">
                    {/* Copy All Button */}
                    <button
                        onClick={handleCopyAll}
                        className={`
              w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all
              ${copied === 'all'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${copied === 'all' ? 'bg-green-500' : 'bg-blue-600'}`}>
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-semibold text-gray-800">
                                    Copy Everything
                                </div>
                                <div className="text-sm text-gray-500">
                                    Script tag + Instructions + HTML content
                                </div>
                            </div>
                        </div>
                        {copied === 'all' ? (
                            <Check className="w-5 h-5 text-green-600" />
                        ) : (
                            <Copy className="w-5 h-5 text-gray-400" />
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-400">or copy separately</span>
                        </div>
                    </div>

                    {/* Script Tag Button */}
                    <button
                        onClick={handleCopyScript}
                        className={`
              w-full flex items-center justify-between p-3 rounded-lg border transition-all
              ${copied === 'script'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                            }
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded ${copied === 'script' ? 'bg-green-500' : 'bg-purple-500'}`}>
                                <Package className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-700 text-sm">
                                    Widget.js Script Tag
                                </div>
                                <div className="text-xs text-gray-400">
                                    Add once to your Blogger Layout
                                </div>
                            </div>
                        </div>
                        {copied === 'script' ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                        )}
                    </button>

                    {/* HTML Content Button */}
                    <button
                        onClick={handleCopyHtml}
                        className={`
              w-full flex items-center justify-between p-3 rounded-lg border transition-all
              ${copied === 'html'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                            }
            `}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded ${copied === 'html' ? 'bg-green-500' : 'bg-emerald-500'}`}>
                                <FileText className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-700 text-sm">
                                    HTML Content Only
                                </div>
                                <div className="text-xs text-gray-400">
                                    Paste into your blog post
                                </div>
                            </div>
                        </div>
                        {copied === 'html' ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                </div>

                {/* Info Footer */}
                <div className="px-4 py-3 bg-amber-50 border-t border-amber-100">
                    <div className="flex items-start gap-2 text-xs text-amber-700">
                        <Info className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                            The script tag only needs to be added once to your Blogger theme.
                            After that, just paste the HTML content into each post.
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Default variant - dropdown button
    return (
        <div className={`relative ${className}`}>
            <div className="flex">
                {/* Main Copy Button */}
                <button
                    onClick={handleCopyAll}
                    className={`
            flex items-center gap-2 px-4 py-2 rounded-l-lg font-medium transition-all
            ${copied
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
          `}
                >
                    {copied ? (
                        <>
                            <Check className="w-4 h-4" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="w-4 h-4" />
                            Copy to Clipboard
                        </>
                    )}
                </button>

                {/* Dropdown Toggle */}
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={`
            px-2 py-2 rounded-r-lg border-l transition-all
            ${copied
                            ? 'bg-green-600 text-white border-green-500'
                            : 'bg-blue-600 text-white hover:bg-blue-700 border-blue-500'
                        }
          `}
                >
                    <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsDropdownOpen(false)}
                    />

                    {/* Menu */}
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-20 overflow-hidden">
                        <div className="p-2 bg-gray-50 border-b border-gray-100">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Copy Options
                            </span>
                        </div>

                        <div className="p-1">
                            {/* Copy All */}
                            <button
                                onClick={handleCopyAll}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-lg transition-colors text-left"
                            >
                                <div className="p-1.5 bg-blue-100 rounded">
                                    <Layers className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Copy Everything</div>
                                    <div className="text-xs text-gray-500">Script + Instructions + HTML</div>
                                </div>
                            </button>

                            {/* Copy Script */}
                            <button
                                onClick={handleCopyScript}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-purple-50 rounded-lg transition-colors text-left"
                            >
                                <div className="p-1.5 bg-purple-100 rounded">
                                    <Code className="w-4 h-4 text-purple-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">Script Tag Only</div>
                                    <div className="text-xs text-gray-500">For Blogger Layout (one-time)</div>
                                </div>
                            </button>

                            {/* Copy HTML */}
                            <button
                                onClick={handleCopyHtml}
                                className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-emerald-50 rounded-lg transition-colors text-left"
                            >
                                <div className="p-1.5 bg-emerald-100 rounded">
                                    <FileText className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-800">HTML Content Only</div>
                                    <div className="text-xs text-gray-500">For blog post content</div>
                                </div>
                            </button>
                        </div>

                        {/* CDN Preview */}
                        <div className="p-3 bg-gray-900 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-400">CDN Script:</span>
                                <a
                                    href="https://cdn.jsdelivr.net/gh/oathanrex/script@v1.0.0/widget.js"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                >
                                    View <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>
                            <code className="text-xs text-green-400 break-all">
                                cdn.jsdelivr.net/gh/oathanrex/script@v1.0.0/widget.js
                            </code>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CopyButton;
