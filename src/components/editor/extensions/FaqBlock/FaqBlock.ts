import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import FaqBlockComponent from './FaqBlockComponent';

export interface FaqBlockOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        faqBlock: {
            setFaqBlock: (attributes?: {
                items?: Array<{ question: string; answer: string; id?: number }>;
            }) => ReturnType;
        };
    }
}

export const FaqBlock = Node.create<FaqBlockOptions>({
    name: 'faqBlock',

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
            items: {
                default: [
                    {
                        question: 'How does this work?',
                        answer: 'This is a fully interactive FAQ block. You can add, edit, and delete questions directly in the editor.',
                        id: 1,
                    },
                ],
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="faq-block"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'faq-block',
            }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(FaqBlockComponent);
    },

    addCommands() {
        return {
            setFaqBlock:
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

export default FaqBlock;
