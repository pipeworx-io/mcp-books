# mcp-books

Books MCP — wraps Open Library API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `search_books` | Search for books by title, author, or keyword. Returns title, author, year, ISBN, and cover image URL. Use this to discover books before fetching full details. |
| `get_book` | Fetch Open Library edition details for a book by ISBN-10 or ISBN-13. Returns title, publish_date, number_of_pages, subjects (up to 10), description, cover_url, and author_keys for follow-up get_author calls. |
| `get_author` | Fetch an author's profile from Open Library by their author key (e.g., 'OL23919A'). Returns name, birth_date, death_date, biographical summary, and Wikipedia URL. |
| `get_book_work` | Fetch the canonical Open Library "work" record (the concept of a book across all its editions), by work ID (e.g. "OL45804W"). Returns title, description, first publish date, subjects, and author keys. Use search_books to find a work_id (the W-suffixed key); use get_book for a specific edition by ISBN. (Named get_book_work to avoid colliding with Crossref get_work.) |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "books": {
      "url": "https://gateway.pipeworx.io/books/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Books data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
