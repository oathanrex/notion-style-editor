/**
 * Text Analysis Utilities
 * Keyword Density & Reading Time calculations
 * Based on common SEO analysis patterns
 */

export interface TextStats {
    // Basic counts
    characterCount: number;
    characterCountNoSpaces: number;
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;

    // Reading metrics
    readingTime: {
        minutes: number;
        seconds: number;
        text: string;
    };
    speakingTime: {
        minutes: number;
        seconds: number;
        text: string;
    };

    // Content structure
    headingCount: {
        h1: number;
        h2: number;
        h3: number;
        total: number;
    };
    linkCount: {
        internal: number;
        external: number;
        total: number;
    };
    imageCount: number;
}

export interface KeywordAnalysis {
    keyword: string;
    count: number;
    density: number;
    prominence: number;
    inTitle: boolean;
    inFirstParagraph: boolean;
    inHeadings: boolean;
    distribution: 'good' | 'front-heavy' | 'back-heavy' | 'poor';
    status: 'optimal' | 'low' | 'high' | 'missing';
}

export interface TopKeyword {
    word: string;
    count: number;
    density: number;
}

// Common stop words to exclude from keyword analysis
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
    'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'must', 'shall', 'can', 'need', 'dare', 'ought',
    'used', 'it', 'its', "it's", 'this', 'that', 'these', 'those', 'i', 'you',
    'he', 'she', 'we', 'they', 'what', 'which', 'who', 'whom', 'whose',
    'where', 'when', 'why', 'how', 'all', 'each', 'every', 'both', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only',
    'own', 'same', 'so', 'than', 'too', 'very', 'just', 'also', 'now',
    'here', 'there', 'then', 'once', 'if', 'because', 'about', 'into',
    'through', 'during', 'before', 'after', 'above', 'below', 'between',
    'under', 'again', 'further', 'while', 'your', 'my', 'his', 'her', 'our'
]);

// Reading speed constants (words per minute)
const READING_SPEED = {
    slow: 150,
    average: 200,
    fast: 250,
};

const SPEAKING_SPEED = {
    slow: 100,
    average: 130,
    fast: 160,
};

/**
 * Extract plain text from HTML
 */
export function extractTextFromHTML(html: string): string {
    if (typeof document === 'undefined') return ''; // Safety check for SSR
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
    const words = text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0);
    return words.length;
}

/**
 * Count sentences in text
 */
export function countSentences(text: string): number {
    const sentences = text
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim().length > 0);
    return sentences.length;
}

/**
 * Count paragraphs in HTML
 */
export function countParagraphs(html: string): number {
    if (typeof document === 'undefined') return 0;
    const div = document.createElement('div');
    div.innerHTML = html;
    const paragraphs = div.querySelectorAll('p');
    let count = 0;
    paragraphs.forEach(p => {
        if (p.textContent && p.textContent.trim().length > 0) {
            count++;
        }
    });
    return Math.max(count, 1);
}

/**
 * Calculate reading time
 */
export function calculateReadingTime(
    wordCount: number,
    speed: 'slow' | 'average' | 'fast' = 'average'
): { minutes: number; seconds: number; text: string } {
    const wpm = READING_SPEED[speed];
    const totalSeconds = Math.ceil((wordCount / wpm) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let text = '';
    if (minutes === 0) {
        text = seconds <= 30 ? 'Less than a minute' : '< 1 min read';
    } else if (minutes === 1) {
        text = '1 min read';
    } else {
        text = `${minutes} min read`;
    }

    return { minutes, seconds, text };
}

/**
 * Calculate speaking time
 */
export function calculateSpeakingTime(
    wordCount: number,
    speed: 'slow' | 'average' | 'fast' = 'average'
): { minutes: number; seconds: number; text: string } {
    const wpm = SPEAKING_SPEED[speed];
    const totalSeconds = Math.ceil((wordCount / wpm) * 60);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    let text = '';
    if (minutes === 0) {
        text = `${seconds}s speaking time`;
    } else if (minutes === 1) {
        text = `1 min ${seconds}s speaking`;
    } else {
        text = `${minutes} min ${seconds}s speaking`;
    }

    return { minutes, seconds, text };
}

/**
 * Count headings in HTML
 */
export function countHeadings(html: string): { h1: number; h2: number; h3: number; total: number } {
    if (typeof document === 'undefined') return { h1: 0, h2: 0, h3: 0, total: 0 };
    const div = document.createElement('div');
    div.innerHTML = html;

    const h1 = div.querySelectorAll('h1').length;
    const h2 = div.querySelectorAll('h2').length;
    const h3 = div.querySelectorAll('h3').length;

    return {
        h1,
        h2,
        h3,
        total: h1 + h2 + h3,
    };
}

/**
 * Count links in HTML
 */
export function countLinks(html: string): { internal: number; external: number; total: number } {
    if (typeof document === 'undefined') return { internal: 0, external: 0, total: 0 };
    const div = document.createElement('div');
    div.innerHTML = html;
    const links = div.querySelectorAll('a[href]');

    let internal = 0;
    let external = 0;
    const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';

    links.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('http')) {
            try {
                const url = new URL(href);
                if (url.hostname === currentHost || url.hostname === '') {
                    internal++;
                } else {
                    external++;
                }
            } catch {
                internal++;
            }
        } else if (href.startsWith('#') || href.startsWith('/')) {
            internal++;
        }
    });

    return { internal, external, total: internal + external };
}

/**
 * Count images in HTML
 */
export function countImages(html: string): number {
    if (typeof document === 'undefined') return 0;
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.querySelectorAll('img').length;
}

/**
 * Get complete text statistics
 */
