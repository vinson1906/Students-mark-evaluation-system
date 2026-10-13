
import { useMemo } from "react";
import {
    MantineReactTable,
    useMantineReactTable,
} from "mantine-react-table";

import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import {
    IconPencil,
    IconTrash,
} from "@tabler/icons-react";


export default function SectionTable({
    data,
    onEdit,
    onDelete,
}) {
    const columns = useMemo(
        () => [
            {
                accessorKey: "section_name",
                header: "Section Name",
                size: 180,
                Cell: ({ cell }) => (
                    <Text fw={500}>
                        {cell.getValue()}
                    </Text>
                ),
            },
            {
                id: "department",
                header: "Department",
                accessorFn: (row) =>
                    typeof row.department === "object"
                        ? row.department?.code ?? "-"
                        : row.department_name || "-",
                size: 280,
            },
            {
                accessorKey: "year",
                header: "Year",
                size: 100,
                Cell: ({ cell }) =>
                    cell.getValue() ?? "-",
            },
            {
                accessorKey: "semester",
                header: "Semester",
                size: 120,
                Cell: ({ cell }) =>
                    cell.getValue() ?? "-",
            },
            {
                id: "students",
                header: "Total Students",
                accessorFn: (row) => row.students?.length ?? 0,
                size: 150,
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
            placeholder: "Search sections...",
        },

        renderRowActions: ({ row }) => (
            <Group gap="xs" wrap="nowrap">
                <Tooltip label="Edit section">
                    <ActionIcon
                        variant="light"
                        color="blue"
                        size="lg"
                        aria-label="Edit section"
                        onClick={() => onEdit(row.original)}
                    >
                        <IconPencil size={18} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete section">
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        aria-label="Delete section"
                        onClick={() => onDelete(row.original._id)}
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        ),
    });

    return <MantineReactTable table={table} />;
}