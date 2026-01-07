import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ProsConsComponent from './ProsConsComponent';

export interface ProsConsBlockOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        prosConsBlock: {
            setProsConsBlock: (attributes?: {
                title?: string;
                pros?: string[];
                cons?: string[];
            }) => ReturnType;
        };
    }
}

export const ProsConsBlock = Node.create<ProsConsBlockOptions>({
    name: 'prosConsBlock',

    group: 'block',

    atom: true,

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            title: {
                default: 'Pros & Cons',
            },
            pros: {
                default: [
                    'Easy to use and beginner-friendly',
                    'Great customer support',
                    'Affordable pricing plans',
                ],
            },
            cons: {
                default: [
                    'Limited advanced features',
                    'Requires internet connection',
                ],
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="pros-cons-block"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'pros-cons-block',
                class: 'pros-cons-block',
            }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ProsConsComponent);
    },

    addCommands() {
        return {
            setProsConsBlock:
                (attributes) =>
                    ({ commands }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: attributes,
                        });
                    },
        };
    },
});

export default ProsConsBlock;
