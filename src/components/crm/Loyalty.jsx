import { Text } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';

export const Loyalty = () => {
  const { stateData } = useContext(ActiveTabContext);

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
            <IconPencil onClick={() => editLoyalty(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editLoyalty = (node) => {
    const id = node.id;
    navigate(`/crm/loyalty/create?id=${id}`);
  };

  const handleChange = (e) => {
    navigate('/crm/loyalty/create', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  return (
    <div>
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
    </div>
  )
}
