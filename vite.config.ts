import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// https://vite.dev/config/
export default defineConfig({
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths()
  ],
  server: {
    // 移除本地代理，因为我们在本地开发时无法运行 Vercel Functions
    // 如果要测试，建议使用 Vercel CLI: `vercel dev`
    // 或者我们保留这个代理，但仅用于直接连接 Coze API (此时 Token 仍需暴露在 .env)
    // 为了安全，建议完全通过 Vercel 部署后测试，或者本地用 vercel dev
  },
})
