import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import ProductTagCreation from './ProductTagCreation';
import B2BForm from '../../../common/B2BForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCircleXmark, faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Text } from '@mantine/core';

const ProductTags = () => {

  const [tags, setTags] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isCreateTag, setIsCreateTag] = useState(false);
  const [tagId, setTagId] = useState('');
  const initialData = {
    name: "",
    status: "ACTIVE"
  }
  const [tag, setTag] = useState(initialData);
  const [status, setStatus] = useState('ACTIVE');
  const [openMenubar, setOpenMenubar] = useState(false)

  useEffect(() => {
    fetchTags();
  }, [pagination.pageIndex, pagination.pageSize, status]);

  const fetchTags = async () => {
    try {
      const response = await B2B_API.get(`product-tag/page?page=${pagination.pageIndex}&size=${pagination.pageSize}&status=${status}`).json();
      setTags(response?.response?.content);
      setRowCount(response?.response?.totalElements)
    } catch (error) {
      console.error('Failed to fetch groups:', error);
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
      header: 'Tag Name',
      accessorKey: 'name',
      size: 120
    },
    {
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div>Status({status})</div>
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

  const json = [
    {
      label: "Tag Name",
      value: tag?.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Tag Name"
    },
    {
      label: "Status",
      value: tag?.status,
      onChange: (event) => handleChange(event, "status"),
      type: "radio",
      className: "form-group status-container",
      placeholder: "Status",
      options: [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" }
      ]
    }
  ]

  const addGroup = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`product-tag`, { json: tag }).json();
      setTag(initialData);
      notify({
        id: 'create_tag',
        message: response.message || "Tag added successfully",
        success: true,
        error: false
      })
      setIsCreateTag(false)
      fetchTags();
    } catch (error) {
      notify({
        id: "add_tag_error",
        message: error.message,
        success: false,
        error: true
      });
    }
  }

  const handleChange = (event, key) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setTag(prev => ({
      ...prev, [key]: key === 'name' ? _.capitalize(value) : value
    }));
  };

  const editGroup = (obj) => {
    setTag(obj);
    setIsCreateTag(true);
  };

  const handleCreate = () => {
    setIsCreateTag(true)
  }

  const handleBack = () => {
    setIsCreateTag(false)
    setTag(initialData)
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
          <B2BForm
            json={json}
            handleChange={handleChange}
            onSave={addGroup}
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
