import * as http from "http";
import { IncomingMessage, ServerResponse } from "http";
import { serveIndex } from "./handlers/indexHandler";
import { serveFile } from "./handlers/fileHandler";
import { getCount, incrementCount, resetCount } from "./handlers/countHandler";

const PORT = 8000;

http
  .createServer(
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (req.method === "GET") {
        switch (req.url) {
          case "/count":
            await getCount(req, res);
            break;
          case "/":
            await serveIndex(req, res);
            break;
          default:
            await serveFile(req, res);
            break;
        }
        return;
      }

      if (req.method === "POST") {
        switch (req.url) {
          case "/increment":
            await incrementCount(req, res);
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
