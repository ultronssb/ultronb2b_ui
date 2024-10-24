import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BTableGrid from '../../../common/B2BTableGrid';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';
import { createB2BAPI } from '../../../api/Interceptor';
import B2BForm from '../../../common/B2BForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Text } from '@mantine/core';

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
  const [columnFilters, setColumnFilters] = useState([]);  const [isCreateRole, setIsCreateRole] = useState(false);
  const [status, setStatus] = useState('ACTIVE');
  const [openMenubar, setOpenMenubar] = useState(false);

  const [deleteContent, setDeleteContent] = useState({});
  const [opened, { open, close }] = useDisclosure(false);
  const B2B_API = createB2BAPI();

  useEffect(() => {
    fetchRoles();
  }, [pagination.pageIndex, pagination.pageSize,status]);

  const columns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 60,
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
      size: 50,
    },
    {
      header: 'Role Name',
      accessorKey: 'name',
      size: 100
    },
    {
      header: 'Role Description',
      accessorKey: 'description',
      size: 100,
    },
    {
      header: 'Created Date',
      accessorKey: 'createdDate',
      accessorFn: (row) => dayjs(row.createdDate).format('DD/MM/YYYY'),
      size: 50,
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
          </div>}
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
      size: 80,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <IconPencil style={{ cursor: 'pointer', color: 'teal' }} stroke={2} onClick={()=>editRole(original)} />
            <IconTrash style={{ cursor: 'pointer', color: 'red' }} stroke={2}  onClick={()=>handleDeleteModal(original)}/>
          </div>
        )
      }
    }
  ])

  const onGlobalFilterChange = (data) => {
    console.log(data, "Global Filter Change")
  }

  const onColumnFilterFnsChange = (data) => {
    console.log(data, "columnFilter Function change")
  }

  const editRole = (roleObj) => {
    setRole((prev => ({ ...prev, ...roleObj })))
  }

  const handleDeleteModal = (roleObj) => {
    setDeleteContent(roleObj);
    open(true);
  }

  const handleDelete = (roleId) => {
    console.log(roleId);
  }

  const fetchRoles = async () => {
    try {
      const response = await B2B_API.get(`role/get-all-role?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&status=${status}`).json();

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

  const DeleteModalContent = ({ body }) => {
    const { name, roleId } = body;
    return (
      <>
        <h4>Delete This Role {name}</h4>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
          <B2BButton onClick={close} name={"No"} />
          <B2BButton color={'red'} onClick={() => handleDelete(name)} name={"Yes"} />
        </div>
      </>
    )
  }

  return (
    <>
      <div className='grid-container'>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <header>Role Details</header>

          <div className='left--section'>
            {
              isCreateRole ?
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
                  name={"Create Role"}
                  onClick={handleCreate}
                  leftSection={<IconPlus size={15} />}
                  color={"rgb(207, 239, 253)"}
                />
            }
          </div>
        </div>
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
        manualFiltering={true}

        onColumnFilterFnsChange={onColumnFilterFnsChange}
        onGlobalFilterChange={onGlobalFilterChange}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
      />
      <B2BModal opened={opened} title={"Are You Sure ?"} children={<DeleteModalContent body={deleteContent} />} open={open} close={close} />
    </>
  );
}

export default Role;
