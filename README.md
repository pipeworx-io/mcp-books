# @pipeworx/mcp-books

MCP server for book data -- search and browse via [Open Library](https://openlibrary.org/) (free, no auth required).

## Tools

| Tool | Description |
|------|-------------|
| `search_books` | Search books by title, author, or keyword |
| `get_book` | Get full details for a book by ISBN |
| `get_author` | Get biography and info for an author by Open Library key |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "books": {
      "url": "https://gateway.pipeworx.io/books/mcp"
    }
  }
}
```

Or run via CLI:

```bash
npx pipeworx use books
```

## License

MIT
