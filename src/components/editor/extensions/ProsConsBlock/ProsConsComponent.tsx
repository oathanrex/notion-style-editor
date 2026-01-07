'use client';

import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
    ThumbsUp,
    ThumbsDown,
    Plus,
    Trash2,
    X,
    Check,
    Edit3,
    Scale,
} from 'lucide-react';

const ProsConsComponent: React.FC<NodeViewProps> = ({
    node,
    updateAttributes,
    deleteNode,
    selected,
}) => {
    const [editingPro, setEditingPro] = useState<number | null>(null);
    const [editingCon, setEditingCon] = useState<number | null>(null);
    const [newProText, setNewProText] = useState('');
    const [newConText, setNewConText] = useState('');
    const [isEditingTitle, setIsEditingTitle] = useState(false);

    const { title, pros, cons } = node.attrs as {
        title: string;
        pros: string[];
        cons: string[];
    };

    // Pros handlers
    const addPro = () => {
        if (newProText.trim()) {
            updateAttributes({ pros: [...pros, newProText.trim()] });
            setNewProText('');
        }
    };

    const updatePro = (index: number, text: string) => {
        const newPros = [...pros];
        newPros[index] = text;
        updateAttributes({ pros: newPros });
    };

    const deletePro = (index: number) => {
        updateAttributes({ pros: pros.filter((_: string, i: number) => i !== index) });
    };

    // Cons handlers
    const addCon = () => {
        if (newConText.trim()) {
            updateAttributes({ cons: [...cons, newConText.trim()] });
            setNewConText('');
        }
    };

    const updateCon = (index: number, text: string) => {
        const newCons = [...cons];
        newCons[index] = text;
        updateAttributes({ cons: newCons });
    };

    const deleteCon = (index: number) => {
        updateAttributes({ cons: cons.filter((_: string, i: number) => i !== index) });
    };

    return (
        <NodeViewWrapper className="my-6">
            <div
                className={`
          relative rounded-xl border-2 border-gray-200 bg-white overflow-hidden
          shadow-sm transition-all duration-200
          ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-emerald-500 to-rose-500 rounded-lg shadow-sm">
                                <Scale className="w-5 h-5 text-white" />
                            </div>
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => updateAttributes({ title: e.target.value })}
                                    onBlur={() => setIsEditingTitle(false)}
                                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                    className="text-xl font-bold text-gray-800 bg-white px-2 py-1 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                            ) : (
                                <h3
                                    className="text-xl font-bold text-gray-800 cursor-pointer hover:text-gray-600"
                                    onClick={() => setIsEditingTitle(true)}
                                >
                                    {title}
                                </h3>
                            )}
                        </div>
                        <button
                            onClick={deleteNode}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Block"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    {/* Pros Column */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50">
                        {/* Pros Header */}
                        <div className="px-5 py-3 bg-emerald-100/50 border-b border-emerald-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-emerald-500 rounded-full">
                                    <ThumbsUp className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-emerald-800">Pros</span>
                                <span className="ml-auto text-xs font-medium text-emerald-600 bg-emerald-200 px-2 py-0.5 rounded-full">
                                    {pros.length}
                                </span>
                            </div>
                        </div>

                        {/* Pros List */}
                        <ul className="p-4 space-y-2">
                            {pros.map((pro: string, index: number) => (
                                <li key={index} className="group flex items-start gap-2">
                                    <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                    {editingPro === index ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={pro}
                                                onChange={(e) => updatePro(index, e.target.value)}
                                                className="flex-1 px-2 py-1 text-sm border border-emerald-300 rounded focus:ring-2 focus:ring-emerald-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => setEditingPro(null)}
                                                className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm text-emerald-800">{pro}</span>
                                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                                <button
                                                    onClick={() => setEditingPro(index)}
                                                    className="p-1 text-emerald-600 hover:bg-emerald-100 rounded"
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => deletePro(index)}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Add Pro Input */}
                        <div className="px-4 pb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newProText}
                                    onChange={(e) => setNewProText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addPro()}
                                    placeholder="Add a pro..."
                                    className="flex-1 px-3 py-2 text-sm bg-white border border-emerald-200 rounded-lg
                           focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                           placeholder:text-emerald-400"
                                />
                                <button
                                    onClick={addPro}
                                    disabled={!newProText.trim()}
                                    className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cons Column */}
                    <div className="bg-gradient-to-br from-rose-50 to-red-50">
                        {/* Cons Header */}
                        <div className="px-5 py-3 bg-rose-100/50 border-b border-rose-200">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-rose-500 rounded-full">
                                    <ThumbsDown className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-bold text-rose-800">Cons</span>
                                <span className="ml-auto text-xs font-medium text-rose-600 bg-rose-200 px-2 py-0.5 rounded-full">
                                    {cons.length}
                                </span>
                            </div>
                        </div>

                        {/* Cons List */}
                        <ul className="p-4 space-y-2">
                            {cons.map((con: string, index: number) => (
                                <li key={index} className="group flex items-start gap-2">
                                    <X className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    {editingCon === index ? (
                                        <div className="flex-1 flex gap-2">
                                            <input
                                                type="text"
                                                value={con}
                                                onChange={(e) => updateCon(index, e.target.value)}
                                                className="flex-1 px-2 py-1 text-sm border border-rose-300 rounded focus:ring-2 focus:ring-rose-500"
                                                autoFocus
                                            />
                                            <button
                                                onClick={() => setEditingCon(null)}
                                                className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="flex-1 text-sm text-rose-800">{con}</span>
                                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                                <button
                                                    onClick={() => setEditingCon(index)}
                                                    className="p-1 text-rose-600 hover:bg-rose-100 rounded"
                                                >
                                                    <Edit3 className="w-3 h-3" />
                                                </button>
                                                <button
                                                    onClick={() => deleteCon(index)}
                                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ul>

                        {/* Add Con Input */}
                        <div className="px-4 pb-4">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newConText}
                                    onChange={(e) => setNewConText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addCon()}
                                    placeholder="Add a con..."
                                    className="flex-1 px-3 py-2 text-sm bg-white border border-rose-200 rounded-lg
                           focus:ring-2 focus:ring-rose-500 focus:border-transparent
                           placeholder:text-rose-400"
                                />
                                <button
                                    onClick={addCon}
                                    disabled={!newConText.trim()}
                                    className="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 
                           disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Footer */}
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-emerald-600 font-medium">
                            ✓ {pros.length} Pros
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-rose-600 font-medium">
                            ✗ {cons.length} Cons
                        </span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {pros.length > cons.length ? (
                            <span className="text-emerald-600">👍 Overall Positive</span>
                        ) : cons.length > pros.length ? (
                            <span className="text-rose-600">👎 Needs Improvement</span>
                        ) : (
                            <span className="text-gray-600">⚖️ Balanced</span>
                        )}
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default ProsConsComponent;
