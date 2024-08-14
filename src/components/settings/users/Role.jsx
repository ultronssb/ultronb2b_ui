import { IconPencil, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';

const Role = () => {
  const [role, setRole] = useState({
    name: '',
    roleId: '',
    description: '',
    status: "ACTIVE"
  });
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    fetchRoles();
  }, [pagination.pageIndex, pagination.pageSize]);

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
      header: 'Role ID',
      accessorKey: 'roleId',
      size: 100,
    },
    {
      header: 'Role Name',
      accessorKey: 'name',
      size: 120
    },
    {
      header: 'Role Description',
      accessorKey: 'description',
      size: 210,
    },
    {
      header: 'Created Date',
      accessorKey: 'createdDate',
      accessorFn: (row) => dayjs(row.createdDate).format('DD/MM/YYYY'),
      size: 100,
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
            <IconPencil style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
            <IconTrash style={{ cursor: 'pointer', color: 'red' }} stroke={2} />
          </div>
        )
      }
    }
  ])

  const fetchRoles = async () => {
    try {
      const response = await B2B_API.get(`role/get-all-role?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();

      setRoles(response?.response?.content);
      setRowCount(response?.response?.totalElements)
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const handleChange = (event, key) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setRole(prev => ({
      ...prev, [key]: key === 'name' ? value.toUpperCase() : value
    }));
  };

  const createRole = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post('role', { json: role }).json();
      setRole({ name: '', description: '', roleId: '', status: 'ACTIVE' });
      fetchRoles();
      notify({
        id: "add_role",
        message: response.message,
        success: true,
        error: false
      });
    } catch (error) {
      notify({
        id: "add_role_error",
        message: error.message,
        success: false,
        error: true
      });
    }
  };

  return (
    <>
      <div className='grid-container'>
        <form onSubmit={createRole} className='form-container'>
          <div className="form-group">
            <label className='form-label'>Role ID</label>
            <input
              value={role.roleId}
              className='form-input'
              disabled
              style={{ cursor: 'not-allowed' }}
              onChange={(event) => handleChange(event, 'roleId')}
              type="text"
              placeholder="Role ID"
            />
          </div>
          <div className="form-group">
            <label className='form-label'>Name</label>
            <input
              value={role.name || ''}
              className='form-input'
              required
              type="text"
              onChange={(event) => handleChange(event, 'name')}
              placeholder="Role Name"
            />
          </div>
          <div className="form-group">
            <label className='form-label'>Role Description</label>
            <input
              value={role.description || ''}
              className='form-input'
              required
              type="text"
              onChange={(event) => handleChange(event, 'description')}
              placeholder="Role Description"
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
                  checked={role.status === "ACTIVE"}
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
                  checked={role.status === "INACTIVE"}
                  name="status"
                  id="status-inactive"
                />
                <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
              </div>
            </div>
          </div>
          <div className='save-button-container'>
            <B2BButton type='submit' name="Save" />
          </div>
        </form>
      </div>
      <B2BTableGrid
        columns={columns}
        data={roles}
        isLoading={isLoading}
        isError={isError}
        enableTopToolbar={true}
        enableGlobalFilter={true}
        pagination={pagination}
        pageCount={5}
        rowCount={rowCount}
        onPaginationChange={setPagination}
        enableFullScreenToggle={true}
      />
    </>
  );
}

export default Role;
