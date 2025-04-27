import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      "assets":path.resolve(__dirname,'./src/assets'),
      '@':path.resolve(__dirname,'./src'),
      'auth':path.resolve(__dirname,'./src/pages/auth'),
      'hooks':path.resolve(__dirname, './src/hooks'),
      "chat":path.resolve(__dirname,"./src/pages/chat"),
      'components':path.resolve(__dirname,'./src/components'),
      'common':path.resolve(__dirname,'./src/pages/common'),
      'pages': path.resolve(__dirname,'./src/pages'),
      'services':path.resolve(__dirname,'./src/services')
    }
  }
})

