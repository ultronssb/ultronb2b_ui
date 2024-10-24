import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createB2BAPI } from '../../api/Interceptor';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';
import notify from '../../utils/Notification';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Text } from '@mantine/core';

const Collections = () => {

  const { stateData } = useContext(ActiveTabContext);

  const [collections, setCollections] = useState([])
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const B2B_API = createB2BAPI();
  const [status, setStatus] = useState('ACTIVE');
  const [openDropDown, setOpenDropDown] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await B2B_API.get(`collections/view?page=${pagination.pageIndex}&size=${pagination.pageSize}&status=${status}`).json();
        const data = res?.response.content || [];
        setRowCount(res?.response?.totalElements || 0);
        setCollections(data);
      } catch (error) {
        setIsError(true);
        notify({
          error: true,
          success: false,
          title: error?.message || 'something went wrong',
        });
      } finally {
        setIsLoading(false);
      }
    }
    fetchCollections();
  }, [status])

  const columns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 70,
      mantineTableHeadCellProps: { align: 'center' },
      mantineTableBodyCellProps: { align: 'center' },
    },
    {
      header: 'Collection Id',
      accessorKey: 'collectionId'
    },
    {
      header: 'Collection Name',
      accessorKey: 'name'
    },
    {
      header: 'Items Count',
      accessorKey: 'itemsCount',
      Cell: ({ row }) => (row.original.product.length),
    },
    {
      header: 'Activation Dt.',
      accessorKey: 'activationDate'
    },
    {
      header: 'Expiry Dt.',
      accessorKey: 'expiryDate'
    },
    {
      header: 'Collection Desc',
      accessorKey: 'description'
    },
    {
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div onClick={() => setOpenDropDown(prev => !prev)}>Status({status})</div>
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
      size:180,
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
      header: 'Image 1',
      accessorKey: 'image_1'
    },
    {
      header: 'Image 2',
      accessorKey: 'image_2'
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
            <IconPencil onClick={() => editCollection(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], [status, openDropDown]);

  const handleStatusChange = (status) => {
    setOpenDropDown(false)
    setStatus(status)
  }

  const sortedCollections = collections.sort((a, b) => {
    return a.collectionId.localeCompare(b.collectionId);
  });

  const editCollection = (varobj) => {
    const id = varobj.id;
    navigate(`/inventory/collections/create?id=${id}`, { state: { ...stateData, tabs: stateData.childTabs } });
  }

  const handleChange = (e) => {
    navigate('/inventory/collections/create', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  return (
    <div>
      <div className='user--container'>
        <header>Collection Details</header>
        <div className='right--section'>
          <B2BButton style={{ color: '#000' }} name={"Create Collection"} onClick={(e) => handleChange(e)} leftSection={<IconPlus size={15} />} color={"rgb(207, 239, 253)"} />
        </div>
      </div>
      <B2BTableGrid
        columns={columns}
        data={sortedCollections}
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
export default Collections
