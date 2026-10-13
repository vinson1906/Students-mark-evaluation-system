"use client";

import { useMemo } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
} from "mantine-react-table";
import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

export default function FacultyTable({
  data = [],
  onEdit,
  onDelete,
}) {
  const columns = useMemo(
    () => [
      {
        accessorKey: "faculty_name",
        header: "Faculty Name",
        size: 200,
        Cell: ({ cell }) => (
          <Text fw={500}>{cell.getValue() || "-"}</Text>
        ),
      },
      {
        id: "department",
        header: "Department",
        accessorFn: (row) =>
          typeof row.department === "object"
            ? row.department?.department_name || "-"
            : "-",
        size: 280,
      },
      {
        id: "lab",
        header: "Assigned Lab",
        accessorFn: (row) =>
          typeof row.lab === "object"
            ? row.lab?.lab_name || "-"
            : "-",
        size: 230,
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
      placeholder: "Search faculty...",
    },
    renderRowActions: ({ row }) => (
      <Group gap="xs" wrap="nowrap">
        <Tooltip label="Edit faculty">
          <ActionIcon
            variant="light"
            color="blue"
            size="lg"
            aria-label="Edit faculty"
            onClick={() => onEdit?.(row.original)}
          >
            <IconPencil size={18} />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Delete faculty">
          <ActionIcon
            variant="light"
            color="red"
            size="lg"
            aria-label="Delete faculty"
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