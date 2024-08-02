import * as fs from "fs";
import * as path from "path";
import { IncomingMessage, ServerResponse } from "http";
import { MIME_TYPES } from "../utils/mimeTypes";

const STATIC_PATH = path.join(__dirname, "../public");

const toBool = [() => true, () => false];

const prepareFile = async (url: string) => {
  const filePath = path.join(STATIC_PATH, url);
  const pathTraversal = !filePath.startsWith(STATIC_PATH);
  const exists = await fs.promises.access(filePath).then(...toBool);
  const found = !pathTraversal && exists;
  const streamPath = found ? filePath : path.join(STATIC_PATH, "404.html");
  const ext = path.extname(streamPath).substring(1).toLowerCase();
  const stream = fs.createReadStream(streamPath);
  return { found, ext, stream };
};

export const serveFile = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url ?? "";
  const file = await prepareFile(url);
  const statusCode = file.found ? 200 : 404;
  const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
  res.writeHead(statusCode, { "Content-Type": mimeType });
  file.stream.pipe(res);
};
