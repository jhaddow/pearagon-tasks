import * as fs from "fs";
import * as path from "path";
import { IncomingMessage, ServerResponse } from "http";
import { MIME_TYPES } from "../utils/mimeTypes";
import * as count from "../count";

export const serveIndex = async (req: IncomingMessage, res: ServerResponse) => {
  const filePath = path.join(__dirname, "../public", "index.html");
  const readStream = fs.createReadStream(filePath);

  res.writeHead(200, { "Content-Type": MIME_TYPES.html });

  const currentCount = count.get();

  readStream.on("data", (chunk) => {
    const modifiedChunk = chunk
      .toString()
      .replace("{{count}}", currentCount.toString());
    res.write(modifiedChunk);
  });

  readStream.on("end", () => res.end());
  readStream.on("error", (err) => {
    console.error("Error reading index.html:", err);
    res.writeHead(500, { "Content-Type": MIME_TYPES.html });
    res.end("500 Internal Server Error");
  });
};
