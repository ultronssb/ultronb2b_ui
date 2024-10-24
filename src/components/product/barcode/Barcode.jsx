import React, { useEffect, useMemo, useState } from 'react'
import B2BTableGrid from '../../../common/B2BTableGrid'
import Barcode from 'react-barcode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Text } from '@mantine/core';
import { createB2BAPI } from '../../../api/Interceptor';

const VariantBarcode = () => {
  const [productVariant, setProductVariant] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [status, setStatus] = useState('ACTIVE');
  const [openMenubar, setOpenMenubar] = useState(false);
  const B2B_API = createB2BAPI();

  useEffect(() => {
    fetchVariant();
  }, [pagination, status])

  const fetchVariant = async () => {
    try {
      const res = await B2B_API.get(`barcode/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&status=${status}`).json();
      const data = res.response.content;
      setProductVariant(res?.response?.content);
      setRowCount(res?.response?.totalElements)
      console.log(data, "prod");
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const handleStatusChange = (status) => {
    setOpenMenubar(false)
    setStatus(status)
  }

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
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div>status({status})</div>
          <FontAwesomeIcon icon={openMenubar ? faFilterCircleXmark : faFilter} onClick={() => setOpenMenubar(!openMenubar)} />
          {openMenubar && <div className='status-dropdown'>
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
      size: 180,
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