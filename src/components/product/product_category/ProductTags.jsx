import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import ProductTagCreation from './ProductTagCreation';

const ProductTags = () => {

  const [tags, setTags] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isCreateTag, setIsCreateTag] = useState(false);
  const [tagId, setTagId] = useState('');

  useEffect(() => {
    fetchTags();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchTags = async () => {
    try {
      const response = await B2B_API.get(`product-tag/page?page=${pagination.pageIndex}&size=${pagination.pageSize}`).json();
      setTags(response?.response?.content);
      setRowCount(response?.response?.totalElements)
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };

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
      header: 'Tag Name',
      accessorKey: 'name',
      size: 120
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 100,
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
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
      size: 100,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <IconPencil onClick={() => editGroup(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ])

  const editGroup = (obj) => {
    console.log(obj);
    
    setTagId(obj?.id);
    setIsCreateTag(true);
  };

  const handleCreate = () => {
    setIsCreateTag(true)
  }

  const handleBack = () => {
    setIsCreateTag(false)
    setTagId('')
  }

  return (
    <div className='grid-container'>
      <div className='user--container'>
        <header>Product Tag Details</header>
        <div className='right--section'>
          {
            isCreateTag ?
              <B2BButton
                style={{ color: '#000' }}
                name={"Back"}
                onClick={handleBack}
                leftSection={<IconArrowLeft size={15} />}
                color={"rgb(207, 239, 253)"}
              />
              :
              <B2BButton
                style={{ color: '#000' }}
                name={"Create Tag"}
                onClick={handleCreate}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
          }
        </div>
      </div>
      {
        isCreateTag ?
          <ProductTagCreation
            setIsCreateTag={setIsCreateTag}
            tagId={tagId}
            setTagId={setTagId}
          />
          :
          <B2BTableGrid
            columns={columns}
            data={tags}
            isLoading={isLoading}
            isError={isError}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            enableFullScreenToggle={true}
          />
      }
    </div>

  )
}

export default ProductTags
