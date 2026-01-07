'use client';

import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewProps } from '@tiptap/react';
import {
    Megaphone,
    Settings,
    X,
    ExternalLink,
    Palette,
    Sparkles,
} from 'lucide-react';

const variants = {
    primary: {
        container: 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200',
        icon: 'bg-blue-100 text-blue-600',
        title: 'text-blue-900',
        description: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    secondary: {
        container: 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200',
        icon: 'bg-gray-100 text-gray-600',
        title: 'text-gray-900',
        description: 'text-gray-600',
        button: 'bg-gray-800 hover:bg-gray-900 text-white',
    },
    gradient: {
        container: 'bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border-purple-200',
        icon: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
        title: 'text-purple-900',
        description: 'text-purple-700',
        button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white',
    },
};

const CallToActionComponent: React.FC<NodeViewProps> = ({
    node,
    updateAttributes,
    deleteNode,
    selected,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const { title, description, buttonText, buttonUrl, variant } = node.attrs;
    const styles = variants[variant as keyof typeof variants] || variants.primary;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        updateAttributes({
            title: formData.get('title'),
            description: formData.get('description'),
            buttonText: formData.get('buttonText'),
            buttonUrl: formData.get('buttonUrl'),
            variant: formData.get('variant'),
        });
        setIsEditing(false);
    };

    return (
        <NodeViewWrapper className="my-4">
            <div
                className={`
          relative rounded-xl border-2 p-6 transition-all duration-200
          ${styles.container}
          ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        `}
                data-drag-handle
            >
                {/* Edit/Delete Controls */}
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="p-1.5 rounded-md bg-white/80 hover:bg-white shadow-sm transition-colors"
                        title="Edit CTA"
                    >
                        <Settings className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                        onClick={deleteNode}
                        className="p-1.5 rounded-md bg-white/80 hover:bg-red-50 shadow-sm transition-colors"
                        title="Delete CTA"
                    >
                        <X className="w-4 h-4 text-red-500" />
                    </button>
                </div>

                {isEditing ? (
                    /* Edit Mode */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    name="title"
                                    defaultValue={title}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter title..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Button Text
                                </label>
                                <input
                                    name="buttonText"
                                    defaultValue={buttonText}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Button text..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                name="description"
                                defaultValue={description}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter description..."
                            />
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Button URL
                                </label>
                                <input
                                    name="buttonUrl"
                                    defaultValue={buttonUrl}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="https://..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Style Variant
                                </label>
                                <select
                                    name="variant"
                                    defaultValue={variant}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="primary">Primary (Blue)</option>
                                    <option value="secondary">Secondary (Gray)</option>
                                    <option value="gradient">Gradient (Purple/Pink)</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                ) : (
                    /* Display Mode */
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Icon */}
                        <div className={`p-4 rounded-full ${styles.icon} shrink-0`}>
                            {variant === 'gradient' ? (
                                <Sparkles className="w-8 h-8" />
                            ) : (
                                <Megaphone className="w-8 h-8" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h3 className={`text-xl font-bold mb-2 ${styles.title}`}>
                                {title}
                            </h3>
                            <p className={`text-sm ${styles.description}`}>{description}</p>
                        </div>

                        {/* Button */}
                        <a
                            href={buttonUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
                text-sm shadow-lg shadow-blue-500/25 transition-all duration-200
                hover:shadow-xl hover:-translate-y-0.5 shrink-0
                ${styles.button}
              `}
                            onClick={(e) => e.preventDefault()}
                        >
                            {buttonText}
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                )}

                {/* Drag Handle Indicator */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 hover:opacity-50 cursor-move">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                        </div>
                        <div className="flex gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                        </div>
                        <div className="flex gap-0.5">
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                            <div className="w-1 h-1 rounded-full bg-gray-400" />
                        </div>
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
};

export default CallToActionComponent;
