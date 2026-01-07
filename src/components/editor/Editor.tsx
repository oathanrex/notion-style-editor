'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import MenuBar from './MenuBar';
import EditorBubbleMenu from './EditorBubbleMenu';
import { ExportModal } from './export';
import { StatsSidebar } from './sidebar';

// Custom Extensions
import { CallToAction } from './extensions/CallToAction/CallToAction';
import { FaqBlock } from './extensions/FaqBlock/FaqBlock';
import { ProsConsBlock } from './extensions/ProsConsBlock/ProsConsBlock';

interface EditorProps {
    initialContent?: string;
    onChange?: (html: string, json: object) => void;
    placeholder?: string;
}

export const Editor: React.FC<EditorProps> = ({
    initialContent = '',
    onChange,
    placeholder = "Start typing your content...",
}) => {
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentHtml, setCurrentHtml] = useState(initialContent);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading') {
                        return `Heading ${node.attrs.level}`;
                    }
                    return placeholder;
                },
                emptyEditorClass: 'is-editor-empty',
                emptyNodeClass: 'is-empty',
            }),
            CallToAction,
            FaqBlock,
            ProsConsBlock,
        ],
        content: initialContent,
        editorProps: {
            attributes: {
                class: 'notion-editor prose prose-sm sm:prose lg:prose-lg focus:outline-none',
                spellcheck: 'true',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const json = editor.getJSON();
            setCurrentHtml(html);
            if (onChange) {
                onChange(html, json);
            }
        },
        immediatelyRender: false,
    });

    // Update currentHtml when initialContent changes
    useEffect(() => {
        if (editor && initialContent) {
            if (editor.getHTML() !== initialContent) {
                // careful with loops here, but initialContent stable is key
                // actually, usually better not to update forcefully unless explicit sync needed
                // but for this prototype, we'll leave it or just init once.
                // The code from docs had this useEffect.
                // setCurrentHtml(editor.getHTML()); 
                // Wait, the doc code said: 
                // useEffect(() => { if (editor && initialContent) { setCurrentHtml(editor.getHTML()); } }, [editor, initialContent]);
                // This seems to just sync local state? Use caution.
            }
            // Actually, if we just want to update stats, setting currentHtml is good.
            // But if we want to update EDITOR content from prop, editor.commands.setContent() is needed.
            // The docs code: 
            /*
              useEffect(() => {
                  if (editor && initialContent) {
                  setCurrentHtml(editor.getHTML());
                  }
              }, [editor, initialContent]);
            */
            // This seems to basically just ensure `currentHtml` is set initially?
            // Let's stick to the docs code to be safe.
            setCurrentHtml(editor.getHTML());
        }
    }, [editor, initialContent]);

    const handleClearContent = useCallback(() => {
        if (editor) {
            editor.commands.clearContent();
            editor.commands.focus();
        }
    }, [editor]);

    const toggleSidebar = useCallback(() => {
        setIsSidebarOpen((prev) => !prev);
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Editor Area */}
            <div
                className={`
          flex-1 transition-all duration-300
          ${isSidebarOpen ? 'mr-[340px]' : 'mr-0'}
        `}
            >
                <div className="max-w-4xl mx-auto py-8 px-4">
                    {/* Header */}
                    <div className="mb-6 text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            📝 Notion-Style Editor
                        </h1>
                        <p className="text-gray-500">
                            With Real-Time Analytics Sidebar
                        </p>
                    </div>

                    {/* Editor Card */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                        <MenuBar editor={editor} />

                        <div className="p-8 min-h-[500px]">
                            {editor && <EditorBubbleMenu editor={editor} />}
                            <EditorContent editor={editor} />
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-between">
                            <button
                                onClick={toggleSidebar}
                                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 
                         hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                {isSidebarOpen ? (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                        </svg>
                                        Hide Stats
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                                        </svg>
                                        Show Stats
                                    </>
                                )}
                            </button>

                            <div className="flex gap-2">
                                <button
                                    onClick={handleClearContent}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 
                           hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    Clear
                                </button>
                                <button
                                    onClick={() => setIsExportModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                           bg-gradient-to-r from-blue-600 to-indigo-600 text-white 
                           hover:from-blue-700 hover:to-indigo-700 rounded-lg 
                           shadow-lg shadow-blue-500/25 transition-all duration-200
                           hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                    Generate Code
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Sidebar */}
            <StatsSidebar
                html={currentHtml}
                isOpen={isSidebarOpen}
                onToggle={toggleSidebar}
            />

            {/* Export Modal */}
            {editor && (
                <ExportModal
                    editor={editor}
                    isOpen={isExportModalOpen}
                    onClose={() => setIsExportModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Editor;
