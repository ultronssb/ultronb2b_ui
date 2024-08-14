import { Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';
import B2BSelect from '../../../common/B2BSelect';

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
    status: 'ACTIVE', // Default value remains as 'ACTIVE'
    assignedLocation: '',
    userName: '',
    password: ''
  };


  const [user, setUser] = useState(initialUserState);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [createUserArea, setCreateUserArea] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const columns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1
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

  ], [])

  useEffect(() => {
    fetchAllUsers();
    fetchAllRoles();
  }, [])


  const fetchAllUsers = async () => {
    setIsLoading(true)
    try {
      const response = await B2B_API.get('user/get-all').json();
      const data = response?.response;
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
    const response = await B2B_API.post('user', { json: user }).json();
    setUser(initialUserState)

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
                rightSection={<IconPlus />}
                color={"#92D050"}
              />
              <B2BButton
                style={{ color: '#000' }}
                name={"Create User"}
                onClick={() => setCreateUserArea(true)}
                rightSection={<IconPlus size={15} />}
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
            pageCount={5}
            rowCount={10}
            onPaginationChange={setPagination}
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
                <input
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
                <input
                  value={user.firstName || ''}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'firstName')}
                  placeholder="First Name"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Last Name</label>
                <input
                  value={user.lastName || ''}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'lastName')}
                  placeholder="Last Name"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Address</label>
                <input
                  value={user.address || ''}
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
                <input
                  value={user.emailId || ''}
                  className='form-input'
                  required
                  type="email"
                  onChange={(event) => handleChange(event, 'emailId')}
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Role</label>
                {/* <input
                  value={user.role || ''}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'role')}
                  placeholder="Role"
                /> */}
                {/* <select className='form-select' value={user.role} onChange={()=> console.log("sdhfjsdh")}>
                  <option value="" selected disabled>Select Role</option>
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>{role.name}</option>
                  ))}
                </select> */}
                <B2BSelect
                  value={user.roleName}
                  className="form-select"
                  data={roles.map(r => r.name)}
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
                <input
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
                <input
                  value={user.userName || ''}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'userName')}
                  placeholder="User Name"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Password</label>
                <input
                  value={user.password || ''}
                  className='form-input'
                  required
                  type="password"
                  onChange={(event) => handleChange(event, 'password')}
                  placeholder="Password"
                />
              </div>
              <div className='save-button-container'>
                <B2BButton type='submit' name="Save" />
              </div>
            </form>
          </div>
        </>
      )}
    </>
  )
}

export default AddUsers