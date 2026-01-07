import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import CallToActionComponent from './CallToActionComponent';

export interface CallToActionOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        callToAction: {
            setCallToAction: (attributes?: {
                title?: string;
                description?: string;
                buttonText?: string;
                buttonUrl?: string;
                variant?: 'primary' | 'secondary' | 'gradient';
            }) => ReturnType;
        };
    }
}

export const CallToAction = Node.create<CallToActionOptions>({
    name: 'callToAction',

    group: 'block',

    draggable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            title: {
                default: 'Ready to Get Started?',
            },
            description: {
                default: 'Join thousands of users who are already using our product.',
            },
            buttonText: {
                default: 'Get Started',
            },
            buttonUrl: {
                default: '#',
            },
            variant: {
                default: 'primary',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="call-to-action"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'div',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'call-to-action',
            }),
        ];
    },

    addNodeView() {
        return ReactNodeViewRenderer(CallToActionComponent);
    },

    addCommands() {
        return {
            setCallToAction:
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

export default CallToAction;
