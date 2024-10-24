import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '@mantine/core';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

export const Loyalty = () => {
  const { stateData } = useContext(ActiveTabContext);

  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
    const [status, setStatus] = useState('ACTIVE')
    const [openDropDown, setOpenDropDown] = useState(false)

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
      header:(
        <div>
          <div onClick={() => setOpenDropDown(!openDropDown)}>Status({status})</div>
          <FontAwesomeIcon icon={openDropDown ? faFilterCircleXmark : faFilter} onClick={() => setOpenDropDown(!openDropDown)} />
          {openDropDown && <div className='status-dropdown'>
            <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>ACTIVE</Text>
            </div>
            <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>INACTIVE</Text>
            </div>
          </div>
          }
        </div>
      ),
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
            <IconPencil onClick={() => editLoyalty(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], [status,openDropDown]);

  const handleStatusChange = (status) => {
    setOpenDropDown(false);
    setStatus(status)
  }

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
        <header>Loyalty Program Details</header>
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
