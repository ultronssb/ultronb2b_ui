import React, { useEffect, useMemo, useState } from 'react'
import B2BTableGrid from '../../../common/B2BTableGrid'
import { B2B_API } from '../../../api/Interceptor';
import Barcode from 'react-barcode';

const VariantBarcode = () => {
  const [productVariant, setProductVariant] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

  useEffect(() => {
    fetchVariant();
  }, [pagination])

  const fetchVariant = async () => {
    try {
      const res = await B2B_API.get(`barcode/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = res.response.content;
      setProductVariant(res?.response?.content);
      setRowCount(res?.response?.totalElements)
      console.log(data, "prod");
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const columns = useMemo(() => [
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
      accessorKey: 'productVariants.name',
      size: 200
    },
    {
      header: 'Barcode',
      accessorKey: 'barcode',
      size: 120,  
      Cell: ({ cell, row }) => {
        const status = row.original.barcode;
        return (
          <Barcode value={status} fontSize={8} width={0.5} height={40} />

        );
      },
    },
    {
      header: 'Status',
      size: 100,
      Cell: ({ cell, row }) => {
        const status = row.original.status;
        return (
          <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
            {status}
          </span>
        );
      },
    },
    
  ])

  return (
    <B2BTableGrid
      columns={columns}
      data={productVariant}
      isLoading={isLoading}
      isError={isError}
      enableTopToolbar={true}
      enableGlobalFilter={true}
      pagination={pagination}
      rowCount={rowCount}
      onPaginationChange={setPagination}
      enableFullScreenToggle={true}
    />
  )
}

export default VariantBarcode