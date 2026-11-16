import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Polling avoids missed file-change events in synchronized project folders.
  server: { watch: { usePolling: true, interval: 500 } },
})
