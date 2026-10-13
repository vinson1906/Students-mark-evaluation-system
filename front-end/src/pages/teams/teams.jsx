"use client";

import { useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import {
  ActionIcon,
  Badge,
  Group,
  Text,
  Tooltip,
} from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

export default function TeamTable({
  data = [],
  onEdit,
  onDelete,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "team_name",
        header: "Team Name",
        size: 160,
        Cell: ({ cell }) => (
          <Text fw={500}>{cell.getValue() || "-"}</Text>
        ),
      },
      {
        accessorKey: "team_number",
        header: "Team Number",
        size: 130,
      },
      {
        id: "section",
        header: "Section",
        accessorFn: (row) =>
          typeof row.section === "object"
            ? row.section?.section_name || "-"
            : "-",
        size: 120,
      },
      {
        id: "members",
        header: "Team Members",
        accessorFn: (row) =>
          Array.isArray(row.team_members)
            ? row.team_members
                .map((member) =>
                  typeof member === "object"
                    ? member?.student_name
                    : null
                )
                .filter(Boolean)
                .join(", ") || "-"
            : "-",
        size: 260,
      },
      {
        id: "project_title",
        header: "Project Title",
        accessorFn: (row) => row.project?.title || "-",
        size: 220,
      },
      {
        id: "github_url",
        header: "GitHub Repository",
        accessorFn: (row) => row.project?.github_url || "",
        size: 200,
        Cell: ({ cell }) =>
          cell.getValue() ? (
            <a
              href={cell.getValue()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View Repository
            </a>
          ) : (
            "-"
          ),
      },
      {
        id: "report_status",
        header: "Report Status",
        accessorFn: (row) =>
          row.project?.report_status || "NOT_SUBMITTED",
        Cell: ({ cell }) => {
          const status = cell.getValue();

          return (
            <Badge
              color={status === "PENDING" ? "yellow" : "gray"}
            >
              {status.replaceAll("_", " ")}
            </Badge>
          );
        },
        size: 160,
      },
      {
        id: "project_status",
        header: "Project Status",
        accessorFn: (row) =>
          row.project?.project_status || "NOT_SUBMITTED",
        Cell: ({ cell }) => {
          const status = cell.getValue();

          return (
            <Badge
              color={status === "PENDING" ? "blue" : "gray"}
            >
              {status.replaceAll("_", " ")}
            </Badge>
          );
        },
        size: 160,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data,
    enableRowActions: true,
    positionActionsColumn: "last",
    enableColumnActions: false,
    enableSorting: true,
    enableGlobalFilter: true,
    enablePagination: true,
    initialState: {
      showGlobalFilter: true,
      pagination: { pageIndex: 0, pageSize: 10 },
    },
    mantineSearchTextInputProps: {
      placeholder: "Search teams...",
    },
    renderRowActions: ({ row }) => (
      <Group gap="xs" wrap="nowrap">
        <Tooltip label="Edit team">
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            aria-label="Edit team"
            onClick={() => onEdit?.(row.original)}
          >
            <IconPencil size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Delete team">
          <ActionIcon
            variant="light"
            color="red"
            size="lg"
            aria-label="Delete team"
            onClick={() => onDelete?.(row.original._id)}
          >
            <IconTrash size={18} />
          </ActionIcon>
        </Tooltip>
      </Group>
    ),
  });

  return <MantineReactTable table={table} />;
}