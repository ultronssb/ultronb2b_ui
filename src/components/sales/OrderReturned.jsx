import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BTableGrid from '../../common/B2BTableGrid';

const OrderReturned = () => {
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
      header: 'RTN #',
      accessorKey: 'RTN'
    },
    {
      header: 'Return Date',
      accessorKey: 'returnDate'
    },
    {
      header: 'Customer',
      accessorKey: 'customer',
    },
    {
      header: 'Shipped From',
      accessorKey: 'shippedFrom'
    },
    {
      header: 'Returned To',
      accessorKey: 'returnedTo'
    },
    {
      header: 'Logistic Patner',
      accessorKey: 'logisticPatner'
    },
    {
      header: 'Items',
      accessorKey: 'items'
    },
    {
      header: 'Return Reason',
      accessorKey: 'returnReason'
    },
    {
      header: 'Invoice No',
      accessorKey: 'invoiceNo'
    },
    {
      header: 'Order Source',
      accessorKey: 'orderSource'
    },
    {
      header: 'Refund Status',
      accessorKey: 'refundStatus'
    },
    {
      header: 'Status',
      accessorKey: 'status'
    },
  ], []);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h2>Order Returned</h2>
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

export default OrderReturned;