import React, { useEffect, useMemo, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import notify from '../../../utils/Notification';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import B2BModal from '../../../common/B2BModal';
import _ from 'lodash';

const ProductTags = () => {
  const initialData = {
    name: "",
    status: "ACTIVE"

  }

  const [tag, setTag] = useState(initialData);
  const [tags, setTags] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })


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

  const editGroup = (roleObj) => {
    setTag((prev => ({ ...prev, ...roleObj })))
  }

  useEffect(() => {
    fetchTags();
  }, [pagination.pageIndex, pagination.pageSize]);

  const addGroup = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`product-tag`, { json: tag }).json();
      setTag(initialData);
      fetchTags()
      notify({
        id: 'create_tag',
        message: response.message || "Tag added successfully",
        success: true,
        error: false
      })

    } catch (error) {
      notify({
        id: "add_tag_error",
        message: error.message,
        success: false,
        error: true
      });
    }
  }


  const fetchTags = async () => {
    try {
      const response = await B2B_API.get(`product-tag/page?page=${pagination.pageIndex}&size=${pagination.pageSize}`).json();
      setTags(response?.response?.content);
      setRowCount(response?.response?.totalElements)
    } catch (error) {
      console.error('Failed to fetch groups:', error);
    }
  };



  const handleChange = (event, key) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setTag(prev => ({
      ...prev, [key]: key === 'name' ? _.capitalize(value) : value
    }));
  };

  return (
    <>
      <div className='grid-container'>
        <form onSubmit={(event) => addGroup(event)} className='form-container'>
          <div className="form-group">
            <label className='form-label'>Name</label>
            <input
              value={tag.name || ''}
              className='form-input'
              required
              type="text"
              onChange={(event) => handleChange(event, 'name')}
              placeholder="Tag Name"
            />
          </div>

          <div className="form-group status-container">
            <label className='form-label'>Status</label>
            <div className='radio-group'>
              <div className='status-block'>
                <input
                  type="radio"
                  value="ACTIVE"
                  onChange={(event) => handleChange(event, 'status')}
                  checked={tag.status === "ACTIVE"}
                  name="status"
                  id="status-active"
                />
                <label className='form-span radio' htmlFor="status-active">ACTIVE</label>
              </div>
              <div className='status-block'>
                <input
                  type="radio"
                  value="INACTIVE"
                  onChange={(event) => handleChange(event, 'status')}
                  checked={tag.status === "INACTIVE"}
                  name="status"
                  id="status-inactive"
                />
                <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
              </div>
            </div>
          </div>
          <div className='save-button-container'>
            <B2BButton type='button' color={'red'} onClick={() => setTag(initialData)} name="Cancel" />
            <B2BButton type='submit' name={tag.name ? 'Update' : "Save"} />
          </div>
        </form>
      </div>
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
    </>
  )
}

export default ProductTags
