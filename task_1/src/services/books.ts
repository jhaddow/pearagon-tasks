import axios, { AxiosError, AxiosRequestConfig } from "axios";

interface Book {
  id: number;
  title: string;
  description: string;
  authors: number[];
}

interface Author {
  id: number;
  firstName: string;
  lastName: string;
  middleInitial?: string;
}

interface BookResponse {
  ok: boolean;
  data: Book | null;
  error?: Error;
}

interface AuthorResponse {
  ok: boolean;
  data: Author | null;
  error?: Error;
}

export interface SearchResponse {
  ok: boolean;
  data: {
    book: BookResponse;
    authors: AuthorResponse[];
  } | null;
  error?: Error;
}

export async function search(searchTerm: string): Promise<SearchResponse> {
  const bookResponse = await searchBook(searchTerm);
  if (!bookResponse.ok || !bookResponse.data) {
    return {
      ok: false,
      data: null,
      error: bookResponse.error,
    };
  }

  const authorResponses = await searchAuthors(bookResponse.data.authors);

  return {
    ok: true,
    data: {
      book: bookResponse,
      authors: authorResponses,
    },
  };
}

async function searchBook(searchTerm: string): Promise<BookResponse> {
  const data = JSON.stringify({ title: searchTerm });

  const config: AxiosRequestConfig = {
    method: "POST",
    maxBodyLength: Infinity,
    headers: {
      "Content-Type": "application/json",
    },
    url: `${process.env.BOOK_API_URL}/api/books/search`,
    data: data,
  };

  try {
    const response = await axios.request(config);
    return {
      ok: true,
      data: response.data,
    };
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: new Error("Book Not Found"),
    };
  }
}

async function searchAuthors(ids: number[]): Promise<AuthorResponse[]> {
  if (!ids.length) {
    return [
      {
        ok: false,
        data: null,
        error: new Error("No authors found"),
      },
    ];
  }

  return await Promise.all(ids.map(searchAuthor));
}

async function searchAuthor(id: number): Promise<AuthorResponse> {
  const config: AxiosRequestConfig = {
    method: "GET",
    url: `${process.env.BOOK_API_URL}/api/authors/${id}`,
  };

  try {
    const response = await axios.request(config);
    return {
      ok: true,
      data: response.data,
    };
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: new Error("Author Not Found"),
    };
  }
}
