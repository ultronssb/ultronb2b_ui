import { Text } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import { ActiveTabContext } from '../../../layout/Layout';
import notify from '../../../utils/Notification';

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

  const columns = useMemo(() => [
    {
      header: 'Product Code',
      accessorKey: 'articleCode'
    },
    {
      header: 'Product Name',
      accessorKey: 'articleName'
    },
    {
      header: 'Brand',
      accessorKey: 'brand.name'
    },
    {
      header: 'Product Price',
      accessorKey: 'priceSetting.sellingPrice'
    },
    {
      header: 'Product Tags',
      accessorKey: 'productTags'
    },
    // {
    //   header: 'Product Category',
    //   accessorKey: 'productCategories',
    //   cell: ({ getValue }) => {
    //     const productCategories = getValue();
    //     const categoryNames = Object.keys(productCategories).map(key => productCategories[key].name);
    //     return categoryNames.join(', ');
    //   }
    // },
    {
      header: 'Status',
      accessorKey: 'status'
    },
    {
      header: 'Actions',
      mainTableHeaderCellProps: {
        align: 'center'
      },
      mainTableBodyCellProps: {
        align: 'center'
      },
      size: 100,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <IconPencil onClick={() => editVarient(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editVarient = (varobj) => {
    setIsCreateProduct(true);
    navigate(`/product/product/create?id=${varobj.id}`, { state: { ...stateData, tabs: stateData.childTabs } });
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

  return (
    <>
      {!isCreateProduct && (
        <>
          <div className='user--container'>
            <Text size='lg'>Product Details</Text>
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
          <B2BTableGrid
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
          />
        </>
      )}
    </>
  );
};

export default Articles;
