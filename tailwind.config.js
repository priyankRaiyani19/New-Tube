/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                background: '#000000',
                card: '#222222',
                primary: {
                    DEFAULT: '#9d4edd',
                    light: '#c77dff',
                    dark: '#e0aaff',
                },
                secondary: {
                    DEFAULT: '#222222',
                    light: '#333333',
                    dark: '#181818',
                },
            },
            animation: {
                pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                pulse: {
                    '0%, 100%': {opacity: 1},
                    '50%': {opacity: 0.5},
                },
            },
        },
    },
    plugins: [],
};