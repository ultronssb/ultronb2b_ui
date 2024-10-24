import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BTableGrid from '../../common/B2BTableGrid';

const OrderDelivered = () => {
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
      header: 'Order #',
      accessorKey: 'orderId'
    },
    {
      header: 'Order Date',
      accessorKey: 'orderDate'
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
    },
    {
      header: 'Total Amount',
      accessorKey: 'totalAmount'
    },
    {
      header: 'Tax',
      accessorKey: 'tax'
    },
    {
      header: 'COGS',
      accessorKey: 'COGS'
    },
    {
      header: 'Profit',
      accessorKey: 'profit'
    },
    {
      header: 'Delivery Date',
      accessorKey: 'deliveryDate'
    },
    {
      header: 'Payment',
      accessorKey: 'payment'
    },
    {
      header: 'Order Source',
      accessorKey: 'orderSource'
    },
    {
      header: 'Delivery Status',
      accessorKey: 'deliveryStatus'
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
  ], []);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <header>Order Delivered</header>
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

export default OrderDelivered