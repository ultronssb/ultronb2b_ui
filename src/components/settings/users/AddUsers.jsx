import { PasswordInput, Text } from '@mantine/core';
import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import B2BAnchor from '../../../common/B2BAnchor';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import B2BTableGrid from '../../../common/B2BTableGrid';
import B2BTextarea from '../../../common/B2BTextarea';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';
import { createB2BAPI } from '../../../api/Interceptor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

const AddUsers = () => {
  const initialUserState = {
    userId: '',
    firstName: '',
    userName: '',
    lastName: '',
    emailId: '',
    password: '',
    mobileNumber: '',
    roleName: '',
    address: '',
    assignedLocation: '',
    status: 'ACTIVE',
  };

  const [user, setUser] = useState(initialUserState);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [createUserArea, setCreateUserArea] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [rowCount, setRowCount] = useState(5)
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("");
  const B2B_API = createB2BAPI();
  const [status, setStatus] = useState('ACTIVE')
  const [openDropDown, setOpenDropDown] = useState(false)

  useEffect(() => {
    fetchAllUsers();
    fetchAllRoles();
  }, [pagination.pageIndex, pagination.pageSize])

  useEffect(() => {
    fetchAllRoles();
  }, [])

  const onGlobalFilterChange = (value) => {
    setGlobalSearch(value)
  }

  useEffect(() => {
    filterUsers();
  }, [columnFilters, globalSearch])

  const filterUsers = async () => {
    const filter = columnFilters && columnFilters.map(filter => {
      return {
        name: filter.id,
        value: filter.value
      }
    })
    try {
      const response = await B2B_API.post(`user/search?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&search=${globalSearch}`, {
        json: filter,
      }).json();
      setUserFromResponse(response?.response)
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }

  const fetchAllUsers = async () => {
    setIsLoading(true)
    try {
      const response = await B2B_API.get(`user/get-all-user?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&search=${globalSearch}`).json();
      setUserFromResponse(response?.response)
    } catch (error) {
      setIsError(true)
      notify({
        id: "fetch_users",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      })
    }
  }

  const setUserFromResponse = (response) => {
    setRowCount(response?.totalElements || 0)
    setUsers(response.content);
    setIsLoading(false)
  }

  const fetchAllRoles = async () => {
    try {
      const response = await B2B_API.get('role/get-all').json();
      setRoles(response.response);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
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
      header: 'User Name',
      accessorFn: (row) => row?.firstName + " " + (row?.lastName === null ? '' : row?.lastName),
      accessorKey: "userName",
      size:120
    },
    {
      header: 'Email ID',
      accessorKey: 'emailId',
      size:130
    },
    {
      header: 'Mobile No',
      accessorKey: 'mobileNumber',
      size:90
    },
    {
      header: 'Role',
      accessorFn: (row) => row?.roleName,
      accessorKey: 'roleName',
      size:100
    },
    {
      header: 'Location ID',
      accessorKey: 'assignedLocation',
      size:100
    },
    {
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div>Status({status})</div>
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
            <IconPencil onClick={() => editUser(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ], [status, openDropDown])

  const handleStatusChange = (status) => {
    setOpenDropDown(false)
    setStatus(status)
  }

  const editUser = async (userObj) => {
    setCreateUserArea(true);
    const res = await B2B_API.get(`user/${userObj.userId}`).json();
    if (res.response && res.response.emailId) {
      setUser({ ...res.response, userName: res.response.emailId });
      setPagination({ pageIndex: 0, pageSize: 5 })
    } else {
      setUser(res.response);
    }
  }

  const handleChange = (event, key) => {
    setUser(prev => {
      const newUser = { ...prev, [key]: event?.target?.value };
      if (key === 'emailId') {
        newUser.userName = newUser.emailId ? newUser.emailId : '';
      }
      return newUser;
    });
  }

  const changeRoles = (value, key) => {
    setUser((prev) => ({ ...prev, [key]: value }));
  }

  const createUser = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post('user', { json: user }).json();
      setUser(initialUserState)
      setCreateUserArea(false)
      fetchAllUsers();
      notify({
        id: 'create_user_success',
        title: "Success!!!",
        message: user.userId ? "Updated Successfully" : response.message,
        success: true
      })
    } catch (error) {
      notify({
        id: 'create_user_error',
        title: "Oops!!! " || ERROR_MESSAGE,
        message: error.message,
        error: true,
        success: false,
      })
    }
  }

  const handleCreateUser = () => {
    setCreateUserArea(true);
    setUser(initialUserState);
  };

  const handleCancel = () => {
    setCreateUserArea(false)
    setUser(initialUserState)
  };

  return (
    <>
      {!createUserArea && (
        <>
          <div className='user--container'>
            <header>User Details</header>
            <div className='right--section'>
              <B2BButton
                name={"Bulk Upload"}
                leftSection={<IconPlus />}
                color={"#92D050"}
              />
              <B2BButton
                style={{ color: '#000' }}
                name={"Create User"}
                onClick={handleCreateUser}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          <B2BTableGrid
            columns={columns}
            data={users}
            isLoading={isLoading}
            isError={isError}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            manualPagination={true}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            enableFullScreenToggle={true}
            manualFiltering={true}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={onGlobalFilterChange}
          />
        </>
      )}
      {createUserArea && (
        <>
          <div className='user--container'>
            <header>Create User</header>
            <B2BButton
              style={{ color: '#000' }}
              name="Back"
              onClick={() => handleCancel()}
              leftSection={<IconArrowLeft size={15} />}
              color={"rgb(207, 239, 253)"}
            />
          </div>
          <div className='grid-container'>
            <form onSubmit={createUser} className='form-container'>
              <div className="form-group">
                <label className='form-label'>First Name</label>
                <B2BInput
                  value={user?.firstName || ''}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'First Name'}
                  onChange={(event) => handleChange(event, 'firstName')}
                  type={'text'}
                  required={true}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Last Name</label>
                <B2BInput
                  value={user?.lastName || ''}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Last Name'}
                  onChange={(event) => handleChange(event, 'lastName')}
                  type={'text'}
                  required={true}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Email</label>
                <B2BInput
                  value={user?.emailId || ''}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Email'}
                  onChange={(event) => handleChange(event, 'emailId')}
                  type={'email'}
                  required={true}
                />
              </div>
              <div className="form-group password">
                <label className='form-label'>Password</label>
                <PasswordInput
                  name='Password'
                  styles={{ innerInput: { fontSize: '13px', paddingLeft: '8px' } }}
                  className='input-textField'
                  required
                  disabled={user.userId ? true : false}
                  size='md'
                  placeholder="Password"
                  value={user?.password || ''}
                  onChange={(event) => handleChange(event, 'password')}
                />
                {user?.password ? <B2BAnchor title='Change Password' content="Change" style={{ paddingLeft: '1rem' }} href="" /> : null}
              </div>
              <div className="form-group">
                <label className='form-label'>Phone</label>
                <input
                  value={user?.mobileNumber || ''}
                  className='form-input'
                  required
                  type="tel"
                  onChange={(event) => handleChange(event, 'mobileNumber')}
                  placeholder="Phone Number"
                  pattern='[0-9]{10}'
                  maxLength='10'
                  minLength='10'
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Role</label>
                <B2BSelect
                  styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
                  value={user?.roleName}
                  data={roles.map(r => r.name)}
                  required={true}
                  clearable={roles.length > 0 ? true : false}
                  onChange={(value) => changeRoles(value, "roleName")}
                  placeholder={"Select Role"}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Location</label>
                <B2BInput
                  value={user?.assignedLocation || ''}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'assignedLocation')}
                  placeholder="Location"
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
                      checked={user?.status === "ACTIVE"}
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
                      checked={user?.status === "INACTIVE"}
                      name="status"
                      id="status-inactive"
                    />
                    <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className='form-label'>Address</label>
                <B2BTextarea
                  value={user.address}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'address')}
                  placeholder="Address"
                />
              </div>
              <div className='save-button-container'>
                <B2BButton type='button' onClick={handleCancel} color={'red'} name="Cancel" />
                <B2BButton type='submit' name={user?.userId ? "Update" : "Save"} />
              </div>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default AddUsers