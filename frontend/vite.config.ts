import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), runtimeErrorOverlay(), themePlugin()],
    server: {
      host: '0.0.0.0',
      port: parseInt(env.PORT) || 5173,
    },
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './client/src') },
        { find: '@db', replacement: path.resolve(__dirname, './db') }
      ],
      extensions: ['.js', '.ts', '.jsx', '.tsx', '']
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      sourcemap: true,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, "client/index.html")
        }
      }
    },
    base: './',
    define: {
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    }
  };
});
