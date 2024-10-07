import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BTableGrid from '../../common/B2BTableGrid';

const OrderAbondened = () => {
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
      header: 'Check Out #',
      accessorKey: 'checkOut'
    },
    {
      header: 'Cart Date',
      accessorKey: 'cartDate'
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
    },
    {
      header: 'Email',
      accessorKey: 'emailId'
    },
    {
      header: 'Email Status',
      accessorKey: 'emailStatus'
    },
    {
      header: 'Recovery Status',
      accessorKey: 'recoveryStatus'
    },
    {
      header: 'Items',
      accessorKey: 'items'
    },
    {
      header: 'Cart Value',
      accessorKey: 'cartValue'
    },
    {
      header: 'Recovery Dt.',
      accessorKey: 'recoveryDt'
    },
    {
      header: 'Order Source',
      accessorKey: 'orderSource'
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
    }
  ], []);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h2>Order Abondened</h2>
      </div>
      <B2BTableGrid
        columns={columns}
        // data={sortedCollections}
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

export default OrderAbondened;