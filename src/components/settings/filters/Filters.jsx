import { rem, Switch } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';

const Filters = () => {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [rowCount, setRowCount] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [variantList, setVariantList] = useState([]);
    const [productCount, setProductCount] = useState({});
    const [isCategoryFilter, setIsCategoryFilter] = useState(false);
    const [checkedState, setCheckedState] = useState({})

    useEffect(() => {
        fetchAllData();
    }, [pagination]);

    const fetchAllData = async () => {
        await getAllCategory();
        await getAllVariant();
        fetchProductCount();
    };

    const getAllCategory = async () => {
        const res = await B2B_API.get(`product-category`).json();
        setCategoryList(res.response);
    };

    const getAllVariant = async () => {
        const res = await B2B_API.get(`variantType/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
        setVariantList(res.response.content);
        setRowCount(res.response.totalElements);
    };

    const fetchProductCount = async () => {
        const res = await B2B_API.get('product/count-by-category').json();
        const response = res.response;
        response['Fabric Content'] = res.response['Fabric Type'];
        setProductCount(response);
    };

    const countLeafNodes = (node) => {
        let count = 0;
        const traverse = (node) => {
            if (!node.child || node.child.length === 0) {
                count += 1;
            } else {
                node.child.forEach(traverse);
            }
        };
        traverse(node);
        return count;
    };

    const categoryLeafCounts = useMemo(() => {
        return categoryList.map(node => ({
            name: node.name,
            count: countLeafNodes(node),
        }));
    }, [categoryList]);

    const handleCategorySwitchChange = async (category) => {
        const newShowInFilter = !category.showInFilter ? true : false;
        const updatedCategory = { ...category, showInFilter: newShowInFilter };
        try {
            await B2B_API.post(`product-category`, { json: updatedCategory }).json();
            setCategoryList((currentData) =>
                currentData.map((row) =>
                    row.id === category.id ? updatedCategory : row
                )
            );
            // await getAllCategory();
        } catch (error) {
            console.error("Error updating showInFilter", error);
        }
    };

    const handleVariantSwitchChange = async (variant) => {
        const newShowInFilter = !variant.showInFilter ? true : false;
        const updatedVariant = { ...variant, showInFilter: newShowInFilter };
        try {
            await B2B_API.post(`variantType`, { json: updatedVariant }).json();
            setVariantList((currentData) =>
                currentData.map((row) =>
                    row.id === variant.id ? updatedVariant : row
                )
            );
            // await getAllVariant();
        } catch (error) {
            console.error("Error updating showInFilter", error);
        }
    };


    const categoryColumns = useMemo(() => [
        {
            id: 'serialNumber',
            header: 'S.No',
            accessorFn: (_, index) => index + 1,
            size: 100,
            mantineTableHeadCellProps: { align: 'center' },
            mantineTableBodyCellProps: { align: 'center' },
        },
        {
            id: 'categoryName',
            header: 'Category Name',
            accessorKey: 'name',
        },
        {
            id: 'attributeCount',
            header: 'Attribute Count',
            accessorFn: (row) => {
                const category = categoryLeafCounts.find(c => c.name === row.name);
                return category ? category.count : 0;
            },
            size: 150,
        },
        {
            id: 'productCount',
            header: 'Product Count',
            accessorFn: (row) => productCount[row.name] || 0,
            size: 150,
        },
        {
            id: 'status',
            header: 'Status',
            accessorKey: 'status',
            size: 100,
            Cell: ({ row }) => (
                <span style={{ color: row.original.status === 'ACTIVE' ? 'green' : 'red' }}>
                    {row.original.status}
                </span>
            ),
        },
        {
            header: 'Actions',
            mantineTableHeadCellProps: { align: 'center' },
            mantineTableBodyCellProps: { align: 'center' },
            size: 100,
            Cell: ({ row }) => {
                const { original } = row;
                const checked = checkedState[original.id] !== undefined ? checkedState[original.id] : original.showInFilter === true;
                return (
                    <Switch
                        checked={checked}
                        onChange={() => handleCategorySwitchChange(original)}
                        color="teal"
                        size="md"
                        style={{ cursor: 'pointer' }}
                        thumbIcon={checked ? (
                            <IconCheck style={{ width: rem(12), height: rem(12) }} color="#007f5f" stroke={3} />
                        ) : (
                            <IconX style={{ width: rem(12), height: rem(12) }} color="#e63946" stroke={3} />
                        )}
                        disabled={original.name === 'Fabric Type' || original.name === 'Fabric Content'}
                    />
                );
            },
        }
    ], [categoryLeafCounts, checkedState, productCount,]);

    const variantColumns = useMemo(() => [
        {
            id: 'serialNumber',
            header: 'S.No',
            accessorFn: (_, index) => index + 1,
            size: 100,
            mantineTableHeadCellProps: { align: 'center' },
            mantineTableBodyCellProps: { align: 'center' },
        },
        {
            id: 'variantName',
            header: 'Variant Name',
            accessorKey: 'name',
        },
        {
            id: 'variantStatus',
            header: 'Status',
            accessorKey: 'status',
            size: 100,
            Cell: ({ row }) => (
                <span style={{ color: row.original.status === 'ACTIVE' ? 'green' : 'red' }}>
                    {row.original.status}
                </span>
            ),
        },
        {
            header: 'Action',
            mantineTableHeadCellProps: { align: 'center' },
            mantineTableBodyCellProps: { align: 'center' },
            size: 100,
            Cell: ({ row }) => {
                const { original } = row;
                const checked = checkedState[original.id] !== undefined ? checkedState[original.id] : original.showInFilter === true;
                return (
                    <Switch
                        checked={checked}
                        onChange={() => handleVariantSwitchChange(original)}
                        color="teal"
                        size="md"
                        style={{ cursor: 'pointer' }}
                        thumbIcon={checked ? (
                            <IconCheck style={{ width: rem(12), height: rem(12), }} color="#007f5f" stroke={3} />
                        ) : (
                            <IconX style={{ width: rem(12), height: rem(12), }} color="#e63946" stroke={3} />
                        )}
                    />
                );
            },
        }
    ], [checkedState,]);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '0.5rem' }}>
                <div className='left--section'>
                    <div>
                        <h2>{!isCategoryFilter ? 'Category Filter - ' : 'Variant Filter - '}</h2>
                    </div>
                    <B2BButton disabled={!isCategoryFilter} onClick={() => { setIsCategoryFilter(!isCategoryFilter) }} name='Category Filter' />
                    <B2BButton disabled={isCategoryFilter} onClick={() => { setIsCategoryFilter(!isCategoryFilter) }} name='Variant Filter' />
                </div>
            </div>
            {
                !isCategoryFilter ? (
                    <B2BTableGrid
                        columns={categoryColumns}
                        data={categoryList}
                        enableTopToolbar={true}
                        enableGlobalFilter={true}
                        enableFullScreenToggle={true}
                        pagination={pagination}
                        rowCount={rowCount}
                        onPaginationChange={setPagination}
                    />
                ) : (
                    <B2BTableGrid
                        columns={variantColumns}
                        data={variantList}
                        enableTopToolbar={true}
                        enableGlobalFilter={true}
                        enableFullScreenToggle={true}
                        pagination={pagination}
                        rowCount={rowCount}
                        onPaginationChange={setPagination}
                    />
                )
            }

        </div>
    )
};

export default Filters;
