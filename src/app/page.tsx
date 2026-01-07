'use client';

import { useState } from 'react';
import { Editor } from '@/components/editor/Editor';

export default function Home() {
  const handleEditorChange = (html: string, json: object) => {
    // You can handle changes here (e.g., auto-save)
    console.log('Content updated');
  };

  const sampleContent = `
    <h2>Welcome to the Notion-Style Editor</h2>
    <p>This editor now includes a <strong>real-time analytics sidebar</strong> that tracks your content as you type.</p>
    
    <h3>Features Available</h3>
    <ul>
      <li>📊 Word, character, and sentence counts</li>
      <li>⏱️ Reading and speaking time estimates</li>
      <li>🔍 Keyword density analysis with SEO tips</li>
      <li>📈 Top keywords and phrases detection</li>
    </ul>
    
    <p>Try typing more content and watch the sidebar update in real-time. You can also enter a focus keyword to analyze its density and distribution throughout your content.</p>
    
    <h3>Tips for Better SEO</h3>
    <p>Keep your keyword density between 1-3% for optimal results. Make sure to include your focus keyword in the title, first paragraph, and at least one subheading.</p>
    
    <blockquote>
      <p>Great content is not just about keywords—it's about providing value to your readers while being mindful of SEO best practices.</p>
    </blockquote>
    
    <p>The sidebar automatically detects the most frequently used words and phrases in your content, helping you identify unintentional keyword stuffing or opportunities for better optimization.</p>
  `;

  return (
    <main className="min-h-screen">
      <Editor
        initialContent={sampleContent}
        onChange={handleEditorChange}
        placeholder="Start typing here..."
      />
    </main>
  );
}
