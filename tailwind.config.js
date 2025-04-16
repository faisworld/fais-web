// This is a Tailwind CSS configuration file. It specifies the content paths to scan for class names,
// extends the default theme, and includes any plugins needed. The content paths include all HTML, CSS,
// JavaScript, TypeScript, JSX, and TSX files in the app, components, pages, and styles directories.
// The theme extension is currently empty, but you can add custom styles or configurations here.
// The plugins array is also empty, but you can include any Tailwind CSS plugins you want to use.
/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./app/**/*.{html,css,js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.{css,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};