/**
 * Teamleader Tasks Tools
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import type { TeamleaderClient } from "../api/client.js";
import type {
  Task,
  TeamleaderListResponse,
} from "../types/index.js";

export function registerTaskTools(
  server: McpServer,
  client: TeamleaderClient
): void {
  // ── List Tasks ───────────────────────────────────────────────────────────
  server.tool(
    "teamleader_list_tasks",
    "List tasks from Teamleader Focus with optional filtering and pagination",
    {
      page: z.number().optional().describe("Page number (default: 1)"),
      page_size: z.number().optional().describe("Page size (default: 20, max: 100)"),
      term: z.string().optional().describe("Search term to filter tasks"),
      customer_type: z
        .enum(["contact", "company"])
        .optional()
        .describe("Customer type to filter by"),
      customer_id: z
        .string()
        .optional()
        .describe("Customer ID to filter by"),
    },
    async (params) => {
      const body: Record<string, unknown> = {};

      if (params.page || params.page_size) {
        body.page = {
          number: params.page ?? 1,
          size: params.page_size ?? 20,
        };
      }

      const filter: Record<string, unknown> = {};
      if (params.term) filter.term = params.term;
      if (params.customer_type && params.customer_id) {
        filter.customer = {
          type: params.customer_type,
          id: params.customer_id,
        };
      }
      if (Object.keys(filter).length > 0) body.filter = filter;

      const result = await client.request<TeamleaderListResponse<Task>>({
        endpoint: "tasks.list",
        body,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );

  // ── Create Task ──────────────────────────────────────────────────────────
  server.tool(
    "teamleader_create_task",
    "Create a new task in Teamleader Focus",
    {
      description: z.string().describe("Task description"),
      due_on: z
        .string()
        .optional()
        .describe("Due date (YYYY-MM-DD)"),
      customer_type: z
        .enum(["contact", "company"])
        .optional()
        .describe("Link task to a customer type"),
      customer_id: z
        .string()
        .optional()
        .describe("Link task to a customer ID"),
      assignee_type: z
        .string()
        .optional()
        .describe("Assignee type (e.g. 'user')"),
      assignee_id: z
        .string()
        .optional()
        .describe("Assignee ID"),
      work_type_id: z
        .string()
        .optional()
        .describe("Work type ID"),
    },
    async (params) => {
      const body: Record<string, unknown> = {
        description: params.description,
      };

      if (params.due_on) body.due_on = params.due_on;
      if (params.customer_type && params.customer_id) {
        body.customer = {
          type: params.customer_type,
          id: params.customer_id,
        };
      }
      if (params.assignee_type && params.assignee_id) {
        body.assignee = {
          type: params.assignee_type,
          id: params.assignee_id,
        };
      }
      if (params.work_type_id) body.work_type_id = params.work_type_id;

      const result = await client.request<{ data: { id: string; type: string } }>({
        endpoint: "tasks.create",
        body,
      });

      return {
        content: [
          {
            type: "text" as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    }
  );
}
