import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                notion: {
                    default: '#37352F',
                    gray: '#787774',
                    brown: '#9F6B53',
                    orange: '#D9730D',
                    yellow: '#CB912F',
                    green: '#448361',
                    blue: '#337EA9',
                    purple: '#9065B0',
                    pink: '#C14C8A',
                    red: '#D44C47',
                    bg: {
                        default: '#FFFFFF',
                        hover: '#F7F6F3',
                        gray: '#F1F1EF',
                        selected: '#E8E7E4',
                    },
                    border: '#E9E9E7',
                },
            },
            fontFamily: {
                sans: [
                    'ui-sans-serif',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Helvetica',
                    '"Apple Color Emoji"',
                    'Arial',
                    'sans-serif',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                ],
            },
            typography: {
                DEFAULT: {
                    css: {
                        maxWidth: 'none',
                        color: '#37352F',
                        lineHeight: '1.5',
                    },
                },
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};

export default config;
