import { PasswordInput, Text } from '@mantine/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';
import B2BSelect from '../../../common/B2BSelect';
import B2BTextarea from '../../../common/B2BTextarea';
import B2BInput from '../../../common/B2BInput';
import B2BAnchor from '../../../common/B2BAnchor';

const AddUsers = () => {

  const initialUserState = {
    name: '',
    userId: '',
    firstName: '',
    lastName: '',
    address: '',
    mobileNumber: '',
    emailId: '',
    roleName: '',
    status: 'ACTIVE',
    assignedLocation: '',
    userName: '',
    password: ''
  };


  const [user, setUser] = useState(initialUserState);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [createUserArea, setCreateUserArea] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [rowCount, setRowCount] = useState(5)
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      header: 'User ID',
      accessorKey: 'userId'
    },
    {
      header: 'User Name',
      accessorFn: (row) => row?.firstName + " " + row?.lastName
    },
    {
      header: 'Role',
      accessorFn: (row) => row?.roleName
    },
    {
      header: 'Status',
      accessorKey: 'status'
    },
    {
      header: 'Location ID',
      accessorKey: 'assignedLocation'
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
            <IconPencil onClick={() => editUser(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ], [])

  useEffect(() => {
    fetchAllUsers();
    fetchAllRoles();
  }, [])

  const editUser = (userObj) => {
    setCreateUserArea(true)
    setUser((prev => ({ ...prev, ...userObj, })))
  }


  const fetchAllUsers = async () => {
    setIsLoading(true)
    try {
      const response = await B2B_API.get(`user/get-all-user?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = response?.response?.content;
      setRowCount(response?.response?.totalElements)
      setUsers(data);
      setIsLoading(false)
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

  const fetchAllRoles = async () => {
    try {
      const response = await B2B_API.get('role/get-all').json();
      setRoles(response.response);
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };


  const handleChange = (event, key) => {
    setUser(prev => ({ ...prev, [key]: event?.target?.value }))
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

  return (
    <>
      {!createUserArea && (
        <>
          <div className='user--container'>
            <Text size='lg'>User Details</Text>
            <div className='right--section'>
              <B2BButton
                name={"Bulk Upload"}
                leftSection={<IconPlus />}
                color={"#92D050"}
              />
              <B2BButton
                style={{ color: '#000' }}
                name={"Create User"}
                onClick={() => setCreateUserArea(true)}
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
          />
        </>
      )}
      {createUserArea && (
        <>
          <div className='user--container'>
            <Text size='lg'>Create User</Text>
          </div>
          <div className='grid-container'>
            <form onSubmit={createUser} className='form-container'>
              <div className="form-group">
                <label className='form-label'>User ID</label>
                <B2BInput
                  value={user.userId}
                  className='form-input'
                  disabled
                  style={{ cursor: 'not-allowed' }}
                  onChange={(event) => handleChange(event, 'userId')}
                  type="text"
                  placeholder="User ID"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>First Name</label>
                <B2BInput
                  value={user.firstName}
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
                  value={user.lastName}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Last Name'}
                  onChange={(event) => handleChange(event, 'lastName')}
                  type={'text'}
                  required={true}
                />
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
              <div className="form-group">
                <label className='form-label'>Phone</label>
                <input
                  value={user.mobileNumber || ''}
                  className='form-input'
                  required
                  type="number"
                  onChange={(event) => handleChange(event, 'mobileNumber')}
                  placeholder="Phone Number"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Email</label>
                <B2BInput
                  value={user.emailId}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Email'}
                  onChange={(event) => handleChange(event, 'emailId')}
                  type={'email'}
                  required={true}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Role</label>
                <B2BSelect
                  styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
                  value={user.roleName}
                  data={roles.map(r => r.name)}
                  required={true}
                  clearable={roles.length > 0 ? true : false}
                  onChange={(value) => changeRoles(value, "roleName")}
                  placeholder={"Select Role"}
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
                      checked={user.status === "ACTIVE"}
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
                      checked={user.status === "INACTIVE"}
                      name="status"
                      id="status-inactive"
                    />
                    <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className='form-label'>Location</label>
                <B2BInput
                  value={user.assignedLocation || ''}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'assignedLocation')}
                  placeholder="Location"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>UserName</label>
                <B2BInput
                  value={user.userName || ''}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'userName')}
                  placeholder="User Name"
                />
              </div>
              <div className="form-group password">
                <label className='form-label'>Password</label>
                <PasswordInput
                  name='Password'
                  styles={{ innerInput: { fontSize: '13px', paddingLeft: '8px' } }}
                  className='input-textField'
                  required
                  disabled={user.password ? true : false}
                  size='md'
                  placeholder="Password"
                  value={user.password}
                  onChange={(event) => handleChange(event, 'password')}
                />
                {user.password ? <B2BAnchor title='Change Password' content="Change" style={{ paddingLeft: '1rem' }} href="" /> : null}
              </div>
              <div className='save-button-container'>
                <B2BButton type='button' onClick={() => { setCreateUserArea(false); setUser(initialUserState) }} color={'red'} name="Cancel" />
                <B2BButton type={user.userId ? 'button' : 'submit'} name={user?.userId ? "Update" : "Save"} />
              </div>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default AddUsers