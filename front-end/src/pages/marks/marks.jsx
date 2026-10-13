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

import {
    IconPencil,
    IconTrash,
} from "@tabler/icons-react";

export default function MarksTable({
    data = [],
    onEdit,
    onDelete,
}) {
    const columns = useMemo(
        () => [
            {
                accessorFn: (row) =>
                    row.student?.student_name || "-",
                id: "student",
                header: "Student Name",
                size: 180,
                Cell: ({ cell }) => (
                    <Text fw={500}>
                        {cell.getValue()}
                    </Text>
                ),
            },
            {
                accessorFn: (row) =>
                    row.student?.student_reg || "-",
                id: "student_reg",
                header: "Register Number",
                size: 160,
            },
            {
                accessorFn: (row) =>
                    row.team?.team_name || "-",
                id: "team",
                header: "Team",
                size: 140,
            },
            {
                accessorFn: (row) =>
                    row.lab?.lab_name || "-",
                id: "lab",
                header: "Lab",
                size: 180,
            },
            {
                accessorKey: "total_marks",
                header: "Total Marks",
                size: 120,
                Cell: ({ row }) => (
                    <Text fw={600}>
                        {row.original.total_marks ?? "-"}
                        {" / "}
                        {row.original.maximum_marks ?? "-"}
                    </Text>
                ),
            },
            {
                accessorKey: "project_status",
                header: "Project Status",
                size: 170,
                Cell: ({ cell }) => {
                    const status = cell.getValue();

                    const color =
                        status === "COMPLETED"
                            ? "green"
                            : status === "PENDING"
                              ? "yellow"
                              : "red";

                    return (
                        <Badge
                            color={color}
                            variant="light"
                        >
                            {status?.replaceAll("_", " ") || "-"}
                        </Badge>
                    );
                },
            },
            {
                accessorFn: (row) =>
                    row.evaluatedBy?.faculty_name || "-",
                id: "evaluatedBy",
                header: "Evaluated By",
                size: 180,
            },
            {
                id: "evaluation",
                header: "Evaluation Breakdown",
                size: 220,
                enableSorting: false,
                Cell: ({ row }) => {
                    const evaluation =
                        row.original.evaluation || {};

                    return (
                        <Text size="sm" c="dimmed">
                            Practical: {evaluation.practical_execution ?? "-"}
                            {" | "}HTML: {evaluation.used_html ?? "-"}
                            {" | "}JS: {evaluation.js_logics ?? "-"}
                            {" | "}CSS: {evaluation.css_responsiveness ?? "-"}
                            {" | "}Viva: {evaluation.viva ?? "-"}
                            {" | "}Docs: {evaluation.documendation ?? "-"}
                        </Text>
                    );
                },
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
            placeholder: "Search evaluations...",
        },

        renderRowActions: ({ row }) => (
            <Group gap="xs" wrap="nowrap">
                <Tooltip label="Edit evaluation">
                    <ActionIcon
                        variant="light"
                        color="blue"
                        size="lg"
                        aria-label="Edit evaluation"
                        onClick={() =>
                            onEdit?.(row.original)
                        }
                    >
                        <IconPencil size={18} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete evaluation">
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        aria-label="Delete evaluation"
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