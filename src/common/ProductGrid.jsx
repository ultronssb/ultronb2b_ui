import { Checkbox } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import _ from 'lodash';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useMemo, useState } from 'react';
import { BASE_URL } from '../api/EndPoints';

const ProductGrid = ({ data,
    editVariant,
    map,
    searchTerm,
    areAllSelected,
    handleSelectAllPairs,
    selectedPairs,
    handleSelectPair,
    isLoading,
    isError,
    handleSearchChange,

    onPaginationChange = () => { }, pagination, pageCount, manualPagination,
    rowCount, isFetching }) => {
    const { pimId } = data[0] || {};

    const columns = useMemo(() => {
        const columnArray = [
            {
                id: 'product',
                columns: [
                    {
                        accessorKey: 'product.image',
                        header: 'Image',
                        size: 110,
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ row }) => {
                            const item = pimId ? row.original.product?.image : row.original.image;
                            return (
                                <img src={`${BASE_URL.replace('/api', '')}${item}`} alt="Upload IMG" style={{ maxWidth: '50px', maxHeight: '50px' }} />
                            );
                        }
                    },
                    {
                        accessorKey: 'createdDate',
                        header: 'Created Date',
                        size: 120,
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ row }) => {
                            const timestamp = pimId ? row.original.product.createdDate : row.original.createdDate;
                            const formattedDate = new Date(Number(timestamp)).toLocaleDateString('en-GB'); // Format as 'DD/MM/YYYY'
                            
                            return <span>{formattedDate}</span>;
                        },
                        

                    },
                    {
                        accessorKey: 'articleCode',
                        header: 'Product Code',
                        size: 150,
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ row }) => (
                            <span>{pimId ? row.original.product.articleCode : row.original.articleCode}</span>
                        ),
                    },
                    {
                        accessorKey: 'articleName',
                        header: 'Product Name',
                        size: 250,
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ row }) => (
                            <span>{pimId ? row.original.product.articleName : row.original.articleName}</span>
                        ),
                    },
                    {
                        accessorKey: 'brand.name',
                        header: 'Brand',
                        size: 150,
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ row }) => (
                            <span>{pimId ? row.original.product.brand.name : row.original?.brand?.name}</span>
                        ),
                    },
                    {
                        accessorKey: 'priceSetting.sellingPrice',
                        header: 'Price',
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ cell, row }) => {
                            const price = pimId ? row.original.product.priceSetting.sellingPrice : row.original.priceSetting?.sellingPrice;
                            return price ? price.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'IND',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }) : 'N/A';
                        },
                    },
                    {
                        accessorKey: 'status',
                        header: 'Status',
                        size: 100,
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ cell, row }) => {
                            const status = pimId ? row.original.status : row.original.status;
                            return (
                                <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
                                    {status}
                                </span>
                            );
                        },
                    },
                ],
            },
        ];
        // Conditionally add the 'Publish' column when pimId is present, and insert it before the last column (Actions)
        if (pimId) {
            columnArray[0].columns.splice(columnArray[0].columns.length - 1, 0, {
                header: 'Publish',
                accessorKey: 'isPublished',
                size: 120,
                enableSorting: false,
                enableColumnDragging: false,
                Cell: ({ cell, row }) => {
                    const status = row.original.isPublished;
                    return (
                        <span style={{ color: status ? 'green' : 'red' }}>
                            {status ? "Published" : "Not Published"}
                        </span>
                    );
                },
            });
        }
        // Actions column (always at the end)
        columnArray[0].columns.push({
            header: (
                map ? (
                    <Checkbox
                        checked={areAllSelected}
                        onChange={() => handleSelectAllPairs(data)}
                    />
                ) : (
                    pimId ? 'Action' : "Actions"
                )
            ),
            enableSorting: false,
            enableColumnDragging: false,
            mantineTableHeadCellProps: { align: 'center' },
            mantineTableBodyCellProps: { align: 'center' },
            size: 100,
            Cell: ({ row }) => {
                return map ? (
                    <Checkbox
                        checked={selectedPairs.includes(row.original.productId)}
                        onChange={() => handleSelectPair(row.original)}
                    />
                ) : (
                    <IconPencil
                        onClick={() => editVariant(row.original)}
                        style={{ cursor: 'pointer', color: 'teal' }}
                        stroke={2}
                    />
                );
            },
        });

        return columnArray;
    }, [pimId, map, areAllSelected, selectedPairs, data]);




    const renderDetailPanel = ({ row }) => {
        const variants = pimId ? row.original.product.productVariants : row.original.productVariants;
        const productname = pimId ? row.original.product.articleName : row.original.articleName;

        const productColumns = [{
            accessorKey: 'Variant SKU',
            header: 'Variant SKU',
            Cell: ({ row }) => (

                <span>{row.original.variantSku}</span>

            )
        },
        {
            accessorKey: 'Name',
            header: 'Name',
            Cell: ({ row }) => {
                return <span>{`${productname} / ${row.original.variants.map(vari => vari.value).join(' / ')}`}</span>

            }
        },
        ]

        const [pageSize, setPageSize] = useState(5);

        return (<>
            <p>Total Variants: {_.size(variants)}</p>
            <MantineReactTable
                columns={productColumns}
                data={variants}
                enableTopToolbar={false}
                enableGlobalFilter={false}
                enableSorting={false}
                enableColumnActions={false}
                paginationDisplayMode='pages'
                mantinePaginationProps={{
                    rowsPerPageOptions: ['5', '10'],
                    withEdges: false,
                }}
                initialState={{
                    pagination: {
                        pageSize: pageSize,
                        pageIndex: 0,
                    },
                }}
            />
        </>
        );
    };

    const table = useMantineReactTable({
        columns,
        data,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableFacetedValues: true,
        enableGrouping: true,
        enablePinning: true,
        enableRowActions: false,
        enableRowSelection: false,
        enableColumnFilters: false,
        enableDensityToggle: false,
        initialState: { showColumnFilters: false, showGlobalFilter: true },
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'bottom',
        mantinePaginationProps: {
            radius: 'xl',
            size: 'lg',
        },
        mantineSearchTextInputProps: {
            placeholder: 'Search Products',
            value: searchTerm,
            onChange: handleSearchChange,
        },
        onPaginationChange: onPaginationChange,
        manualPagination: manualPagination,
        pageCount: pageCount,
        rowCount: rowCount,
        renderDetailPanel,
        state: {
            pagination,
            isLoading,
            showAlertBanner: isError,
            showProgressBars: isFetching,
        }
    });

    return <MantineReactTable table={table} />;
};

export default ProductGrid;
