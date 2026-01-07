/**
 * Clean HTML Serializer for Tiptap Editor
 * Generates semantic HTML with specific class names for external widget.js
 */

import { JSONContent } from '@tiptap/react';

export interface SerializerOptions {
    includeTOC: boolean;
    includeSchemaMarkup: boolean;
    minify: boolean;
    tocPosition: 'top' | 'afterFirstHeading';
}

export interface ExportResult {
    html: string;
    faqSchema: object | null;
    articleSchema: object | null;
    stats: {
        headings: number;
        faqs: number;
        ctas: number;
        prosConsBlocks: number;
        wordCount: number;
    };
}

const defaultOptions: SerializerOptions = {
    includeTOC: true,
    includeSchemaMarkup: false,
    minify: false,
    tocPosition: 'top',
};

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Generate unique ID from text
 */
function generateId(text: string, index: number): string {
    const slug = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return `${slug}-${index}` || `heading-${index}`;
}

/**
 * Serialize inline marks (bold, italic, etc.)
 */
function serializeMarks(node: JSONContent): string {
    let text = node.text || '';

    if (!node.marks || node.marks.length === 0) {
        return escapeHtml(text);
    }

    // Apply marks in order
    node.marks.forEach((mark) => {
        switch (mark.type) {
            case 'bold':
                text = `<strong>${text}</strong>`;
                break;
            case 'italic':
                text = `<em>${text}</em>`;
                break;
            case 'strike':
                text = `<s>${text}</s>`;
                break;
            case 'code':
                text = `<code class="inline-code">${escapeHtml(node.text || '')}</code>`;
                return; // Already escaped
            case 'link':
                const href = mark.attrs?.href || '#';
                const target = mark.attrs?.target || '_blank';
                text = `<a href="${escapeHtml(href)}" target="${target}" rel="noopener noreferrer">${text}</a>`;
                break;
        }
    });

    return text;
}

/**
 * Serialize node content (children)
 */
function serializeContent(content: JSONContent[] | undefined, context: SerializerContext): string {
    if (!content) return '';
    return content.map((node) => serializeNode(node, context)).join('');
}

interface SerializerContext {
    headingIndex: number;
    headings: Array<{ id: string; text: string; level: number }>;
    faqs: Array<{ question: string; answer: string }>;
    ctas: number;
    prosConsBlocks: number;
    wordCount: number;
}

/**
 * Serialize a single node to clean HTML
 */
function serializeNode(node: JSONContent, context: SerializerContext): string {
    switch (node.type) {
        case 'doc':
            return serializeContent(node.content, context);

        case 'text':
            const text = node.text || '';
            context.wordCount += text.split(/\s+/).filter(Boolean).length;
            return serializeMarks(node);

        case 'paragraph':
            const pContent = serializeContent(node.content, context);
            if (!pContent.trim()) return '';
            return `<p>${pContent}</p>\n`;

        case 'heading':
            const level = node.attrs?.level || 2;
            const headingText = extractText(node);
            const headingId = generateId(headingText, context.headingIndex++);

            context.headings.push({
                id: headingId,
                text: headingText,
                level,
            });

            return `<h${level} id="${headingId}" class="heading-${level}">${serializeContent(node.content, context)}</h${level}>\n`;

        case 'bulletList':
            return `<ul class="bullet-list">\n${serializeContent(node.content, context)}</ul>\n`;

        case 'orderedList':
            return `<ol class="ordered-list">\n${serializeContent(node.content, context)}</ol>\n`;

        case 'listItem':
            return `  <li>${serializeContent(node.content, context).replace(/<\/?p>/g, '')}</li>\n`;

        case 'blockquote':
            return `<blockquote class="quote-block">\n${serializeContent(node.content, context)}</blockquote>\n`;

        case 'codeBlock':
            const language = node.attrs?.language || '';
            const codeContent = extractText(node);
            return `<pre class="code-block" data-language="${escapeHtml(language)}"><code>${escapeHtml(codeContent)}</code></pre>\n`;

        case 'horizontalRule':
            return `<hr class="divider" />\n`;

        case 'hardBreak':
            return `<br />\n`;

        // Custom Blocks
        case 'callToAction':
            context.ctas++;
            return serializeCallToAction(node.attrs);

        case 'faqBlock':
            return serializeFaqBlock(node.attrs, context);

        case 'prosConsBlock':
            context.prosConsBlocks++;
            return serializeProsConsBlock(node.attrs);

        default:
            // Handle unknown nodes by serializing their content
            if (node.content) {
                return serializeContent(node.content, context);
            }
            return '';
    }
}

/**
 * Extract plain text from a node
 */
function extractText(node: JSONContent): string {
    if (node.type === 'text') {
        return node.text || '';
    }
    if (node.content) {
        return node.content.map(extractText).join('');
    }
    return '';
}

/**
 * Serialize Call to Action block
 */
function serializeCallToAction(attrs: Record<string, any> | undefined): string {
    const {
        title = 'Get Started',
        description = '',
        buttonText = 'Click Here',
        buttonUrl = '#',
        variant = 'primary',
    } = attrs || {};

    return `
<div class="cta-block" data-variant="${escapeHtml(variant)}">
  <div class="cta-content">
    <h3 class="cta-title">${escapeHtml(title)}</h3>
    <p class="cta-description">${escapeHtml(description)}</p>
  </div>
  <a href="${escapeHtml(buttonUrl)}" class="cta-button" target="_blank" rel="noopener noreferrer">
    ${escapeHtml(buttonText)}
  </a>
</div>
`;
}

