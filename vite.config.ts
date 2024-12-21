import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import compression from "vite-plugin-compression";
import fs from "fs";
import path from "path";

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
    {
      name: "handle-avatar-upload",
      configureServer(server) {
        // 确保 profile 目录存在
        const profileDir = path.join(process.cwd(), "public", "profile");
        if (!fs.existsSync(profileDir)) {
          fs.mkdirSync(profileDir, { recursive: true });
        }

        server.middlewares.use(async (req, res, next) => {
          if (req.url === "/api/upload-avatar" && req.method === "POST") {
            try {
              const chunks: Buffer[] = [];

              for await (const chunk of req) {
                chunks.push(Buffer.from(chunk));
              }

              const buffer = Buffer.concat(chunks);
              const boundary =
                req.headers["content-type"]?.split("boundary=")[1];

              if (!boundary) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid request" }));
                return;
              }

              const fileData = extractFileFromMultipart(buffer, boundary);

              if (!fileData) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "No file data" }));
                return;
              }

              const fileName = `${Date.now()}_${fileData.filename}`;
              const filePath = path.join(profileDir, fileName);

              fs.writeFileSync(filePath, fileData.data);

              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  success: true,
                  path: `/profile/${fileName}`,
                })
              );
            } catch (error) {
              console.error("Upload error:", error);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: "Upload failed" }));
            }
          } else {
            next();
          }
        });
      },
    },
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
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
});

function extractFileFromMultipart(buffer: Buffer, boundary: string) {
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  const headerEnd = Buffer.from("\r\n\r\n");

  let pos = buffer.indexOf(boundaryBuffer);
  if (pos === -1) return null;

  while (pos !== -1) {
    const start = pos + boundaryBuffer.length;
    const end = buffer.indexOf(boundaryBuffer, start);
    if (end === -1) break;

    const part = buffer.slice(start, end);
    const headerEndPos = part.indexOf(headerEnd);

    if (headerEndPos !== -1) {
      const header = part.slice(0, headerEndPos).toString();
      if (header.includes("Content-Type: image/")) {
        const filenameMatch = header.match(/filename="([^"]+)"/);
        if (filenameMatch) {
          const data = part.slice(headerEndPos + headerEnd.length);
          return {
            filename: filenameMatch[1],
            data: data,
          };
        }
      }
    }

    pos = end;
  }

  return null;
}
