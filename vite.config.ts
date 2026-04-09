import { defineConfig, loadEnv, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';
import { getJWTToken } from '@coze/api';

// Custom plugin to mock the Vercel Serverless Function for local development
function cozeApiPlugin(mode: string): Plugin {
  let cachedToken: string | null = null;
  let tokenExpiration = 0;

  return {
    name: 'coze-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/coze', async (req, res, next) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
          try {
            const env = loadEnv(mode, process.cwd(), '');
            const now = Math.floor(Date.now() / 1000);
            
            if (!cachedToken || tokenExpiration <= now + 300) {
              const appId = env.COZE_APP_ID || env.VITE_COZE_APP_ID;
              const keyid = env.COZE_KEY_ID || env.VITE_COZE_KEY_ID;
              const privateKey = env.COZE_PRIVATE_KEY || env.VITE_COZE_PRIVATE_KEY;
              const baseURL = env.COZE_BASE_URL || env.VITE_COZE_BASE_URL || 'https://api.coze.cn';
              
              if (!appId || !keyid || !privateKey) {
                throw new Error('Missing JWT OAuth configuration in .env');
              }
              
              const formattedPrivateKey = privateKey.replace(/\\n/g, '\n');
              const aud = baseURL.replace(/^https?:\/\//, '');
              
              const tokenData = await getJWTToken({
                appId,
                keyid,
                privateKey: formattedPrivateKey,
                aud,
                baseURL,
                durationSeconds: 3600
              });
              
              cachedToken = tokenData.access_token;
              tokenExpiration = now + tokenData.expires_in;
            }

            const parsedBody = JSON.parse(body || '{}');
            const targetWorkflowId = env.COZE_WORKFLOW_ID || env.VITE_COZE_WORKFLOW_ID || parsedBody.workflow_id;

            if (!targetWorkflowId) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Missing workflow_id' }));
              return;
            }

            const isStream = parsedBody.stream === true;
            const endpoint = isStream 
              ? 'https://api.coze.cn/v1/workflow/stream_run' 
              : 'https://api.coze.cn/v1/workflow/run';

            // Using global fetch
            const cozeRes = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${cachedToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                workflow_id: targetWorkflowId,
                parameters: parsedBody.parameters || {},
              }),
            });

            if (isStream) {
              res.statusCode = cozeRes.status;
              res.setHeader('Content-Type', 'text/event-stream');
              res.setHeader('Cache-Control', 'no-cache');
              res.setHeader('Connection', 'keep-alive');

              if (cozeRes.body) {
                const reader = cozeRes.body.getReader();
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  res.write(value);
                }
              }
              res.end();
            } else {
              const data = await cozeRes.text();
              res.statusCode = cozeRes.status;
              res.setHeader('Content-Type', 'application/json');
              res.end(data);
            }
          } catch (error: any) {
            console.error('Coze Proxy Error:', error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error.message || 'Internal Server Error' }));
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
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
    tsconfigPaths(),
    cozeApiPlugin(mode)
  ],
  server: {
    // 移除普通代理，改用上面的 cozeApiPlugin 进行完整模拟
  },
}))
