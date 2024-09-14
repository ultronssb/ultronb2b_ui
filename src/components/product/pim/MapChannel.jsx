import React, { useEffect, useMemo, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import B2BTableGrid from '../../../common/B2BTableGrid';
import Variants from '../variants/Variants';
import { IconPencil } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

const MapChannel = () => {
  const [product, setProduct] = useState([]);
  const [fabricContent, setFabricContent] = useState({});
  const [rowCount, setRowCount] = useState(5);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`product/view?page=${pagination.pageIndex}&size=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setProduct(data);
      console.log(data, "pro");

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


  const productColumns = [
    {
      header: 'Product Code',
      accessorKey: 'articleCode'
    },
    {
      id: 'ProductName',
      header: 'Product Name',
      accessorKey: 'articleName'
    },
    {
      id: 'FabricType',
      header: 'Fabric Type',
      accessorFn: (row) => { return row.productCategories["Fabric Type"]?.name || ''; },
    },
    {
      id: 'value',
      header: 'GSM',
      accessorFn: (row) => {
        if (row.productVariants) {
          const values = row.productVariants.flatMap(pv => pv.variants.map(v => v.value));
          return values.join(', ');
        }
        return '';
      },
    },
    {
      id: 'metrics',
      header: 'Width',
      accessorKey: 'metrics.width'
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
  ]
  
  const editVarient = (varobj) => {
    navigate(`/product/pim/enrich-product?id=${varobj.productId}`);
  
  };

  return (
    <div>
      <div>MapChannel</div>
      <B2BTableGrid
        columns={productColumns}
        data={product}
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

    </div>

  )
}

export default MapChannel