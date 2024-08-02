import { IncomingMessage, ServerResponse } from "http";
import { parseBody } from "../utils/parseBody";
import * as count from "../count";
import { MIME_TYPES } from "../utils/mimeTypes";

interface IncrementBody {
  increment: number;
}

export const getCount = (req: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { "Content-Type": MIME_TYPES.json });
  res.end(JSON.stringify({ count: count.get() }));
};

export const incrementCount = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  try {
    const body = await parseBody<IncrementBody>(req);
    const { increment } = body;

    if (typeof increment !== "number") {
      res.writeHead(400, { "Content-Type": MIME_TYPES.json });
      res.end(JSON.stringify({ error: "Invalid increment" }));
      return;
    }

    const currentCount = count.increment(increment);
    res.writeHead(200, { "Content-Type": MIME_TYPES.json });
    res.end(JSON.stringify({ count: currentCount }));
  } catch (e: unknown) {
    res.writeHead(500, { "Content-Type": MIME_TYPES.json });
    if (e instanceof Error) {
      res.end(JSON.stringify({ error: e.message }));
      return;
    }
    res.end(JSON.stringify({ error: "Unknown error" }));
  }
};

export const resetCount = async (req: IncomingMessage, res: ServerResponse) => {
  count.reset();
  res.writeHead(200, { "Content-Type": MIME_TYPES.json });
  res.end(JSON.stringify({ count: count.get() }));
};