export function getTextStats(html: string): TextStats {
    const text = extractTextFromHTML(html);
    const wordCount = countWords(text);

    return {
        characterCount: text.length,
        characterCountNoSpaces: text.replace(/\s/g, '').length,
        wordCount,
        sentenceCount: countSentences(text),
        paragraphCount: countParagraphs(html),
        readingTime: calculateReadingTime(wordCount),
        speakingTime: calculateSpeakingTime(wordCount),
        headingCount: countHeadings(html),
        linkCount: countLinks(html),
        imageCount: countImages(html),
    };
}

/**
 * Tokenize text into words
 */
function tokenize(text: string): string[] {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 2 && !STOP_WORDS.has(word));
}

/**
 * Calculate keyword density
 */
export function calculateKeywordDensity(
    keyword: string,
    text: string,
    html: string
): KeywordAnalysis {
    const normalizedKeyword = keyword.toLowerCase().trim();
    const normalizedText = text.toLowerCase();
    const wordCount = countWords(text);

    if (!normalizedKeyword || wordCount === 0) {
        return {
            keyword: normalizedKeyword,
            count: 0,
            density: 0,
            prominence: 0,
            inTitle: false,
            inFirstParagraph: false,
            inHeadings: false,
            distribution: 'poor',
            status: 'missing',
        };
    }

    // Count keyword occurrences (including phrases)
    const keywordRegex = new RegExp(normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const matches = normalizedText.match(keywordRegex) || [];
    const count = matches.length;

    // Calculate density (percentage)
    const keywordWordCount = normalizedKeyword.split(/\s+/).length;
    const density = (count * keywordWordCount / wordCount) * 100;

    // Check if keyword is in important places
    const div = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (div) div.innerHTML = html;

    // Check title/h1
    let inTitle = false;
    if (div) {
        const h1Elements = div.querySelectorAll('h1');
        h1Elements.forEach(h1 => {
            if (h1.textContent?.toLowerCase().includes(normalizedKeyword)) {
                inTitle = true;
            }
        });
    }

    // Check first paragraph
    let inFirstParagraph = false;
    if (div) {
        const firstParagraph = div.querySelector('p');
        inFirstParagraph = firstParagraph?.textContent?.toLowerCase().includes(normalizedKeyword) || false;
    }

    // Check all headings
    let inHeadings = false;
    if (div) {
        const headings = div.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            if (heading.textContent?.toLowerCase().includes(normalizedKeyword)) {
                inHeadings = true;
            }
        });
    }

    // Calculate prominence (position-based score)
    const firstOccurrence = normalizedText.indexOf(normalizedKeyword);
    const prominence = firstOccurrence === -1 ? 0 : Math.max(0, 100 - (firstOccurrence / normalizedText.length) * 100);

    // Analyze distribution
    const textLength = normalizedText.length;
    const positions = [];
    let pos = normalizedText.indexOf(normalizedKeyword);
    while (pos !== -1) {
        positions.push(pos / textLength);
        pos = normalizedText.indexOf(normalizedKeyword, pos + 1);
    }

    let distribution: 'good' | 'front-heavy' | 'back-heavy' | 'poor' = 'poor';
    if (positions.length >= 3) {
        const avgPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
        const hasStart = positions.some(p => p < 0.2);
        const hasMiddle = positions.some(p => p >= 0.3 && p <= 0.7);
        const hasEnd = positions.some(p => p > 0.8);

        if (hasStart && hasMiddle && hasEnd) {
            distribution = 'good';
        } else if (avgPosition < 0.4) {
            distribution = 'front-heavy';
        } else if (avgPosition > 0.6) {
            distribution = 'back-heavy';
        }
    } else if (positions.length > 0) {
        distribution = 'poor';
    }

    // Determine status based on density
    let status: 'optimal' | 'low' | 'high' | 'missing' = 'missing';
    if (count === 0) {
        status = 'missing';
    } else if (density < 0.5) {
        status = 'low';
    } else if (density > 3) {
        status = 'high';
    } else {
        status = 'optimal';
    }

    return {
        keyword: normalizedKeyword,
        count,
        density: Math.round(density * 100) / 100,
        prominence: Math.round(prominence * 100) / 100,
        inTitle,
        inFirstParagraph,
        inHeadings,
        distribution,
        status,
    };
}

/**
 * Get top keywords from text
 */
export function getTopKeywords(text: string, limit: number = 10): TopKeyword[] {
    const words = tokenize(text);
    const wordCount = countWords(text);
    const frequency: Record<string, number> = {};

    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    const sorted = Object.entries(frequency)
        .map(([word, count]) => ({
            word,
            count,
            density: Math.round((count / wordCount) * 100 * 100) / 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    return sorted;
}

/**
 * Get two-word phrases (bigrams)
 */
export function getTopPhrases(text: string, limit: number = 5): TopKeyword[] {
    const words = tokenize(text);
    const wordCount = countWords(text);
    const phrases: Record<string, number> = {};

    for (let i = 0; i < words.length - 1; i++) {
        const phrase = `${words[i]} ${words[i + 1]}`;
        phrases[phrase] = (phrases[phrase] || 0) + 1;
    }

    const sorted = Object.entries(phrases)
        .filter(([, count]) => count >= 2)
        .map(([phrase, count]) => ({
            word: phrase,
            count,
            density: Math.round((count * 2 / wordCount) * 100 * 100) / 100,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);

    return sorted;
}

export default {
    getTextStats,
    calculateKeywordDensity,
    getTopKeywords,
    getTopPhrases,
    extractTextFromHTML,
    countWords,
    calculateReadingTime,
    calculateSpeakingTime,
};
