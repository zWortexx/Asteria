import express from "express";
import { createServer } from "http";
import { brotliCompressSync, constants, gzipSync } from "node:zlib";
import { existsSync, readFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentTypes: Record<string, string> = {
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

async function startServer() {
  const app = express();
  const server = createServer(app);

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.get(/^\/assets\/[^/]+\.(?:js|css|json|svg|woff2)$/, (req, res, next) => {
    const relativePath = req.path.replace(/^\/+/, "");
    const assetPath = path.resolve(staticPath, relativePath);
    if (
      !assetPath.startsWith(path.resolve(staticPath) + path.sep) ||
      !existsSync(assetPath)
    ) {
      next();
      return;
    }

    const source = readFileSync(assetPath);
    const acceptEncoding = req.headers["accept-encoding"] ?? "";
    let body = source;
    let encoding: string | undefined;
    if (acceptEncoding.includes("br")) {
      body = brotliCompressSync(source, {
        params: { [constants.BROTLI_PARAM_QUALITY]: 5 },
      });
      encoding = "br";
    } else if (acceptEncoding.includes("gzip")) {
      body = gzipSync(source, { level: 6 });
      encoding = "gzip";
    }

    const extension = path.extname(assetPath).toLowerCase();
    res.setHeader(
      "Content-Type",
      contentTypes[extension] ?? "application/octet-stream"
    );
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader("Vary", "Accept-Encoding");
    if (encoding) res.setHeader("Content-Encoding", encoding);
    res.setHeader("Content-Length", body.byteLength);
    res.end(body);
  });

  app.use(
    express.static(staticPath, {
      setHeaders: (res, filePath) => {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (path.basename(filePath) === "index.html") {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
        }
      },
    })
  );

  app.get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
