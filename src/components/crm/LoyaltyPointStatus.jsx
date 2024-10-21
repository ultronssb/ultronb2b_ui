import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';

const LoyaltyPointStatus = () => {
  const { stateData } = useContext(ActiveTabContext);

  const [isCustomer, setIsCustomer] = useState(false);
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
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
    },
    {
      header: 'Loyalty Type',
      accessorKey: 'loyaltyType'
    },
    {
      header: 'Points Accumulate',
      accessorKey: 'accumulatePoint'
    },
    {
      header: 'Points Redemption',
      accessorKey: 'redemptionPoint'
    },
    {
      header: '%Uplift',
      accessorKey: 'uplift'
    },
    {
      header: 'Expiry Date',
      accessorKey: 'expiryDate'
    },
    {
      header: 'Points Expiry',
      accessorKey: 'pointsExpiry'
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
    // {
    //   header: 'Actions',
    //   mainTableHeaderCellProps: {
    //     align: 'center'
    //   },
    //   mainTableBodyCellProps: {
    //     align: 'center'
    //   },
    //   size: 100,
    //   Cell: ({ row }) => {
    //     const { original } = row;
    //     return (
    //       <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    //         <IconPencil onClick={() => editVarient(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
    //       </div>
    //     );
    //   }
    // }
  ], []);


  return (
    <>
      {!isCustomer && (
        <>
          <div className='user--container'>
            <header>Loyalty Points Status</header>
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

export default LoyaltyPointStatus