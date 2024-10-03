import { Box, Button, Checkbox, Flex, Menu, Text, Title } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { useMemo } from 'react';
import B2BTableGrid from './B2BTableGrid';
import _ from 'lodash';

const ProductGrid = ({ data,
    editVariant,
    map,
    areAllSelected,
    handleSelectAllPairs,
    selectedPairs,
    handleSelectPair,
    isLoading,
    isError,

    onPaginationChange = () => { }, pagination, pageCount, manualPagination,
    rowCount, isFetching }) => {
    const { pimId } = data[0] || {};


    const columns = useMemo(() => [
        {
            id: 'product',
            columns: [
                {
                    accessorKey: pimId ? 'product.articleCode' : 'articleCode',
                    header: 'Product Code',
                    size: 150,
                },
                {
                    accessorKey: pimId ? 'product.articleName' : 'articleName',
                    header: 'Product Name',
                    size: 250,
                },
                {
                    accessorKey: pimId ? 'product.brand.name' : 'brand.name',
                    header: 'Brand',
                    size: 150,
                },
                {
                    accessorKey: pimId ? 'product.priceSetting.sellingPrice' : 'priceSetting.sellingPrice',
                    header: 'Product Price',
                    enableColumnFilter: false,
                    Cell: ({ cell }) => {
                        const price = cell.getValue();
                        return price ? price.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'IND',
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }) : 'N/A';
                    },
                },
                {
                    accessorKey: pimId ? 'product.status' : 'status',
                    header: 'Status',
                    size: 100,
                    Cell: ({ cell }) => (
                        <span style={{ color: cell.getValue() === 'active' ? 'green' : 'red' }}>
                            {cell.getValue()}
                        </span>
                    ),
                },
                {
                    header: map ? (
                        <Checkbox
                            checked={areAllSelected}
                            onChange={() => handleSelectAllPairs(data)}
                        />
                    ) : (
                        pimId ? ' Actions' : 'Actions'
                    ),
                    mainTableHeaderCellProps: { align: 'center' },
                    mainTableBodyCellProps: { align: 'center' },
                    size: 100,
                    Cell: ({ row }) => {
                        if (map) {
                            return (
                                <Checkbox
                                    checked={selectedPairs.includes(row.original.productId)}
                                    onChange={() => handleSelectPair(row.original)}
                                />
                            );
                        } else {
                            return (
                                <IconPencil
                                    onClick={() => editVariant(row.original)}
                                    style={{ cursor: 'pointer', color: 'teal' }}
                                    stroke={2}
                                />
                            );
                        }
                    },
                },
            ],
        },
    ], [pimId, map, areAllSelected, selectedPairs, data]);


    const renderDetailPanel = ({ row }) => {
        const variants = pimId ? row.original.product.productVariants : row.original.productVariants;
        const variantGroups = {};
        variants?.forEach(variantItem => {
            variantItem.variants?.forEach(variant => {
                if (!variantGroups[variant.name]) {
                    variantGroups[variant.name] = new Set();
                }
                variantGroups[variant.name].add(variant.value);
            });
        });

        const formattedVariants = Object.fromEntries(
            Object.entries(variantGroups).map(([key, value]) => [key, Array.from(value)])
        );

        const productColumns = Object.keys(formattedVariants).map(key => ({
            header: key,
            accessorKey: key,
        }));

        const output = generateVariantCombinations(formattedVariants);

        return (<>
            <p>Total Variants: {_.size(variants)}</p>
            {/* <B2BTableGrid
                columns={productColumns}
                data={output}
                enableTopToolbar={false}
                enableGlobalFilter={false}
                manualPagination={false}
                enableFullScreenToggle={false}
                rowCount={_.size(output)}
            /> */}
            <MantineReactTable columns={productColumns} data={output} enableTopToolbar={false} enableGlobalFilter={false} paginationDisplayMode='pages' mantinePaginationProps={{
                rowsPerPageOptions: ['5','10'],
                withEdges: false,
            }} />
        </>
        );
    };

    const generateVariantCombinations = (variantValues) => {
        const allVariants = Object.values(variantValues);
        return allVariants.reduce((acc, variantArray) => {
            if (!acc.length) {
                return variantArray.map(value => ({ [Object.keys(variantValues)[0]]: value }));
            }

            return acc.flatMap(existing =>
                variantArray.map(value => ({
                    ...existing,
                    [Object.keys(variantValues)[allVariants.indexOf(variantArray)]]: value,
                }))
            );
        }, []);
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
