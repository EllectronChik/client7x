import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), svgrPlugin()],
  server: {
    host: '0.0.0.0', // Разрешить подключения со всех IP-адресов
    port: 5173,
  },
  resolve: {
    alias: {
      '@settings.scss': './src/settings.scss',
    }
  }
})
