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





const DepartmentTable = ({
    data,
    onEdit,
    onDelete,
}) => {
    const columns = useMemo(
        () => [
            {
                accessorKey: "department_name",
                header: "Department Name",
                size: 350,
                Cell: ({ cell }) => (
                    <Text fw={500}>
                        {cell.getValue()}
                    </Text>
                ),
            },
            {
                accessorKey: "code",
                header: "Department Code",
                size: 150
            },
            {
                id: "sections",
                header: "Total Sections",
                accessorFn: (row) => row.section?.length ?? 0,
                size: 150,
            },
            {
                accessorKey: "createdAt",
                header: "Created Date",
                size: 200,
                Cell: ({ cell }) => {
                    const value = cell.getValue();

                    return value
                        ? new Date(value).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                        })
                        : "-";
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
            placeholder: "Search departments...",
        },

        renderRowActions: ({ row }) => (
            <Group gap="xs" wrap="nowrap">
                <Tooltip label="Edit department">
                    <ActionIcon
                        variant="light"
                        color="blue"
                        size="lg"
                        aria-label="Edit department"
                        onClick={() => onEdit(row.original)}
                    >
                        <IconPencil size={18} />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label="Delete department">
                    <ActionIcon
                        variant="light"
                        color="red"
                        size="lg"
                        aria-label="Delete department"
                        onClick={() => onDelete(row.original._id)}
                    >
                        <IconTrash size={18} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        ),
    });

    return <MantineReactTable table={table} />;
};

export default DepartmentTable;