/**
 * Serialize FAQ block with proper structure for widget.js
 */
function serializeFaqBlock(attrs: Record<string, any> | undefined, context: SerializerContext): string {
    const {
        title = 'Frequently Asked Questions',
        items = [],
    } = attrs || {};

    const faqItems = items as Array<{ id: string; question: string; answer: string }>;

    // Add to context for schema generation
    faqItems.forEach((item) => {
        context.faqs.push({
            question: item.question,
            answer: item.answer,
        });
    });

    const faqItemsHtml = faqItems
        .map(
            (item, index) => `
  <div class="faq-item" data-faq-index="${index}">
    <div class="faq-question" data-question="${escapeHtml(item.question)}">
      <span class="faq-question-text">${escapeHtml(item.question)}</span>
      <span class="faq-toggle-icon"></span>
    </div>
    <div class="faq-answer" data-answer="${escapeHtml(item.answer)}">
      <p>${escapeHtml(item.answer)}</p>
    </div>
  </div>`
        )
        .join('\n');

    return `
<div class="faq-block" data-faq-count="${faqItems.length}">
  <h3 class="faq-title">${escapeHtml(title)}</h3>
  <div class="faq-list">
${faqItemsHtml}
  </div>
</div>
`;
}

/**
 * Serialize Pros/Cons block
 */
function serializeProsConsBlock(attrs: Record<string, any> | undefined): string {
    const {
        title = 'Pros & Cons',
        pros = [],
        cons = [],
    } = attrs || {};

    const prosHtml = (pros as string[])
        .map((pro) => `      <li class="pros-item">${escapeHtml(pro)}</li>`)
        .join('\n');

    const consHtml = (cons as string[])
        .map((con) => `      <li class="cons-item">${escapeHtml(con)}</li>`)
        .join('\n');

    return `
<div class="pros-cons-block" data-pros-count="${pros.length}" data-cons-count="${cons.length}">
  <h3 class="pros-cons-title">${escapeHtml(title)}</h3>
  <div class="pros-cons-grid">
    <div class="pros-column">
      <h4 class="pros-heading">
        <span class="pros-icon"></span>
        Pros
      </h4>
      <ul class="pros-list">
${prosHtml}
      </ul>
    </div>
    <div class="cons-column">
      <h4 class="cons-heading">
        <span class="cons-icon"></span>
        Cons
      </h4>
      <ul class="cons-list">
${consHtml}
      </ul>
    </div>
  </div>
</div>
`;
}

/**
 * Generate TOC HTML placeholder
 */
function generateTOCPlaceholder(): string {
    return `<!-- Table of Contents - Auto-generated by widget.js -->
<div id="my-tool-toc" class="toc-container"></div>
`;
}

/**
 * Generate FAQ Schema JSON-LD
 */
function generateFaqSchema(faqs: Array<{ question: string; answer: string }>): object | null {
    if (faqs.length === 0) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer,
            },
        })),
    };
}

/**
 * Minify HTML output
 */
function minifyHtml(html: string): string {
    return html
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .replace(/>\s+</g, '><') // Remove whitespace between tags
        .replace(/\s{2,}/g, ' ') // Collapse multiple spaces
        .trim();
}

/**
 * Main export function - serialize JSON content to clean HTML
 */
export function serializeToCleanHTML(
    content: JSONContent,
    options: Partial<SerializerOptions> = {}
): ExportResult {
    const opts = { ...defaultOptions, ...options };

    const context: SerializerContext = {
        headingIndex: 0,
        headings: [],
        faqs: [],
        ctas: 0,
        prosConsBlocks: 0,
        wordCount: 0,
    };

    // Serialize the content
    let html = serializeNode(content, context);

    // Add TOC placeholder
    if (opts.includeTOC) {
        const tocHtml = generateTOCPlaceholder();

        if (opts.tocPosition === 'top') {
            html = tocHtml + '\n' + html;
        } else if (opts.tocPosition === 'afterFirstHeading') {
            // Insert after first heading
            const firstHeadingMatch = html.match(/<\/h[1-6]>/);
            if (firstHeadingMatch && firstHeadingMatch.index !== undefined) {
                const insertPosition = firstHeadingMatch.index + firstHeadingMatch[0].length;
                html = html.slice(0, insertPosition) + '\n' + tocHtml + html.slice(insertPosition);
            } else {
                html = tocHtml + '\n' + html;
            }
        }
    }

    // Wrap in article container
    html = `<article class="post-body">\n${html}</article>`;

    // Minify if requested
    if (opts.minify) {
        html = minifyHtml(html);
    }

    // Generate schemas
    const faqSchema = generateFaqSchema(context.faqs);

    return {
        html,
        faqSchema,
        articleSchema: null, // Will be generated by widget.js based on page context
        stats: {
            headings: context.headings.length,
            faqs: context.faqs.length,
            ctas: context.ctas,
            prosConsBlocks: context.prosConsBlocks,
            wordCount: context.wordCount,
        },
    };
}

/**
 * Generate standalone schema script tag
 */
export function generateSchemaScript(schema: object): string {
    return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
}

export default serializeToCleanHTML;
