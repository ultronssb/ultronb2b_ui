import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import GroupCreation from './GroupCreation';
import B2BForm from '../../../common/B2BForm';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '@mantine/core';
import { createB2BAPI } from '../../../api/Interceptor';

const Group = () => {
  const [groups, setGroups] = useState();
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isCreateGroup, setIsCreateGroup] = useState(false);
  const [groupId, setGroupId] = useState('');
  const initialData = {
    name: "",
    status: "ACTIVE"
  }
  const [group, setGroup] = useState(initialData);
  const [status, setStatus] = useState('ACTIVE')
  const [openDropDown, setOpenDropDown] = useState(false);
  const B2B_API = createB2BAPI();

  useEffect(() => {
    fetchGroups();
  }, [pagination.pageIndex, pagination.pageSize, status]);

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`group/get-all-group?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&status=${status}`).json();
      setGroups(response?.response?.content);
      setRowCount(response?.response?.totalElements)
    } catch (error) {
      setIsError(true);
      notify({
        error: true,
        success: false,
        title: error?.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addGroup = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`group/save`, { json: group }).json();
      setGroup(initialData);
      setIsCreateGroup(false)
      notify({ id: 'create_group', message: response.message, success: true, error: false })
    } catch (error) {
      notify({ id: "add_group_error", message: error.message, success: false, error: true });
    }
  }

  const handleChangeOrder = async (id, newOrder) => {
    setGroups(prevData => {
      const updatedData = [...prevData];
      const itemToUpdate = updatedData.find(item => item.id === id);
      const currentOrder = itemToUpdate.displayOrder;
      if (newOrder < currentOrder) {
        updatedData.forEach(item => {
          if (item.displayOrder >= newOrder && item.displayOrder < currentOrder) {
            item.displayOrder += 1;
          }
        });
      } else if (newOrder > currentOrder) {
        updatedData.forEach(item => {
          if (item.displayOrder > currentOrder && item.displayOrder <= newOrder) {
            item.displayOrder -= 1;
          }
        });
      }
      itemToUpdate.displayOrder = newOrder;
      const sortedData = updatedData.sort((a, b) => a.displayOrder - b.displayOrder);
      updateDisplayOrderOnServer(sortedData);
      return sortedData;
    });
  };

  const updateDisplayOrderOnServer = async (groups) => {
    try {
      const res = await B2B_API.put('group/display-order', { json: groups }).json();
      notify({
        message: res.message,
        success: true,
        error: false
      });
    } catch (error) {
      notify({
        message: error.message,
        success: false,
        error: true
      });
    }
  };

  const json = [
    {
      label: "Group Name",
      value: group?.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Tag Name"
    },
    {
      label: "Status",
      value: group?.status,
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
      header: 'Group Name',
      accessorKey: 'name',
      size: 120
    },
    {
      header: 'Display Order',
      accessorKey: 'displayOrder',
      size: 100,
      Cell: ({ cell, row }) => {
        const original = row.original;
        return (
          <select
            value={original.displayOrder}
            onChange={e => handleChangeOrder(original.id, Number(e.target.value))}
            style={{ width: '100px', height: '30px', borderRadius: '5px', padding: '0rem 0.5rem', cursor: 'pointer' }}
          >
            {[...Array(groups.length)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
        );
      },
    },
    {
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div>Status ({status})</div>
          <FontAwesomeIcon icon={openDropDown ? faFilterCircleXmark : faFilter} onClick={() => setOpenDropDown(!openDropDown)} />
          {openDropDown && <div className='status-dropdown'>
            <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>ACTIVE</Text>
            </div>
            <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>INACTIVE</Text>
            </div>
          </div>}
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

  const handleStatusChange = (status) => {
    setOpenDropDown(false)
    setStatus(status)
  }

  const handleChange = (event, key) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setGroup(prev => ({
      ...prev, [key]: key === 'name' ? value.toUpperCase() : value
    }));
  };

  const editGroup = (obj) => {
    setGroup(obj);
    setIsCreateGroup(true);
  };

  const handleCreate = () => {
    setIsCreateGroup(true)
  }

  const handleBack = () => {
    setIsCreateGroup(false)
    setGroup(initialData)
  }

  const handleCancel = () => {
    setIsCreateGroup(false)
    setGroup(initialData)
  };


  return (
    <div className='grid-container'>
      <div className='user--container'>
        <header>Group Details</header>
        <div className='right--section'>
          {
            isCreateGroup ?
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
                name={"Create Group"}
                onClick={handleCreate}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
          }
        </div>
      </div>
      {
        isCreateGroup ?
          <B2BForm
            json={json}
            handleChange={handleChange}
            onSave={addGroup}
            handleCancel={handleCancel}
          />
          :
          <B2BTableGrid
            columns={columns}
            data={groups}
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

export default Group