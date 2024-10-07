import React, { useContext, useMemo, useState } from 'react'
import { ActiveTabContext } from '../../layout/Layout';
import { useNavigate } from 'react-router-dom';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import { Text } from '@mantine/core';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';

const Stocks = () => {
  const { stateData } = useContext(ActiveTabContext);

  const [isStocks, setIsStocks] = useState(false);
  const [stocks, setStocks] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const columns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      mantineTableHeadCellProps: { align: 'center' },
      mantineTableBodyCellProps: { align: 'center' },
    },
    {
      header: 'Product Id',
      accessorKey: 'productId'
    },
    {
      header: 'Product Name',
      accessorKey: 'productName'
    },
    {
      header: 'SKU ID',
      accessorKey: 'skuId'
    },
    {
      header: 'Barcode',
      accessorKey: 'barcode'
    },
    {
      header: 'Qty',
      accessorKey: 'quantity  '
    },
    {
      header: 'CP ',
      accessorKey: 'cp'
    },
    {
      header: 'MRP ',
      accessorKey: 'mrp '
    },
    {
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
            <IconPencil onClick={() => editStock(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editStock = (varobj) => {
    setIsStocks(true)
    setStocks((prev => ({ ...prev, ...varobj })));
  }

  return (
    <>
      {!isStocks && (
        <>
          <div className='user--container'>
            <Text size='lg' fw={800}>Stocks Details</Text>
          </div>
          <B2BTableGrid
            columns={columns}
            // data={products}
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
  )
}

export default Stocks