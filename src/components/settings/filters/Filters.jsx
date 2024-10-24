import { rem, Switch, Text } from '@mantine/core';
import { IconCheck, IconX } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import _ from 'lodash';
import { createB2BAPI } from '../../../api/Interceptor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

const Filters = () => {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });
    const [rowCount, setRowCount] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [variantTypeList, setVariantTypeList] = useState([]);
    const [isCategoryFilter, setIsCategoryFilter] = useState(false);
    const [checkedState, setCheckedState] = useState({})
    const B2B_API = createB2BAPI();
    const [status, setStatus] = useState('ACTIVE')
    const [openDropDown, setOpenDropDown] = useState(false)

    useEffect(() => {
        fetchAllData();
    }, [pagination]);

    const fetchAllData = async () => {
        await getAllCategory();
        await getAllVariant();
    };

    const getAllCategory = async () => {
        const res = await B2B_API.get('product-category').json();
        setCategoryList(_.sortBy(res.response, 'displayOrder') || []);
    };

    const getAllVariant = async () => {
        try {
            const res = await B2B_API.get(`variantType/get-all?status=ACTIVE&page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
            setVariantTypeList(res.response.content);
            setRowCount(res.response.totalElements);
        } catch (error) {
            notify({
                title: "Error!!",
                message: error.message,
                error: true,
                success: false
            });
        }
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
            notify({
                message: 'Filter show on the website has been updated successfully',
                success: true,
                error: false
            });
        } catch (error) {
            notify({
                message: error.message,
                success: false,
                error: true
            });
        }
    };

    const handleVariantSwitchChange = async (variant) => {
        const newShowInFilter = !variant.showInFilter ? true : false;
        const updatedVariant = { ...variant, showInFilter: newShowInFilter };
        try {
            await B2B_API.post(`variantType`, { json: updatedVariant }).json();
            setVariantTypeList((currentData) =>
                currentData.map((row) =>
                    row.id === variant.id ? updatedVariant : row
                )
            );
            notify({
                message: 'Filter show on the website has been updated successfully',
                success: true,
                error: false
            });
        } catch (error) {
            notify({
                message: error.message,
                success: false,
                error: true
            });
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
            header: 'Display Order',
            accessorKey: 'displayOrder',
            size: 100,
            Cell: ({ cell, row }) => {
                const original = row.original;
                return (
                    <select
                        value={original.displayOrder}
                        onChange={e => handleChangeCategoryOrder(original.id, Number(e.target.value))}
                        style={{ width: '100px', height: '30px', borderRadius: '5px', padding: '0rem 0.5rem', cursor: 'pointer' }}
                    >
                        {[...Array(categoryList.length)].map((_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                );
            },
        },
        {
            id: 'status',
            header: (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                    <div>Status({status})</div>
                    <FontAwesomeIcon icon={openDropDown ? faFilterCircleXmark : faFilter} onClick={() => setOpenDropDown(!openDropDown)} />
                    {openDropDown && <div className='status-dropdown'>
                        <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
                            <Text size="xs" fw={800}>ACTIVE</Text>
                        </div>
                        <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
                            <Text size="xs" fw={800}>INACTIVE</Text>
                        </div>
                    </div>
                    }
                </div>
            ),
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
                        disabled={original.showInFilter === true && (original.name === 'Fabric Type' || original.name === 'Fabric Content')}
                    />
                );
            },
        }
    ], [categoryLeafCounts, checkedState, categoryList,status,openDropDown]);

    const handleStatusChange = (status) => {
        setOpenDropDown(false)
        setStatus(status)
    }


    const handleChangeCategoryOrder = (id, newOrder) => {
        setCategoryList(prevData => {
            const updatedData = [...prevData];
            const itemToUpdate = updatedData.find(item => item.id === id);
            const currentOrder = itemToUpdate.displayOrder;
            if (newOrder < currentOrder) {
                updatedData.forEach(item => {
                    if (item.displayOrder >= newOrder && item.displayOrder < currentOrder) {
                        item.displayOrder += 1;
                    }
                });
            } else if (newOrder > currentOrder) {
                updatedData.forEach(item => {
                    if (item.displayOrder > currentOrder && item.displayOrder <= newOrder) {
                        item.displayOrder -= 1;
                    }
                });
            }
            itemToUpdate.displayOrder = newOrder;
            const sortedData = updatedData.sort((a, b) => a.displayOrder - b.displayOrder);
            updateCategoryDisplayOrder(sortedData);
            return sortedData;
        });
    };

    const updateCategoryDisplayOrder = async (categorys) => {
        try {
            const res = await B2B_API.put('product-category/display-order', { json: categorys }).json();
            notify({
                message: res.message,
                success: true,
                error: false
            });
        } catch (error) {
            notify({
                message: error.message,
                success: false,
                error: true
            });
        }
    };

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
            id: 'variantDisplayOrder',
            header: 'Variant Display Order',
            accessorKey: 'displayOrder',
            size: 100,
            Cell: ({ cell, row }) => {
                const original = row.original;
                return (
                    <select
                        value={original.displayOrder}
                        onChange={e => handleChangeVariantTypeOrder(original.id, Number(e.target.value))}
                        style={{ width: '100px', height: '30px', borderRadius: '5px', padding: '0rem 0.5rem', cursor: 'pointer' }}
                    >
                        {[...Array(variantTypeList.length)].map((_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                );
            },
        },
        {
            id: 'variantStatus',
            header: (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                    <div>Status({status})</div>
                    <FontAwesomeIcon icon={openDropDown ? faFilterCircleXmark : faFilter} onClick={() => setOpenDropDown(!openDropDown)} />
                    {openDropDown && <div className='status-dropdown'>
                        <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
                            <Text size="xs" fw={800}>ACTIVE</Text>
                        </div>
                        <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
                            <Text size="xs" fw={800}>INACTIVE</Text>
                        </div>
                    </div>
                    }
                </div>
            ),
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
    ], [checkedState, variantTypeList,status,openDropDown]);

    const handleChangeVariantTypeOrder = (id, newOrder) => {
        setVariantTypeList(prevData => {
            const updatedData = [...prevData];
            const itemToUpdate = updatedData.find(item => item.id === id);
            const currentOrder = itemToUpdate.displayOrder;
            if (newOrder < currentOrder) {
                updatedData.forEach(item => {
                    if (item.displayOrder >= newOrder && item.displayOrder < currentOrder) {
                        item.displayOrder += 1;
                    }
                });
            } else if (newOrder > currentOrder) {
                updatedData.forEach(item => {
                    if (item.displayOrder > currentOrder && item.displayOrder <= newOrder) {
                        item.displayOrder -= 1;
                    }
                });
            }
            itemToUpdate.displayOrder = newOrder;
            const sortedData = updatedData.sort((a, b) => a.displayOrder - b.displayOrder);
            updateVariantTypeDisplayOrder(sortedData);
            return sortedData;
        });
    };

    const updateVariantTypeDisplayOrder = async (variantTypes) => {
        try {
            const res = await B2B_API.put('variantType/display-order', { json: variantTypes }).json();
            notify({
                message: res.message,
                success: true,
                error: false
            });
        } catch (error) {
            notify({
                message: error.message,
                success: false,
                error: true
            });
        }
    };

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
                        data={variantTypeList}
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
