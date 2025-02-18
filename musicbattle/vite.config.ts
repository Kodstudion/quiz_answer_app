import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Kolla om vi kör i GitHub Pages-miljö
const isGitHubPages = process.env.NODE_ENV === "production";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  base: isGitHubPages ? "/quiz_answer_app/" : "/", // Anpassa basen
})