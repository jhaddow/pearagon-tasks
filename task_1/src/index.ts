import prompt from "prompt-sync";
import "dotenv/config";
import { search as bookSearch, SearchResponse } from "./services/books";

async function run() {
  while (true) {
    const input = prompt();
    const searchTerm = input("Enter book title: ", "");

    if (!searchTerm || !searchTerm.trim()) {
      console.error("No search term provided");
      return;
    }

    // execute search
    const result = await bookSearch(searchTerm);

    handleResult(result);
  }
}

function handleResult(result: SearchResponse) {
  if (!result.ok || !result.data) {
    console.error(result.error?.message ?? "Unknown error");
    console.log();
    return;
  }

  const { book, authors } = result.data;

  if (!book.ok || !book.data) {
    console.error("Unable to find book");
    return;
  }

  const { title, description } = book.data;

  const authorNames = authors
    .map((author) => {
      if (!author.ok || !author.data) {
        return "Unknown";
      }

      const { firstName, middleInitial, lastName } = author.data;

      if (middleInitial) {
        return `${firstName} ${middleInitial} ${lastName}`;
      }

      return `${firstName} ${lastName}`;
    })
    .join(", ");

  console.log(`Book: ${title}`);
  console.log(`Description: ${description}`);
  console.log(`Author(s): ${authorNames}`);
  console.log();
}

run();
