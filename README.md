# mcp-books

Books MCP — wraps Open Library API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/books/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Books data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

```bash
curl -X POST https://gateway.pipeworx.io/v1/tools/books_search_books \
  -H 'Content-Type: application/json' \
  -d '{"query":"1984 George Orwell"}'
```

No account needed for the first calls. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/books_search_books`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
