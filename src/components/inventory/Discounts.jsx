import { Text } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';

const Discounts = () => {
  const { stateData } = useContext(ActiveTabContext);

  const [isDiscount, setIsDiscount] = useState(false);
  const [discounts, setDiscounts] = useState([])
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
      header: 'Discount Id',
      accessorKey: 'discountId'
    },
    {
      header: 'Discount Name',
      accessorKey: 'discountName'
    },
    {
      header: 'Discount Type',
      accessorKey: 'discountType'
    },
    {
      header: 'Start Dt.',
      accessorKey: 'startDate'
    },
    {
      header: 'End Dt.',
      accessorKey: 'endDate'
    },
    {
      header: 'Items ',
      accessorKey: 'items '
    },
    {
      header: 'Status',
      accessorKey: 'status'
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
            <IconPencil onClick={() => editDiscount(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editDiscount = (varobj) => {
    setIsDiscount(true)
    setDiscounts((prev => ({ ...prev, ...varobj })));
  }

  const handleChange = (e) => {
    setIsDiscount(true)
    navigate('/inventory/discounts/create', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  return (
    <div style={{marginTop:'5rem'}}>
      {!isDiscount && (
        <div>
          <div className='user--container'>
            <Text size='lg' fw={800}>Discounts Details</Text>
            <div className='right--section'>
              <B2BButton style={{ color: '#000' }} name={"Create Discounts"} onClick={(e) => handleChange(e)} leftSection={<IconPlus size={15} />} color={"rgb(207, 239, 253)"} />
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
      )}
    </div>
  )
}

export default Discounts
