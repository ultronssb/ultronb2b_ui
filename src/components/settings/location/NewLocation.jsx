import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import B2BTextarea from '../../../common/B2BTextarea';
import { getpayLoadFromToken } from '../../../common/JwtPayload';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';
import { createB2BAPI } from '../../../api/Interceptor';

const NewLocation = () => {

  const initialCompany = {
    companyId: "",
    address: "",
    cinNumber: "",
    city: "",
    companyLocationId: "",
    companyURL: "",
    email: "",
    gstNumber: "",
    latitude: "",
    locatorUrl: "",
    longitude: "",
    mobileNumber: "",
    name: "",
    pinCode: "",
    priceBook: "",
    radius: "",
    revenueShare: "",
    state: "",
    tinNumber: "",
    zone: "",
    locationTypeId: '',
    locationType: {},
  }

  const [company, setCompany] = useState(initialCompany);
  const [companyLocations, setCompanyLocations] = useState([]);
  const navigate = useNavigate();
  const B2B_API = createB2BAPI();


  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchAllCompanyLocations();
        const query_param = new URLSearchParams(window.location.search);
        const id = query_param.get('id');
        if (id) {
          await fetchCompany(id);
        } else {
          const payload = await getpayLoadFromToken();
          setCompany(prevCompany => ({
            ...prevCompany,
            companyId: payload.iss
          }));
        }
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchData();
  }, [window.location.search]);
  const fetchAllCompanyLocations = async () => {
    const response = await B2B_API.get('location-type/get-all').json();
    setCompanyLocations(response?.response)
  }
  const fetchCompany = async (id) => {
    try {

      const response = await B2B_API.get(`company-location/${id}`).json();
      const data = response.response;
      setCompany({
        ...data,
        locationTypeId: data.locationType?.locationTypeId,
        companyId: data.company?.companyId
      });
    } catch (error) {

      console.error('Error fetching company data:', error);
    }
  };
  const handleChange = (event, key) => {
    const { value } = event?.target
    setCompany((prev) => ({ ...prev, [key]: value }))
  }

  const handleLocationTypeChange = (value, key) => {
    setCompany(prev => ({ ...prev, [key]: value }));
  };

  const createCompanyProfile = async (event) => {
    event.preventDefault();
    const locationType = _.find(companyLocations, cl => cl.locationId === company.locationTypeId)
    company.locationType = locationType;
    const isUpdate = company.id;
    const successMessage = isUpdate ? 'updated' : 'added';
    try {
      await B2B_API.post('company-location/save', { json: company }).json();
      navigate('/settings/location')
      notify({
        title: "Success!!! ",
        message: `Company ${successMessage} Successfully`,
        success: true,
        error: false
      })
    } catch (error) {
      notify({
        title: "Oops!!! ",
        message: error.message,
        success: false,
        error: true
      })
    }

  }
  return (
    <div className='grid-container'>
      <div>
        <header>Create Location Details</header>
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
          <label className='form-label'>Location Name</label>
          <B2BInput
            value={company.name}
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
            value={company.locationTypeId || company.locationType?.locationTypeId}
            styles={{ input: { fontSize: '14px' } }}
            data={companyLocations?.map(loc => ({ label: loc.name, value: loc.locationTypeId }))}
            placeholder={'Location Type'}
            onChange={(value) => handleLocationTypeChange(value, 'locationTypeId')}
            type={'text'}
            clearable={companyLocations.length > 0 ? true : false}
          />
        </div>
        <div className="form-group">
          <label className='form-label'>Address</label>
          <B2BTextarea
            value={company.address}
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
            value={company.companyURL}
            styles={{ input: { fontSize: '14px' } }}
            className='form-input'
            required
            type="text"
            onChange={(event) => handleChange(event, 'companyURL')}
            placeholder="Company URL"
          />
        </div>

        <div className="form-group">
          <label className='form-label'>Location Zone</label>
          <B2BInput
            value={company.zone}
            styles={{ input: { fontSize: '14px' } }}
            className='form-input'
            required
            type="text"
            onChange={(event) => handleChange(event, 'zone')}
            placeholder="Company Zone"
          />
        </div>
        <div className="form-group">
          <label className='form-label'>Location Email</label>
          <B2BInput
            value={company.email}
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
            value={company.city}
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
            value={company.state}
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
            value={company.pinCode}
            styles={{ input: { fontSize: '14px' } }}
            className='form-input'
            required
            type="number"
            onChange={(event) => handleChange(event, 'pinCode')}
            placeholder="Pin Code"
          />
        </div>

        <div className="form-group">
          <label className='form-label'>Phone</label>
          <input
            value={company.mobileNumber}
            className='form-input'
            required
            type="number"
            onChange={(event) => handleChange(event, 'mobileNumber')}
            placeholder="Phone Number"
          />
        </div>

        <div className="form-group">
          <label className='form-label'>Tin Number</label>
          <B2BInput
            styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
            value={company.tinNumber}
            required={true}
            onChange={(value) => handleChange(value, "tinNumber")}
            type="text"
            placeholder={"Tin Number"}
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
        <div className="form-group">
          <label className='form-label'>Latitude</label>
          <B2BInput
            value={company.latitude}
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
            value={company.longitude}
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
            value={company.cinNumber}
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
            value={company.gstNumber}
            className='form-input'
            required
            type="text"
            onChange={(event) => handleChange(event, 'gstNumber')}
            placeholder="GST Number"
          />
        </div>
        <div className='save-button-container'>
          <B2BButton type='button' color={'red'} onClick={() => navigate('/settings/location')} name="Cancel" />
          <B2BButton type='submit' name={company?.companyLocationId ? "Update" : "Save"} />
        </div>
      </form>
    </div >
  )
}

export default NewLocation