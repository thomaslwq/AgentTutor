import path from 'path'
import { defineConfig } from '@lark-apaas/coding-preset-vite-react'

export default defineConfig({
  // GitHub Pages 部署在 /AgentTutor/ 子路径下，CI 构建时通过 CLIENT_BASE_PATH 注入
  base: process.env.CLIENT_BASE_PATH ?? "/",
  resolve: {
    // 优先解析 TypeScript 源码，避免同目录下的编译产物 .js 覆盖 .ts/.tsx
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
})
