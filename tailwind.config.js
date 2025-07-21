/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F73EE',
        success: '#00C896',
        warning: '#FF8C42',
        error: '#FF5A5A',
        neutral: '#6B7280',
        background: '#F9FAFB',
        card: '#FFFFFF',
      },
    },
  },
  plugins: [],
}