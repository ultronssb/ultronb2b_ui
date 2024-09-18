import React, { useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import { Text } from '@mantine/core';
import B2BTableGrid from '../../common/B2BTableGrid';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import { ActiveTabContext } from '../../layout/Layout';

const Loyalty = () => {
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
      header: 'Loyalty Id',
      accessorKey: 'loyaltyId'
    },
    {
      header: 'Loyalty Type',
      accessorKey: 'loyaltyType'
    },
    {
      header: 'Accumulate Point',
      accessorKey: 'accumulatePoint'
    },
    {
      header: 'Redemption Point',
      accessorKey: 'redemptionPoint'
    },
    {
      header: 'Created By',
      accessorKey: 'createdBy'
    },
    {
      header: 'Created On',
      accessorKey: 'createdOn'
    },
    {
      header: 'Status',
      accessorKey: 'status'
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

  const handleChange = (e) => {
    setIsCustomer(true)
    navigate('/crm/loyalty/create', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  return (
    <>
      {!isCustomer && (
        <>
          <div className='user--container'>
            <Text size='lg'>Loyalty Program Details</Text>
            <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"Create Loyalty"}
                onClick={(e) => handleChange(e)}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
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

export default Loyalty