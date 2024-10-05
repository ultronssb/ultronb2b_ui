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
        return [
            {
                id: 'product',
                columns: [
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
                            <span>{pimId ? row.original.product.brand.name : row.original.brand.name}</span>
                        ),
                    },
                    {
                        accessorKey: 'priceSetting.sellingPrice',
                        header: 'Product Price',
                        enableSorting: false,
                        enableColumnDragging: false,
                        Cell: ({ cell, row }) => {
                            const price = pimId ? row.original.product.priceSetting.sellingPrice : row.original.priceSetting.sellingPrice;
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
                    {
                        header: (
                            map ? (
                                <Checkbox
                                    checked={areAllSelected}
                                    onChange={() => handleSelectAllPairs(data)}
                                />
                            ) : (
                                'Actions'
                            )
                        ),
                        enableSorting: false,
                        enableColumnDragging: false,
                        mainTableHeaderCellProps: { align: 'center' },
                        mainTableBodyCellProps: { align: 'center' },
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
                    },
                ],
            },
        ];
    }, [pimId, map, areAllSelected, selectedPairs, data]);


    const renderDetailPanel = ({ row }) => {
        const variants = pimId ? row.original.product.productVariants : row.original.productVariants;
        const productname = pimId ? row.original.product.articleName : row.original.articleName;

        const productColumns = [{
            accessorKey: 'Variant SKU',
            header: 'SKU',
            Cell: ({ row }) => (

                <span>{row.original.variantSku}</span>

            )
        },
        {
            accessorKey: 'Name',
            header: 'Name',
            Cell: ({ row }) => {
                console.log('row : ', row.original)
                return <span>{`${productname} / ${row.original.variants.map(vari => vari.value).join(' / ')}`}</span>

            }
        },
        // {
        //     accessorKey: 'Solid',
        //     header: 'Solid',
        //     Cell: ({ row }) => {
        //         console.log('row : ', row.original)
        //         return (<span>{row.original.variants.map(vari => vari.name === 'Solid' ? vari.value : '')}</span>)

        //     }
        // },
        // {
        //     accessorKey: 'Colour',
        //     header: 'Colour',
        //     Cell: ({ row }) => {
        //         console.log('row : ', row.original)
        //         return (<span>{row.original.variants.map(vari => vari.name === 'Colour' ? vari.value : '')}</span>)

        //     }
        // }
        ]

 console.log(data)
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
