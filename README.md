# mcp-books

Books MCP — wraps Open Library API (free, no auth)

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `get_book` | Get full details for a book by ISBN. |

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

Or use the CLI:

```bash
npx pipeworx use books
```

## License

MIT
