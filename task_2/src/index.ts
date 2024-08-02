import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { IncomingMessage, ServerResponse } from "http";
import { parseBody } from "./utils";

import * as count from "./count";

const PORT = 8000;

const STATIC_PATH = path.join(__dirname, "./public");

const MIME_TYPES: { [key: string]: string } = {
  default: "application/octet-stream",
  html: "text/html; charset=UTF-8",
  js: "application/javascript",
  css: "text/css",
  json: "application/json",
};

const toBool = [() => true, () => false];

const prepareFile = async (url: string) => {
  const paths = [STATIC_PATH, url];
  const filePath = path.join(...paths);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : STATIC_PATH + "/404.html";
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};

const serveFile = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url ?? "";
  const file = await prepareFile(url);
  const statusCode = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
  res.writeHead(statusCode, { "Content-Type": mimeType });
  file.stream.pipe(res);
};

const serveIndex = async (req: IncomingMessage, res: ServerResponse) => {
  const filePath = path.join(STATIC_PATH, "index.html");
  const readStream = fs.createReadStream(filePath);
  res.writeHead(200, {
    "Content-Type": MIME_TYPES.html,
  });

  const currentCount = count.get();

  readStream.on("data", (chunk) => {
    const modifiedChunk = chunk
      .toString()
      .replace("{{count}}", currentCount.toString());
    res.write(modifiedChunk);
  });

  readStream.on("end", () => {
    res.end();
  });

  readStream.on("error", (err) => {
    res.writeHead(500, { "Content-Type": MIME_TYPES.html });
    res.end("500 Internal Server Error");
    console.error("Error reading index.html:", err);
  });
};

const resetCount = async (req: IncomingMessage, res: ServerResponse) => {
  count.reset();
  res.writeHead(200, { "Content-Type": MIME_TYPES.json });
  res.write(JSON.stringify({ count: count.get() }));
  res.end();
};

interface IncrementBody {
  increment: number;
}

const incrementCount = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseBody<IncrementBody>(req);
    const { increment } = body;
    const currentCount = count.increment(increment);

    res.writeHead(200, { "Content-Type": MIME_TYPES.json });
    res.write(JSON.stringify({ count: currentCount }));
  } catch (e) {
    res.writeHead(500, { "Content-Type": MIME_TYPES.json });
    res.write(JSON.stringify({ error: e }));
  }
  res.end();
};

interface MultiplyBody {
  multiplier: number;
}

const multiplyCount = async (req: IncomingMessage, res: ServerResponse) => {
  try {
    const body = await parseBody<MultiplyBody>(req);
    const { multiplier } = body;
    count.multiply(multiplier);
    res.writeHead(200, { "Content-Type": MIME_TYPES.json });
    res.write(JSON.stringify({ count: count.get() }));
  } catch (e) {
    res.writeHead(500, { "Content-Type": MIME_TYPES.json });
    res.write(JSON.stringify({ error: e }));
  }
  res.end();
};

http
  .createServer(
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (req.method === "GET") {
        if (req.url === "/") {
          await serveIndex(req, res);
          return;
        }

        await serveFile(req, res);
        return;
      }

      if (req.method === "POST") {
        if (req.url === "/increment") {
          await incrementCount(req, res);
          return;
        }
        if (req.url === "/multiply") {
          await multiplyCount(req, res);
          return;
        }
        if (req.url === "/reset") {
          await resetCount(req, res);
          return;
        }
      }
    }
  )
  .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
