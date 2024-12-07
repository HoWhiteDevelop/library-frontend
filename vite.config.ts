import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: "gzip",
      ext: ".gz",
    }),
  ],
  server: {
    host: "0.0.0.0",
    open: true, // 自动打开浏览器
    port: 5173, // 指定端口号
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) {
              return "react-vendor";
            }
            if (id.includes("antd")) {
              return "antd-vendor";
            }
            return "vendor";
          }
        },
      },
    },
    // 启用源码映射
    sourcemap: false,
    // 消除打包大小警告
    chunkSizeWarningLimit: 2000,
  },
  // css: {
  //   postcss: {
  //     from: undefined,
  //   },
  // },
});
