interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * Books MCP — wraps Open Library API (free, no auth)
 *
 * Tools:
 * - search_books: search by title, author, or keyword
 * - get_book: full details for a book by ISBN
 * - get_author: author biography and key info
 */


const BASE_URL = 'https://openlibrary.org';

type SearchDoc = {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  isbn?: string[];
  cover_i?: number;
  key: string;
  number_of_pages_median?: number;
  subject?: string[];
};

type BookDetails = {
  title: string;
  authors?: { key: string }[];
  publish_date?: string;
  number_of_pages?: number;
  subjects?: string[];
  description?: string | { value: string };
  covers?: number[];
};

type AuthorDetails = {
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { value: string };
  wikipedia?: string;
};

const tools: McpToolExport['tools'] = [
  {
    name: 'search_books',
    description:
      'Search for books by title, author, or keyword. Returns title, author, year, ISBN, and cover image URL.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query (title, author, or keywords)' },
        limit: { type: 'number', description: 'Number of results to return (1-20, default 5)' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_book',
    description: 'Get full details for a book by ISBN.',
    inputSchema: {
      type: 'object',
      properties: {
        isbn: { type: 'string', description: 'ISBN-10 or ISBN-13' },
      },
      required: ['isbn'],
    },
  },
  {
    name: 'get_author',
    description:
      'Get biography and key info for an author using their Open Library author key (e.g., "OL23919A").',
    inputSchema: {
      type: 'object',
      properties: {
        author_key: {
          type: 'string',
          description: 'Open Library author key (e.g., OL23919A)',
        },
      },
      required: ['author_key'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case 'search_books':
      return searchBooks(args.query as string, (args.limit as number) ?? 5);
    case 'get_book':
      return getBook(args.isbn as string);
    case 'get_author':
      return getAuthor(args.author_key as string);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function searchBooks(query: string, limit: number) {
  const count = Math.min(20, Math.max(1, limit));
  const params = new URLSearchParams({ q: query, limit: String(count) });
  const res = await fetch(`${BASE_URL}/search.json?${params}`);
  if (!res.ok) throw new Error(`Open Library search error: ${res.status}`);

  const data = (await res.json()) as { numFound: number; docs: SearchDoc[] };

  return {
    total_found: data.numFound,
    books: data.docs.map((doc) => ({
      title: doc.title,
      authors: doc.author_name ?? [],
      first_published: doc.first_publish_year ?? null,
      isbn: doc.isbn?.[0] ?? null,
      cover_url: doc.cover_i
        ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
        : null,
      open_library_key: doc.key,
    })),
  };
}

async function getBook(isbn: string) {
  const cleanIsbn = isbn.replace(/[^0-9X]/gi, '');
  const res = await fetch(`${BASE_URL}/isbn/${encodeURIComponent(cleanIsbn)}.json`);
  if (res.status === 404) throw new Error(`Book not found for ISBN: "${isbn}"`);
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);

  const data = (await res.json()) as BookDetails;

  const description =
    typeof data.description === 'string'
      ? data.description
      : data.description?.value ?? null;

  return {
    title: data.title,
    publish_date: data.publish_date ?? null,
    number_of_pages: data.number_of_pages ?? null,
    subjects: (data.subjects ?? []).slice(0, 10),
    description,
    cover_url: data.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-M.jpg`
      : null,
    author_keys: (data.authors ?? []).map((a) => a.key.replace('/authors/', '')),
  };
}

async function getAuthor(authorKey: string) {
  const key = authorKey.replace(/^\/authors\//, '');
  const res = await fetch(`${BASE_URL}/authors/${encodeURIComponent(key)}.json`);
  if (res.status === 404) throw new Error(`Author not found: "${authorKey}"`);
  if (!res.ok) throw new Error(`Open Library error: ${res.status}`);

  const data = (await res.json()) as AuthorDetails;

  const bio =
    typeof data.bio === 'string' ? data.bio : data.bio?.value ?? null;

  return {
    name: data.name,
    birth_date: data.birth_date ?? null,
    death_date: data.death_date ?? null,
    bio,
    wikipedia_url: data.wikipedia ?? null,
  };
}

export default { tools, callTool } satisfies McpToolExport;
