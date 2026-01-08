# Notion‐Style Editor

A customizable **Notion-style rich text editor** built with modern web technologies.  
This project provides a flexible content editing experience similar to Notion and integrates block-based editing, formatting controls, and extendable UI/UX patterns.

> This editor can be embedded in your web app to offer users a powerful writing interface.

## 🚀 Features

**Core Editing**
- Block-based content structure (headings, paragraphs, lists, quotes)
- Rich text formatting (bold, italic, underline, code)
- Slash (`/`) menu to quickly add blocks and components

**Extensibility**
- Built with **modular architecture** — add custom blocks or plugins
- Designed for integration in frameworks like Next.js, React, or Vanilla JS

**Modern UX**
- Keyboard shortcuts for formatting
- Drag & drop block rearrangement
- Toolbars and selection menus for intuitive editing

**Collaboration Ready**
- Supports extensible schema for real-time or future collaborative features
- Framework agnostic core with optional React components

## 🧱 What’s Inside

This repository includes:

```

├── public/                     # Static assets (icons, fonts)
├── src/
│   ├── components/             # UI components (toolbars, block menus)
│   ├── editor/                 # Core editor logic and block schema
│   ├── plugins/                # Extensions and custom behaviour
│   ├── utils/                  # Utility helpers (formatting, keymaps)
│   └── styles/                 # TailwindCSS / component styles
├── pages/ (if Next.js)         # App routes and editor page
├── tailwind.config.js          # TailwindCSS config
├── package.json                # Project dependencies
├── tsconfig.json               # TypeScript config
└── README.md                  # This documentation

````

## 📦 Built With

- **React** (optional UI layer)
- **ProseMirror** / **TipTap** foundations for block-based editing
- **TypeScript** for type safety
- **TailwindCSS** for utility-first styling

*Tip:* Many modern Notion-style editor projects leverage ProseMirror or TipTap as the underlying editing engine because they handle document state, selections, and rich node schemas efficiently. :contentReference[oaicite:0]{index=0}

## 🔧 Getting Started

### Prerequisites

Ensure you have **Node.js 16+** and **npm/yarn** installed.

### Install

```bash
git clone https://github.com/oathanrex/notion-style-editor.git
cd notion-style-editor
npm install
````

### Development

Run the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` to see the editor in action.

### Build

To create a production build:

```bash
npm run build
```

## 🛠️ Usage & Integration

You can embed the editor into any page or component:

```tsx
import Editor from "notion-style-editor";

export default function Notes() {
  return (
    <div className="editor-container">
      <Editor />
    </div>
  );
}
```

You can also hook into editor events:

```tsx
<Editor onChange={(content) => console.log(content)} />;
```

## 📚 Extending the Editor

### Add Custom Blocks

Create a new block in `src/editor/blocks/`:

```ts
export const MyCustomBlock = {
  name: "myBlock",
  schema: {
    attrs: { text: {} },
    parseDOM: [{ tag: "my-block" }],
    toDOM: (node) => ["my-block", 0],
  },
};
```

### Plugins

Add behaviour like slash menus or formatting shortcuts in `src/plugins/`.

## 📖 Examples

This editor can form a base for:

* Knowledge base applications
* Documentation platforms
* Note-taking tools
* Blog CMS with rich formatting

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/xyz`)
3. Commit changes (`git commit -m "Add xyz"`)
4. Push (`git push origin feature/xyz`)
5. Create a Pull Request

## 📄 License

This project is open source and distributed under the **MIT License**.

---
