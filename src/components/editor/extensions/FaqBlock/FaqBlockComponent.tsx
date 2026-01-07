'use client';

import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
    HelpCircle,
    Plus,
    Trash2,
    ChevronDown,
    MessageCircle,
    Edit2,
    X,
    Check,
} from 'lucide-react';

const FaqBlockComponent: React.FC<NodeViewProps> = ({
    node,
    updateAttributes,
    deleteNode,
    selected,
}) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [newQuestion, setNewQuestion] = useState('');
    const [newAnswer, setNewAnswer] = useState('');
    const [openItems, setOpenItems] = useState<number[]>([]);

    const items = node.attrs.items || [];

    const handleAddItem = () => {
        if (newQuestion && newAnswer) {
            updateAttributes({
                items: [
                    ...items,
                    { question: newQuestion, answer: newAnswer, id: Date.now() },
                ],
            });
            setNewQuestion('');
            setNewAnswer('');
        }
    };

    const handleUpdateItem = (index: number, field: 'question' | 'answer', value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        updateAttributes({ items: newItems });
    };

    const handleDeleteItem = (index: number) => {
        const newItems = items.filter((_: any, i: number) => i !== index);
        updateAttributes({ items: newItems });
    };

    const toggleItem = (index: number) => {
        setOpenItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    return (
        <NodeViewWrapper className="my-6">
            <div
                className={`
          relative rounded-xl border-2 border-amber-200 bg-amber-50/30 overflow-hidden
          ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 px-6 py-4 border-b border-amber-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500 rounded-lg shadow-sm">
                                <HelpCircle className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-amber-900">
                                Frequently Asked Questions
                            </h3>
                        </div>
                        <button
                            onClick={deleteNode}
                            className="p-1.5 text-amber-700 hover:bg-amber-200/50 rounded-lg transition-colors"
                            title="Delete Section"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="divide-y divide-amber-200/50">
                    {items.map((item: any, index: number) => (
                        <div key={item.id || index} className="bg-white/50">
                            {editingIndex === index ? (
                                <div className="p-4 space-y-3 bg-white">
                                    <input
                                        value={item.question}
                                        onChange={(e) => handleUpdateItem(index, 'question', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="Question"
                                    />
                                    <textarea
                                        value={item.answer}
                                        onChange={(e) => handleUpdateItem(index, 'answer', e.target.value)}
                                        className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
                                        placeholder="Answer"
                                        rows={3}
                                    />
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => setEditingIndex(null)}
                                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                                        >
                                            <Check className="w-3 h-3" /> Done
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="group">
                                    <button
                                        onClick={() => toggleItem(index)}
                                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-amber-50 transition-colors text-left"
                                    >
                                        <span className="font-semibold text-amber-900">{item.question}</span>
                                        <div className="flex items-center gap-2">
                                            <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity mr-2">
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingIndex(index);
                                                    }}
                                                    className="p-1 text-amber-600 hover:bg-amber-200 rounded cursor-pointer"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </span>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteItem(index);
                                                    }}
                                                    className="p-1 text-red-500 hover:bg-red-100 rounded cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </span>
                                            </div>
                                            <ChevronDown
                                                className={`w-5 h-5 text-amber-400 transition-transform ${openItems.includes(index) ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>
                                    </button>
                                    {openItems.includes(index) && (
                                        <div className="px-6 pb-4 text-amber-800/80 leading-relaxed animate-fadeIn">
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Add New Item */}
                <div className="p-4 bg-amber-50 border-t border-amber-200">
                    <div className="space-y-3">
                        <input
                            value={newQuestion}
                            onChange={(e) => setNewQuestion(e.target.value)}
                            placeholder="Type a new question..."
                            className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-amber-400"
                        />
                        {newQuestion && (
                            <div className="animate-slideDown">
                                <textarea
                                    value={newAnswer}
                                    onChange={(e) => setNewAnswer(e.target.value)}
                                    placeholder="Type the answer..."
                                    rows={2}
                                    className="w-full px-4 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder:text-amber-400"
                                />
                                <div className="flex justify-end mt-2">
                                    <button
                                        onClick={handleAddItem}
                                        disabled={!newAnswer}
                                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add FAQ Item
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default FaqBlockComponent;
