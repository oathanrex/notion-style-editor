'use client';

import React from 'react';
import { Editor } from '@tiptap/react';
import {
    Bold,
    Italic,
    Strikethrough,
    Code,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Minus,
    Undo,
    Redo,
    Type,
} from 'lucide-react';
import Button from '@/components/ui/Button';

interface MenuBarProps {
    editor: Editor | null;
}

export const MenuBar: React.FC<MenuBarProps> = ({ editor }) => {
    if (!editor) {
        return null;
    }

    interface MenuItem {
        icon: import('lucide-react').LucideIcon;
        title: string;
        action: () => void;
        isActive: () => boolean;
        disabled?: () => boolean;
    }

    const menuItems: { group: string; items: MenuItem[] }[] = [
        {
            group: 'text',
            items: [
                {
                    icon: Type,
                    title: 'Paragraph',
                    action: () => editor.chain().focus().setParagraph().run(),
                    isActive: () => editor.isActive('paragraph'),
                },
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
            ],
        },
        {
            group: 'formatting',
            items: [
                {
                    icon: Bold,
                    title: 'Bold (Ctrl+B)',
                    action: () => editor.chain().focus().toggleBold().run(),
                    isActive: () => editor.isActive('bold'),
                },
                {
                    icon: Italic,
                    title: 'Italic (Ctrl+I)',
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
                    title: 'Inline Code',
                    action: () => editor.chain().focus().toggleCode().run(),
                    isActive: () => editor.isActive('code'),
                },
            ],
        },
        {
            group: 'lists',
            items: [
                {
                    icon: List,
                    title: 'Bullet List',
                    action: () => editor.chain().focus().toggleBulletList().run(),
                    isActive: () => editor.isActive('bulletList'),
                },
                {
                    icon: ListOrdered,
                    title: 'Numbered List',
                    action: () => editor.chain().focus().toggleOrderedList().run(),
                    isActive: () => editor.isActive('orderedList'),
                },
            ],
        },
        {
            group: 'blocks',
            items: [
                {
                    icon: Quote,
                    title: 'Blockquote',
                    action: () => editor.chain().focus().toggleBlockquote().run(),
                    isActive: () => editor.isActive('blockquote'),
                },
                {
                    icon: Minus,
                    title: 'Horizontal Rule',
                    action: () => editor.chain().focus().setHorizontalRule().run(),
                    isActive: () => false,
                },
            ],
        },
        {
            group: 'history',
            items: [
                {
                    icon: Undo,
                    title: 'Undo (Ctrl+Z)',
                    action: () => editor.chain().focus().undo().run(),
                    isActive: () => false,
                    disabled: () => !editor.can().undo(),
                },
                {
                    icon: Redo,
                    title: 'Redo (Ctrl+Y)',
                    action: () => editor.chain().focus().redo().run(),
                    isActive: () => false,
                    disabled: () => !editor.can().redo(),
                },
            ],
        },
    ];

    return (
        <div className="sticky top-0 z-10 bg-white border-b border-notion-border">
            <div className="flex flex-wrap items-center gap-1 p-2">
                {menuItems.map((group, groupIndex) => (
                    <React.Fragment key={group.group}>
                        {groupIndex > 0 && <div className="menu-divider" />}
                        {group.items.map((item) => (
                            <Button
                                key={item.title}
                                onClick={item.action}
                                isActive={item.isActive()}
                                disabled={item.disabled?.()}
                                tooltip={item.title}
                            >
                                <item.icon className="w-4 h-4" />
                            </Button>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default MenuBar;
