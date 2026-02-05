# MCP Teamleader Focus

[![CI](https://github.com/globodai-group/mcp-teamleader/actions/workflows/ci.yml/badge.svg)](https://github.com/globodai-group/mcp-teamleader/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/globodai-mcp-teamleader.svg)](https://www.npmjs.com/package/globodai-mcp-teamleader)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for **Teamleader Focus CRM**. Gives AI assistants (Claude, etc.) the ability to manage contacts, companies, deals, tasks, events, and invoices directly in Teamleader.

## Features

- 📇 **Contacts** — List, get, create, update contacts
- 🏢 **Companies** — List, get, create companies
- 💰 **Deals** — List, get, create, update deals/opportunities
- ✅ **Tasks** — List, create tasks
- 📅 **Events** — List, get, create calendar events
- 🧾 **Invoices** — List, get, create draft invoices
- 🔐 **OAuth2** — Automatic token refresh with rotation support

## Prerequisites

You need a **Teamleader Focus** account with API access:

1. Go to the [Teamleader Marketplace](https://marketplace.focus.teamleader.eu/) or [Developer Portal](https://developer.focus.teamleader.eu/)
2. Register an integration to get your **Client ID** and **Client Secret**
3. Complete the OAuth2 flow to obtain a **Refresh Token**

## Quick Start

### Using npx (no install needed)

```bash
npx globodai-mcp-teamleader
```

### Global install

```bash
npm install -g globodai-mcp-teamleader
mcp-teamleader
```

## Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `TEAMLEADER_CLIENT_ID` | ✅ | Your OAuth2 Client ID |
| `TEAMLEADER_CLIENT_SECRET` | ✅ | Your OAuth2 Client Secret |
| `TEAMLEADER_REFRESH_TOKEN` | ✅ | Your OAuth2 Refresh Token |

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "teamleader": {
      "command": "npx",
      "args": ["-y", "globodai-mcp-teamleader"],
      "env": {
        "TEAMLEADER_CLIENT_ID": "YOUR_CLIENT_ID",
        "TEAMLEADER_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
        "TEAMLEADER_REFRESH_TOKEN": "YOUR_REFRESH_TOKEN"
      }
    }
  }
}
```

### Cursor / Windsurf

Add to your MCP settings:

```json
{
  "mcpServers": {
    "teamleader": {
      "command": "npx",
      "args": ["-y", "globodai-mcp-teamleader"],
      "env": {
        "TEAMLEADER_CLIENT_ID": "YOUR_CLIENT_ID",
        "TEAMLEADER_CLIENT_SECRET": "YOUR_CLIENT_SECRET",
        "TEAMLEADER_REFRESH_TOKEN": "YOUR_REFRESH_TOKEN"
      }
    }
  }
}
```

### Docker

```bash
docker run -e TEAMLEADER_CLIENT_ID=YOUR_CLIENT_ID \
           -e TEAMLEADER_CLIENT_SECRET=YOUR_CLIENT_SECRET \
           -e TEAMLEADER_REFRESH_TOKEN=YOUR_REFRESH_TOKEN \
           ghcr.io/globodai-group/mcp-teamleader
```

## Available Tools

### Contacts

| Tool | Description |
|------|-------------|
| `teamleader_list_contacts` | List contacts with filtering (term, tags, updated_since) and pagination |
| `teamleader_get_contact` | Get detailed info for a specific contact |
| `teamleader_create_contact` | Create a new contact (name, email, phone, tags...) |
| `teamleader_update_contact` | Update an existing contact |

### Companies

| Tool | Description |
|------|-------------|
| `teamleader_list_companies` | List companies with filtering (term, tags, VAT number) and pagination |
| `teamleader_get_company` | Get detailed info for a specific company |
| `teamleader_create_company` | Create a new company |

### Deals

| Tool | Description |
|------|-------------|
| `teamleader_list_deals` | List deals with filtering (term, phase, responsible user) and pagination |
| `teamleader_get_deal` | Get detailed info for a specific deal |
| `teamleader_create_deal` | Create a new deal with customer, phase, and estimated value |
| `teamleader_update_deal` | Update an existing deal |

### Tasks

| Tool | Description |
|------|-------------|
| `teamleader_list_tasks` | List tasks with filtering and pagination |
| `teamleader_create_task` | Create a new task with description, due date, assignee |

### Events

| Tool | Description |
|------|-------------|
| `teamleader_list_events` | List calendar events with date range filtering |
| `teamleader_get_event` | Get detailed info for a specific event |
| `teamleader_create_event` | Create a new calendar event |

### Invoices

| Tool | Description |
|------|-------------|
| `teamleader_list_invoices` | List invoices with filtering (status, date range, department) |
| `teamleader_get_invoice` | Get detailed info for a specific invoice |
| `teamleader_create_invoice` | Create a new draft invoice with line items |

## Example Prompts

Once configured, you can ask your AI assistant things like:

- *"List all my contacts tagged with 'VIP'"*
- *"Create a new company called Acme Corp with email info@acme.example.com"*
- *"Show me all open deals worth more than €10,000"*
- *"Create a task to follow up with contact John Doe by next Friday"*
- *"List all unpaid invoices from this month"*
- *"Create a draft invoice for company X with 2 line items"*

## API Reference

This MCP server wraps the [Teamleader Focus API](https://developer.focus.teamleader.eu/). Key details:

- **Base URL:** `https://api.focus.teamleader.eu`
- **Authentication:** OAuth2 with automatic token refresh
- **All endpoints use POST** with JSON body
- **Pagination:** Uses `page.number` and `page.size` parameters

## Development

```bash
# Clone
git clone https://github.com/globodai-group/mcp-teamleader.git
cd mcp-teamleader

# Install
npm install

# Dev mode
npm run dev

# Build
npm run build

# Type check
npm run typecheck
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

[MIT](LICENSE) — Made with ❤️ by [Globodai](https://globodai.com)
