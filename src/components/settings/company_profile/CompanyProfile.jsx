import { Text } from '@mantine/core';
import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import B2BTableGrid from '../../../common/B2BTableGrid';
import B2BTextarea from '../../../common/B2BTextarea';
import { getpayLoadFromToken } from '../../../common/JwtPayload';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';

const CompanyProfile = () => {

  const initialCompany = {
    companyId: '',
    name: '',
    address: '',
    zone: '',
    city: '',
    state: '',
    pinCode: '',
    tinNumber: '',
    cinNumber: '',
    gstNumber: '',
    companyURL: '',
    email: '',
    mobileNumber: '',
    latitude: '',
    longitude: '',
    locationType: {
      locationTypeId: '',
    },
  }
  const payload = useMemo(() => getpayLoadFromToken(), [])
  const user = payload?.ROLE

  const [company, setCompany] = useState(initialCompany);
  const [companyLocations, setCompanyLocations] = useState([]);
  const [companyProfile, setCompanyProfile] = useState([]);
  const [isCompany, setIsCompany] = useState(user === 'COMPANY_ADMIN' ? true : false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    if (user === 'COMPANY_ADMIN') {
      fetchCompany()
    }
    if (user === 'SUPER_ADMIN') {
      fetchCompanyDetails()
    }
    fetchAllCompanyLocations();
  }, [])

  useEffect(() => {
    if (user === 'SUPER_ADMIN') {
      fetchCompanyDetails()
    }
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchAllCompanyLocations = async () => {
    const response = await B2B_API.get('location-type/get-all').json();
    setCompanyLocations(response?.response)
  }

  const fetchCompany = async () => {
    const response = await B2B_API.get(`company/${payload.iss}`).json();
    setCompany(response?.response)
  }

  const fetchCompanyDetails = async () => {
    try {
      const res = await B2B_API.get(`company/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = res?.response?.content || [];
      setRowCount(res?.response?.totalElements || 0);
      setCompanyProfile(data);
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
  }

  const handleChange = (event, key) => {
    const { value } = event?.target
    setCompany((prev) => ({ ...prev, [key]: value }))
  }

  // const handleChange = (event, field, value) => {
  //   if (field === 'pinCode') {
  //     if (value.length <= 6 && /^[0-9]*$/.test(value)) {
  //       setCompany((prevCompany) => ({
  //         ...prevCompany,
  //         [field]: value,
  //       }));
  //     }
  //   } else {
  //     setCompany((prev) => ({ ...prev, [field]: event.target.value }))
  //   }
  // };


  const handleLocationTypeChange = (value, key) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setCompany((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    }
  };

  const createCompanyProfile = async (event) => {
    event.preventDefault();
    const locationType = _.find(companyLocations, cl => cl?.locationTypeId === company?.locationType?.locationTypeId);
    // if (!locationType) {
    //   return;
    // }
    company.locationType = locationType;
    const isUpdate = company.id;
    const successMessage = isUpdate ? 'updated' : 'added';
    try {
      const response = await B2B_API.post('company/save', { json: company }).json();
      notify({
        title: "Success!!! ",
        message: `Company ${successMessage} Successfully`,
        success: true,
        error: false
      })
      setIsCompany(false)
    } catch (error) {
      notify({
        title: "Oops!!! ",
        message: error.message,
        success: false,
        error: true
      })
    }

  }

  const columns = useMemo(() => [
    {
      header: 'Company Name',
      accessorKey: 'name'
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Phone',
      accessorKey: 'mobileNumber'
    },
    {
      header: 'Company URL',
      accessorKey: 'companyURL'
    },
    {
      header: 'Address',
      accessorKey: 'address'
    },
    {
      header: 'Status',
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
      mainTableHeaderCellProps: {
        align: 'center'
      },
      mainTableBodyCellProps: {
        align: 'center'
      },
      size: 100,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <IconPencil onClick={() => editCompnay(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editCompnay = (varobj) => {
    setIsCompany(true);
    setCompany((prev => ({ ...prev, ...varobj })));
  }

  const handleBack = (e) => {
    setIsCompany(false)
  }

  return (
    <div className='grid-container'>
      {
        isCompany && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>Create Company Profile</div>
              {user === 'SUPER_ADMIN' && <B2BButton style={{ color: '#000' }} name="Back" onClick={handleBack} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />}
            </div>
            <form onSubmit={createCompanyProfile} className='form-container'>
              <div className="form-group">
                <label className='form-label'>Company ID</label>
                <B2BInput
                  value={company?.companyId}
                  className='form-input'
                  disabled
                  style={{ cursor: 'not-allowed' }}
                  type="text"
                  placeholder="Company ID"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Company Name</label>
                <B2BInput
                  value={company?.name}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Company Name'}
                  onChange={(event) => handleChange(event, 'name')}
                  type={'text'}
                  required={true}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Location Type</label>
                <B2BSelect
                  value={company?.locationType?.locationTypeId}
                  styles={{ input: { fontSize: '14px' } }}
                  data={companyLocations?.map(loc => ({ label: loc.name, value: loc.locationTypeId }))}
                  placeholder={'Location Type'}
                  onChange={(value) => handleLocationTypeChange(value, 'locationType.locationTypeId')}
                  type={'text'}
                  clearable={companyLocations.length > 0 ? true : false}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Address</label>
                <B2BTextarea
                  value={company?.address}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'address')}
                  placeholder="Address"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Company URL</label>
                <B2BInput
                  value={company?.companyURL}
                  styles={{ input: { fontSize: '14px' } }}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'companyURL')}
                  placeholder="Company URL"
                />
              </div>

              <div className="form-group">
                <label className='form-label'>Company Zone</label>
                <B2BInput
                  value={company?.zone}
                  styles={{ input: { fontSize: '14px' } }}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'zone')}
                  placeholder="Company Zone"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Company Email</label>
                <B2BInput
                  value={company?.email}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Email'}
                  onChange={(event) => handleChange(event, 'email')}
                  type={'email'}
                  required={true}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>City</label>
                <B2BInput
                  value={company?.city}
                  styles={{ input: { fontSize: '14px' } }}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'city')}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label className='form-label'>State</label>
                <B2BInput
                  value={company?.state}
                  styles={{ input: { fontSize: '14px' } }}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'state')}
                  placeholder="State"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Pin Code</label>
                <B2BInput
                  value={company?.pinCode}
                  styles={{ input: { fontSize: '14px' } }}
                  className='form-input'
                  required
                  type="number"
                  onChange={(event) => {
                    const value = event.target.value.replace(/\D/g, '').slice(0, 6);
                    handleChange(event, 'pinCode', value)
                  }}
                  placeholder="Pin Code"
                  pattern="[0-9]{6}"
                  maxLength="6"
                  minLength="6"
                  onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                />
              </div>

              <div className="form-group">
                <label className='form-label'>Phone</label>
                <input
                  value={company?.mobileNumber}
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
                <label className='form-label'>Tin Number</label>
                <B2BInput
                  styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
                  value={company?.tinNumber}
                  required={true}
                  onChange={(value) => handleChange(value, "tinNumber")}
                  type="text"
                  placeholder={"Tin Number"}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Latitude</label>
                <B2BInput
                  value={company?.latitude}
                  className='form-input'
                  required
                  type="number"
                  onChange={(event) => handleChange(event, 'latitude')}
                  placeholder="Latitude"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Longitude</label>
                <B2BInput
                  value={company?.longitude}
                  className='form-input'
                  required
                  type="number"
                  onChange={(event) => handleChange(event, 'longitude')}
                  placeholder="Longitude"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>CIN Number</label>
                <B2BInput
                  value={company?.cinNumber}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'cinNumber')}
                  placeholder="CIN Number"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>GST Number</label>
                <B2BInput
                  value={company?.gstNumber}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'gstNumber')}
                  placeholder="GST Number"
                />
              </div>
              {/* <div className="form-group status-container">
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
              </div> */}
              <div className='save-button-container'>
                {user === 'SUPER_ADMIN' && <B2BButton type='button' color={'red'} onClick={handleBack} name="Cancel" />}
                <B2BButton type='submit' name={company?.companyId ? "Update" : "Save"} />
              </div>
            </form>
          </div>
        )
      }
      {!isCompany && user === 'SUPER_ADMIN' && (
        <div>
          <div className='user--container'>
            <Text size='lg' fw={800}>Company Profile Details</Text>
            <div className='right--section'>
              <B2BButton style={{ color: '#000' }} name={"Create Company Profile"} onClick={() => setIsCompany(true)} leftSection={<IconPlus size={15} />} color={"rgb(207, 239, 253)"} />
            </div>
          </div>
          <B2BTableGrid
            columns={columns}
            data={companyProfile}
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
        </div>
      )}
    </div >
  )
}

export default CompanyProfile