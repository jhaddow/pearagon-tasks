import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { serveIndex } from "./handlers/indexHandler";
import { serveFile } from "./handlers/fileHandler";
import {
  incrementCount,
  multiplyCount,
  resetCount,
} from "./handlers/countHandler";

const PORT = 8000;

http
  .createServer(
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (req.method === "GET") {
        if (req.url === "/") {
          await serveIndex(req, res);
        } else {
          await serveFile(req, res);
        }
        return;
      }

      if (req.method === "POST") {
        switch (req.url) {
          case "/increment":
            await incrementCount(req, res);
            break;
          case "/multiply":
            await multiplyCount(req, res);
            break;
          case "/reset":
            await resetCount(req, res);
            break;
          default:
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Not Found" }));
        }
      }
    }
  )
  .listen(PORT, () =>
    console.log(`Server running at http://127.0.0.1:${PORT}/`)
  );
