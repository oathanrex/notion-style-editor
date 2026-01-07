'use client';

import { BubbleMenu, Editor } from '@tiptap/react';
// import { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading2,
    Heading3,
} from 'lucide-react';

interface EditorBubbleMenuProps {
    editor: Editor;
}

export const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor }) => {
    const bubbleMenuItems = [
        {
            icon: Bold,
            title: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: () => editor.isActive('bold'),
        },
        {
            icon: Italic,
            title: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: () => editor.isActive('italic'),
        },
        {
            icon: Strikethrough,
            title: 'Strikethrough',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: () => editor.isActive('strike'),
        },
        {
            icon: Code,
            title: 'Code',
            action: () => editor.chain().focus().toggleCode().run(),
            isActive: () => editor.isActive('code'),
        },
        { type: 'divider' },
        {
            icon: Heading2,
            title: 'Heading 2',
            action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: () => editor.isActive('heading', { level: 2 }),
        },
        {
            icon: Heading3,
            title: 'Heading 3',
            action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: () => editor.isActive('heading', { level: 3 }),
        },
    ];

    return (
        <BubbleMenu
            editor={editor}
            tippyOptions={{ duration: 100 }}
            className="bubble-menu"
        >
            {bubbleMenuItems.map((item, index) => {
                if (item.type === 'divider') {
                    return <div key={index} className="w-px h-5 bg-notion-border mx-1" />;
                }

                const Icon = item.icon!;
                return (
                    <button
                        key={item.title}
                        onClick={item.action}
                        className={`bubble-button ${item.isActive?.() ? 'is-active' : ''}`}
                        title={item.title}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                );
            })}
        </BubbleMenu>
    );
};

export default EditorBubbleMenu;
