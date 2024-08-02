import { IncomingMessage } from "http";

export const parseBody = <T>(req: IncomingMessage): Promise<T> => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const data = JSON.parse(body);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  });
};
