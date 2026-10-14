
import { useMemo } from "react";
import {
    MantineReactTable,
    useMantineReactTable,
} from "mantine-react-table";
import { ActionIcon, Group, Text, Tooltip } from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";

export default function LabTable({
    data = [],
    onEdit,
    onDelete,
}) {
    const columns = useMemo(
        () => [
            {
                accessorKey: "lab_name",
                header: "Lab Name",
                size: 220,
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
                accessorKey: "acadamic_year",
                header: "Academic Year",
                size: 160,
            },
            {
                accessorKey: "maximum_mark",
                header: "Maximum Marks",
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
            pagination: {
                pageIndex: 0,
                pageSize: 10,
            },
        },

        mantineSearchTextInputProps: {
            placeholder: "Search labs...",
        },

        renderRowActions: ({ row }) => (
            <Group gap="xs" wrap="nowrap">
                <Tooltip label="Edit lab">
                    <ActionIcon
                        variant="light"
                        color="blue"
                        size="lg"
                        aria-label="Edit lab"
                        onClick={() => onEdit?.(row.original)}
                    >
                        <IconPencil size={18} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete lab">
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        aria-label="Delete lab"
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