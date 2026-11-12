import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** index.html 안의 __SITE_URL__ 을 VITE_SITE_URL 값(끝의 / 제거)으로 치환합니다. */
function siteUrl(url: string): Plugin {
  const clean = url.replace(/\/+$/, '');
  return {
    name: 'tripai-site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', clean),
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    plugins: [react(), tailwindcss(), siteUrl(env.VITE_SITE_URL ?? '')],
  };
});
