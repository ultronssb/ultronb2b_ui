import React, { useEffect, useMemo, useState } from 'react'
import B2BButton from '../../../common/B2BButton';
import ProductGrid from '../../../common/ProductGrid';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { B2B_API } from '../../../api/Interceptor';

const Filters = () => {
    // const [filters, setFilters] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [rowCount, setRowCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const [variantList, setVariantList] = useState([]);
    const [productCount, setProductCount] = useState({})
    const [selectedPairs, setSelectedPairs] = useState([]);
    const [isCategoryFilter, setIsCategoryFilter] = useState(false);

    useEffect(() => {
        getAllCategory();
        fetchProductCount();
        getAllVariant()
    }, [])

    const getAllCategory = async () => {
        const res = await B2B_API.get(`product-category`).json();
        setCategories(res.response);
        console.log(res.response, "cat");
    }

    const getAllVariant = async () => {
        const res = await B2B_API.get(`product-category`).json();
        setCategories(res.response);
        console.log(res.response, "cat");
    }

    const countLeafNodes = (node) => {
        let count = 0;
        const traverse = (node) => {
            if (!node.child || node.child.length === 0) {
                count += 1;
                return;
            }
            node.child.forEach(traverse);
        };
        traverse(node);
        return count;
    };

    const counts = categories.map(node => ({
        name: node.name,
        count: countLeafNodes(node),
    }));

    const fetchProductCount = async () => {
        const res = await B2B_API.get('product/count-by-category').json()
        const response = res.response
        response['Fabric Content'] = res.response['Fabric Type']
        setProductCount(response)
    }


    const categoryColumns = useMemo(() => [
        {
            id: 'serialNumber',
            header: 'S.No',
            accessorFn: (_, index) => index + 1,
            size: 100,
            mantineTableHeadCellProps: {
                align: 'center'
            },
            mantineTableBodyCellProps: {
                align: 'center'
            },
        },
        {
            id: 'categoryName',
            header: 'Category Name',
            accessorKey: 'name'
        },
        {
            id: 'attributeCount',
            header: 'Attribute Count',
            accessorFn: (row) => {
                const category = counts.find(c => c.name === row.name);
                return category ? category.count : 0;
            },
            size: 150,
        },
        {
            id: 'productCount',
            header: 'Product Count',
            accessorFn: (row) => {
                return productCount[row.name] || 0;
            },
            size: 150,
        },
        {
            id: 'status',
            header: 'Status',
            accessorKey: 'status',
            Cell: ({ cell, row }) => {
                const status = row.original.status;
                return (
                    <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
                        {status}
                    </span>
                );
            },
        },
    ], [counts]);

    const variantColumns = useMemo(() => [
        {
            header: 'S.No',
            accessorFn: (_, index) => index + 1,
            size: 100,
            mantineTableHeadCellProps: {
                align: 'center'
            },
            mantineTableBodyCellProps: {
                align: 'center'
            },
        },
        {
            header: 'Variant Name',
            accessorKey: 'name'
        },
        {
            header: 'Variant Status',
            Cell: ({ cell, row }) => {
                const status = row.original.status;
                return (
                    <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
                        {status}
                    </span>
                );
            },
        },
    ], []);

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
                        data={categories}
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
}

export default Filters