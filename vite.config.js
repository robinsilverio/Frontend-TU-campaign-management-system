import { fileURLToPath, URL } from "node:url";
import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import mkCert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return defineConfig({
    base: '/campaign-management-frontend/',
    define: {
      "process.env": env,
    },
    server: { https: true },
    plugins: [
      vue(),
      mkCert()
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });
}
