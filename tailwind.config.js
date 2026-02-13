/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#C86030', // Rust Orange (Logo)
                    dark: '#A84B25',    // Darker Rust
                    light: '#EA8C55',   // Lighter Orange
                },
                navy: {
                    DEFAULT: '#0B1F3B', // Deep Navy (Logo)
                    light: '#1e3a5f',
                },
                cream: {
                    DEFAULT: '#FAF8F5', // Ultra Light Cream
                    dark: '#F2EEE9',    // Warm Gray
                },
            },
            fontFamily: {
                sans: ['var(--font-outfit)', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
