import { Box, Text, Title } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import { ActiveTabContext } from '../../../layout/Layout';
import notify from '../../../utils/Notification';
import _ from 'lodash';
import ProductGrid from '../../../common/ProductGrid';

const Articles = () => {
  const initialState = {
    variantId: '',
    name: '',
    value: '',
    hexaColorCode: '',
    status: 'ACTIVE'
  };
  const { stateData } = useContext(ActiveTabContext);

  const [product, setProduct] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [isCreateProduct, setIsCreateProduct] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    fetchAllProducts();
  }, [pagination.pageIndex, pagination.pageSize]);

  const getUniqueColumnNames = (productVariants) => {
    const columnNames = new Set();
    productVariants.forEach((product) => {
      product.variants.forEach((variant) => {
        columnNames.add(variant.name);
      });
    });
    return Array.from(columnNames);
  };

  const getRowData = (product, columns) => {
    const row = {};
    columns.forEach((col) => {
      const variant = product.variants.find((v) => v.name === col);
      row[col] = variant ? variant.value : ''; // Assign value or empty string if no variant
    });
    return row;
  };
  

  const columns = useMemo(() => [
    {
      id: 'product', 
      columns: [
        {
          accessorKey: 'articleCode',
          header: 'Product Code',
          size: 150,
        },
        {
          accessorKey: 'articleName',
          header: 'Product Name',
          size: 250,
        },
        {
          accessorKey: 'brand.name',
          header: 'Brand',
          size: 150,
        },
        {
          accessorKey: 'priceSetting.sellingPrice',
          header: 'Product Price',
          enableColumnFilter: false,
          Cell: ({ cell }) => 
            cell.getValue()?.toLocaleString?.('en-US', {
              style: 'currency',
              currency: 'IND',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }),
        },
        // {
        //   accessorKey: 'productTags',
        //   header: 'Product Tags',
        //   Cell: ({ cell }) => cell.getValue()?.join(', '), // Assuming productTags is an array
        // },
        {
          accessorFn: (row) => _.size(row.productVariants),
          header: 'No of Variants',
          size: 120,
        },
        {
          accessorKey: 'status',
          header: 'Status',
          size: 100,
          Cell: ({ cell }) => (
            <span style={{ color: cell.getValue() === 'active' ? 'green' : 'red' }}>
              {cell.getValue()}
            </span>
          ),
        },
        {
          header: 'Actions',
          mainTableHeaderCellProps: {
            align: 'center',
          },
          mainTableBodyCellProps: {
            align: 'center',
          },
          size: 100,
          Cell: ({ row }) => {
            const { original } = row;
            return (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <IconPencil onClick={() => editVarient(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
              </div>
            );
          },
        },
      ],
    },
  ], []);
   
  const renderDetailPanel = ({ row }) => {
    let formattedVariantValues1 = {};
  
    if (row.original.productVariants) {
      const variantMap = {};
  
   
      row.original.productVariants.forEach(variantItem => {
        variantItem.variants?.forEach(variant => {
          if (!variantMap[variant.name]) {
            variantMap[variant.name] = new Set();
          }
          variantMap[variant.name].add(variant.value);
        });
      });
  
      formattedVariantValues1 = Object.entries(variantMap).reduce((acc, [key, value]) => {
        acc[key] = Array.from(value);
        return acc;
      }, {});
    }
    const productColumns = Object.keys(formattedVariantValues1).map(key => ({
      header: key,
      accessorKey: key,
    }));
  
    // Prepare the output
    const output = [];
  
    // Create rows for each combination
    const allVariants = Object.values(formattedVariantValues1);
    const combinations = allVariants.reduce((acc, variantArray) => {
      if (!acc.length) {
        return variantArray.map(value => ({ [Object.keys(formattedVariantValues1)[0]]: value }));
      }
  
      return acc.flatMap(existing => {
        return variantArray.map(value => ({
          ...existing,
          [Object.keys(formattedVariantValues1)[allVariants.indexOf(variantArray)]]: value,
        }));
      });
    }, []);
  
    // Convert combinations to the expected format
    combinations.forEach(combination => {
      output.push(combination);
    });
  
    return (
      <B2BTableGrid
        columns={productColumns}
        data={output} // Use the output array as data
        enableTopToolbar={false}
        enableGlobalFilter={false}
        manualPagination={false}
        enableFullScreenToggle={false}
      />
    );
  };
  
  
  const editVarient = (varobj) => {
    setIsCreateProduct(true);
    navigate(`/product/product/create?id=${varobj?.productId}`);
    setProduct((prev => ({ ...prev, ...varobj })));
  };  

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`product/view?page=${pagination.pageIndex}&size=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setProducts(data);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_products",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    setIsCreateProduct(true)
    navigate('/product/product/create', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  console.log(products)

  return (
    <>
      {!isCreateProduct && (
        <>
          <div className='user--container'>
            <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"Create Product"}
                onClick={(e) => handleChange(e)}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          {/* <B2BTableGrid
            columns={columns}
            data={products}
            isLoading={isLoading}
            isError={isError}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            manualPagination={true}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            enableFullScreenToggle={true}
          /> */}
          <ProductGrid data={products} editVarient={editVarient}
         />
        </>
      )}
    </>
  );
};

export default Articles;
