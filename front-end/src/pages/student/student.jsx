"use client";

import { useMemo } from "react";
import {
    MantineReactTable,
    useMantineReactTable,
} from "mantine-react-table";

import {
    ActionIcon,
    Group,
    Text,
    Tooltip,
} from "@mantine/core";

import {
    IconPencil,
    IconTrash,
} from "@tabler/icons-react";

export default function StudentsTable({
    data = [],
    onEdit,
    onDelete,
}) {
    const columns = useMemo(
        () => [
            {
                accessorKey: "student_name",
                header: "Student Name",
                size: 200,
                Cell: ({ cell }) => (
                    <Text fw={500}>
                        {cell.getValue() || "-"}
                    </Text>
                ),
            },
            {
                accessorKey: "student_reg",
                header: "Register Number",
                size: 180,
            },
            {
                id: "department",
                header: "Department",
                accessorFn: (row) =>
                    typeof row.student_department === "object"
                        ? row.student_department?.department_name || "-"
                        : "-",
                size: 260,
            },
            {
                id: "section",
                header: "Section",
                accessorFn: (row) =>
                    typeof row.section === "object"
                        ? row.section?.section_name || "-"
                        : "-",
                size: 130,
            },
            {
                id: "team",
                header: "Team",
                accessorFn: (row) =>
                    typeof row.team === "object"
                        ? row.team?.team_name || "-"
                        : "-",
                size: 180,
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
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },

        mantineSearchTextInputProps: {
            placeholder: "Search students...",
        },

        renderRowActions: ({ row }) => (
            <Group gap="xs" wrap="nowrap">
                <Tooltip label="Edit student">
                    <ActionIcon
                        variant="light"
                        color="blue"
                        size="lg"
                        aria-label="Edit student"
                        onClick={() => onEdit?.(row.original)}
                    >
                        <IconPencil size={18} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete student">
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        aria-label="Delete student"
                        onClick={() =>
                            onDelete?.(row.original._id)
                        }
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        ),
    });

    return <MantineReactTable table={table} />;
}