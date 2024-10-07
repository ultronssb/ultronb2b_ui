import { IconPencil } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BTableGrid from '../../../common/B2BTableGrid';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';

const Role = () => {
  const initialData = {
    name: '',
    roleId: '',
    description: '',
    status: "ACTIVE"
  }
  const [role, setRole] = useState(initialData);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [rowCount, setRowCount] = useState(0);

  const formRef = useRef(null)

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
            <IconPencil onClick={() => editRole(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ])


  const editRole = (obj) => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'auto' });
    }
    setRole((prev) => ({ ...prev, ...obj }));
  };

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
      ...prev,
      [key]: key === 'name' ? value.toUpperCase() : value
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

  const json = [
    {
      label: "Role ID",
      value: role.roleId,
      onChange: (event) => handleChange(event, 'roleId'),
      type: "text",
      placeholder: "Role ID",
      disable: true
    },
    {
      label: "Role Name",
      value: role.name,
      onChange: (event) => handleChange(event, 'name'),
      type: "text",
      placeholder: "Role Name"
    },
    {
      label: "Role Description",
      value: role.description,
      onChange: (event) => handleChange(event, 'description'),
      type: "text",
      placeholder: "Role Description"
    },
    {
      label: "Status",
      type: "radio",
      name: "status",
      className: "form-group status-container",
      options: [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" }
      ],
      value: role.status,
      onChange: (event) => handleChange(event, 'status')
    }
  ]

  return (
    <>
      <div className='grid-container'>
        <form onSubmit={(event) => createRole(event)} className='form-container'>
          {json.map(e => (
            <div className={e.className ? e.className : "form-group"}>
              <label className='form-label'>{e.label}</label>
              {e.type == "radio" ? (
                <div className='radio-label-block'>
                  {e.options.map((option, idx) => (
                    <div className='radio-group'>
                      <div className='status-block'>
                        <input
                          id={`${e.name}-${option.value.toLowerCase()}`}
                          value={option.value}
                          style={e.style && e.style}
                          onChange={(event) => e.onChange(event, e.name)}
                          checked={e.value === option.value}
                          type={e.type}
                          placeholder={e.placeholder}
                        />
                        <label className='form-span radio' htmlFor={`${e.name}-${option.value.toLowerCase()}`}>{option.label}</label>
                      </div>
                    </div>
                  ))}
                </div>
              )
                :
                <B2BInput
                  value={e.value}
                  className='form-input'
                  style={e.style}
                  onChange={(event) => e.onChange(event, e.name)}
                  type={e.type}
                  disabled={e.disable}
                  required={e.required}
                  placeholder={e.placeholder}
                />
              }
            </div>
          ))}
          <div className='save-button-container'>
            <B2BButton type='button' color={'red'} onClick={() => setRole(initialData)} name="Cancel" />
            <B2BButton type='submit' name={role?.roleId ? 'Update' : "Save"} />
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
        rowCount={rowCount}
        onPaginationChange={setPagination}
        enableFullScreenToggle={true}
      />
    </>
  );
}

export default Role;
