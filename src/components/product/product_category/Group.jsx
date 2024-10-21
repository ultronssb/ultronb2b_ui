import { IconPencil } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';

const Group = () => {

  const initialData = {
    name: "",
    status: "ACTIVE"

  }

  const [group, setGroup] = useState(initialData);
  const [groups, setGroups] = useState();
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

  useEffect(() => {
    fetchGroups();
  }, [pagination.pageIndex, pagination.pageSize]);

  const addGroup = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`group/save`, { json: group }).json();
      setGroup(initialData);
      fetchGroups()
      notify({
        id: 'create_group',
        message: response.message,
        success: true,
        error: false
      })

    } catch (error) {
      notify({
        id: "add_group_error",
        message: error.message,
        success: false,
        error: true
      });
    }
  }

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`group/get-all-group?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
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

  const handleChange = (event, key) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setGroup(prev => ({
      ...prev, [key]: key === 'name' ? value.toUpperCase() : value
    }));
  };

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

  const editGroup = (roleObj) => {
    setGroup((prev => ({ ...prev, ...roleObj })))
  }

  return (
    <>
      <div className='grid-container'>
      <header>Group</header>
        <form onSubmit={(event) => addGroup(event)} className='form-container'>
          <div className="form-group">
            <label className='form-label'>Name</label>
            <input
              value={group.name || ''}
              className='form-input'
              required
              type="text"
              onChange={(event) => handleChange(event, 'name')}
              placeholder="Group Name"
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
                  checked={group.status === "ACTIVE"}
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
                  checked={group.status === "INACTIVE"}
                  name="status"
                  id="status-inactive"
                />
                <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
              </div>
            </div>
          </div>
          <div className='save-button-container'>
            <B2BButton type='button' color={'red'} onClick={() => setGroup(initialData)} name="Cancel" />
            <B2BButton type='submit' name={group?.id ? 'Update' : "Save"} />
          </div>
        </form>
      </div>
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
    </>
  )
}

export default Group