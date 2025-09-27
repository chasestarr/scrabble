import fs from "fs";
import http from "http";
import path from "path";
import url from "url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const mimeTypes = {
  ".css": "text/css",
  ".html": "text/html",
  ".js": "text/javascript",
};

async function exists(f) {
  try {
    await fs.promises.stat(f);
    return true;
  } catch {
    return false;
  }
}

const server = http.createServer(async (req, res) => {
  const [url, query] = req.url.split("?");
  req.url = url;

  if (req.url === "/") {
    req.url = "/index.html";
  }

  const filepath = path.join(__dirname, "/static", req.url);
  if (await exists(filepath)) {
    const stream = fs.createReadStream(filepath);
    const mimeType = mimeTypes[path.extname(filepath)];
    res.writeHead(200, { "Content-Type": mimeType });
    stream.pipe(res);
  } else {
    console.warn("failed to serve", req.url);
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.write("file not found");
    res.end();
  }
});

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`server stated on localhost:${port}`));
