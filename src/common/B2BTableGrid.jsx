import '@mantine/dates/styles.css';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import '@mantine/core/styles.css';
import 'mantine-react-table/styles.css';
import React from 'react';

const B2BTableGrid = ({
    data = [],
    columns = [],
    enableSorting = false,
    enableFullScreenToggle = false,
    enableColumnActions = false,
    enableGlobalFilter = true,
    enableDensityToggle = false,
    manualFiltering = false,
    manualPagination = true,
    manualSorting = false,
    enableTopToolbar = false,
    renderRowActions = () => { },
    onColumnFilterFnsChange = () => { },
    onColumnFiltersChange = () => { },
    onGlobalFilterChange = () => { },
    onPaginationChange = () => { },
    onSortingChange = () => { },
    columnFilters = [],
    columnFilterFns = () => { },
    selectAllMode = '',
    globalFilter = '',
    sorting = [],
    pagination = { pageIndex: 0, pageSize: 5 },
    rowsPerPageOptions = ['5', '10', '15'],
    isLoading = false,
    isError = false,
    isFetching = false,
    pageCount,
    rowCount,
    enableResizing = false,
}) => {

    const table = useMantineReactTable({
        data: data,
        columns: columns,
        defaultDisplayColumn: {
            enableResizing: enableResizing
        },
        paginationDisplayMode: 'pages',
        mantinePaginationProps: {
            radius: 'sm',
            size: 'sm',
            rowsPerPageOptions: ["5", "10", "15"]
        },
        mantineTableProps: { striped: true },
        enableColumnActions: enableColumnActions,
        enableGlobalFilter: enableGlobalFilter,
        enableDensityToggle: enableDensityToggle,
        initialState: {
            showColumnFilters: false,
            density: 'xs',
        },
        layoutMode: 'grid',
        renderRowActions: renderRowActions,
        enableTopToolbar: enableTopToolbar,
        manualFiltering: manualFiltering,
        enableSorting: enableSorting,
        manualPagination: manualPagination,
        manualSorting: manualSorting,
        enableHiding: false,
        enableFullScreenToggle: enableFullScreenToggle,
        columnFilterDisplayMode: "subheader",
        pageCount: pageCount,
        rowCount: rowCount,
        onColumnFilterFnsChange: onColumnFilterFnsChange,
        onColumnFiltersChange: onColumnFiltersChange,
        onGlobalFilterChange: onGlobalFilterChange,
        onPaginationChange: onPaginationChange,
        onSortingChange: onSortingChange,
        selectAllMode: selectAllMode,
        positionPagination: 'bottom',
        positionToolbarAlertBanner: 'head-overlay',
        state: {
            columnFilters,
            columnFilterFns,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isFetching,
            sorting,
        },
        enableColumnFilters: false,
    })

    return (
        <MantineReactTable table={table} />
    )
}

export default B2BTableGrid;