import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActiveTabContext } from '../../layout/Layout';
import B2BInput from '../../common/B2BInput';
import B2BSelect from '../../common/B2BSelect';
import './CustomerCreate.css';
import { Checkbox, Modal, Tabs } from '@mantine/core';
import { B2B_API } from '../../api/Interceptor';
import states from '../crm/StatesAndDistricts.json';
import _ from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { useDisclosure } from '@mantine/hooks';

const CustomerCreate = () => {
  const { stateData } = useContext(ActiveTabContext);
  const initialCustomerState = {
    name: '',
    email: '',
    mobileNo: '',
    currency: '',
    purchaseType: '',
    purchaseMode: '',
    creditLimit: '',
    creditBalance: '',
    creditDays: '',
    gstType: '',
    status: '',
    checkPrintName: '',
    gstnNo: '',
    agents: '',
    approveStatus: '',
    approvalRequired: false,
    activateLoyalty: '',
    location: [
      {
        address1: '',
        address2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'INDIA',
        isPrimary: true
      }
    ]
  };
  const [customer, setCustomer] = useState(initialCustomerState);
  const [cities, setCities] = useState([]);
  const options = ['Customer', 'Address'];
  const [activeTab, setActiveTab] = useState(options[0]);
  const [opened, { open, close }] = useDisclosure(false);
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'INDIA',
    isPrimary: true
  });

  console.log("new : ", newAddress);


  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;

      try {
        const [customerRes, locationRes] = await Promise.all([
          B2B_API.get(`customer/${id}`).json(),
          B2B_API.get(`locations/customer-location/${id}`).json(),
        ]);
        setCustomer(prev => ({
          ...prev,
          ...customerRes.response,
          location: Array.isArray(locationRes.response) ? locationRes.response : [locationRes.response],
        }));
        setAddresses(Array.isArray(locationRes.response) ? locationRes.response : [locationRes.response]);
        setCities(states[locationRes.response.state] || []);
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };

    fetchCustomerData();
  }, [id]);


  const customerFields = [
    {
      id: 1,
      name: "Customer Name",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'name'),
      value: customer?.name,
      category: "customer"
    },
    {
      id: 2,
      name: "Email",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'email'),
      value: customer?.email,
      category: "customer"
    },
    {
      id: 3,
      name: "Mobile No.",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'mobileNo'),
      value: customer?.mobileNo,
      category: "customer"
    },
    {
      id: 4,
      name: "Currency",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'currency'),
      value: customer?.currency,
      category: "customer"
    },
    {
      id: 5,
      name: "Purchase Type",
      fieldType: "selectField",
      onChange: (event) => handleChange(event, 'purchaseType'),
      value: customer?.purchaseType,
      category: "customer",
      options: ["Local", "Global"],
      clearable: true
    },
    {
      id: 6,
      name: "Purchase Mode",
      fieldType: "selectField",
      onChange: (event) => handleChange(event, 'purchaseMode'),
      value: customer?.purchaseMode,
      category: "customer",
      options: ["Credit", "Cash", "Consignment"],
      clearable: true
    },
    {
      id: 7,
      name: "Credit Limit",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'creditLimit'),
      value: customer?.creditLimit,
      category: "customer"
    },
    {
      id: 8,
      name: "Credit Balance",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'creditBalance'),
      value: customer?.creditBalance,
      category: "customer"
    },
    {
      id: 9,
      name: "Credit days",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'creditDays'),
      value: customer?.creditDays,
      category: "customer"
    },
    {
      id: 10,
      name: "GST Type",
      fieldType: "selectField",
      onChange: (event) => handleChange(event, 'gstType'),
      value: customer?.gstType,
      category: "customer",
      options: ["Regular", "Composite", "Un Registered"],
      clearable: true
    },
    {
      id: 11,
      name: "Status",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'status'),
      value: customer?.status,
      category: "customer"
    },
    {
      id: 12,
      name: "Check Print Name",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'checkPrintName'),
      value: customer?.checkPrintName,
      category: "customer"
    },
    {
      id: 13,
      name: "GSTN No",
      fieldType: "textField",
      type: 'text',
      onChange: (event) => handleChange(event, 'gstnNo'),
      value: customer?.gstnNo,
      category: "customer"
    },
    {
      id: 14,
      name: "Agents",
      fieldType: "selectField",
      onChange: (event) => handleChange(event, 'agents'),
      value: customer?.agents,
      category: "customer",
      options: ["Agent 1", "Agent 2"],
      clearable: true
    },
    {
      id: 15,
      name: "Approval required",
      fieldType: "checkBox",
      onChange: (event) => handleChange(event, 'approvalRequired'),
      checked: customer?.approvalRequired,
      category: "customer"
    },
    {
      id: 16,
      name: "Activate Loyalty",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleChange(event, 'location.activateLoyalty'),
      value: customer?.activateLoyalty,
      category: "customer"
    },
    {
      id: 17,
      name: "Address 1",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleNewAddressChange(event, 'address1'),
      value: newAddress.address1,
      category: "address"
    },
    {
      id: 18,
      name: "Address 2",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleNewAddressChange(event, 'address2'),
      value: newAddress.address2,
      category: "address"
    },
    {
      id: 19,
      name: "Country",
      fieldType: "textField",
      type: 'text',
      onChange: () => handleNewAddressChange({ target: { value: 'INDIA' } }, 'country'),
      value: newAddress.country,
      category: "address",
      disabled: true
    },
    {
      id: 20,
      name: "State",
      fieldType: "selectField",
      onChange: (event) => handleStateChange(event),
      value: newAddress.state,
      category: "address",
      options: Object.keys(states),
      clearable: false
    },
    {
      id: 21,
      name: "City",
      fieldType: "selectField",
      onChange: (event) => handleCityChange(event, 'city'),
      value: newAddress.city,
      category: "address",
      options: cities,
      clearable: false
    },
    {
      id: 22,
      name: "Pin Code",
      fieldType: "textField",
      type: 'number',
      disabled: false,
      onChange: (event) => handleNewAddressChange(event, 'pincode'),
      value: newAddress.pincode,
      category: "address",
      maxLength: 6,
    },
  ];

  const handleChange = (event, key) => {
    const { value, checked, type } = event.target;
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setCustomer((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomer(prev => ({
        ...prev,
        [key]: type === 'checkbox' ? checked : value,
        ...(key === 'gstnNo' && { approveStatus: value ? 'APPROVED' : 'DRAFT' }),
      }));
    }
  };

  const handleSave = async () => {
    try {
      const customerResponse = await B2B_API.post('customer/save', { json: customer }).json();
      if (customerResponse.response.id) {
        navigate('/crm/customer', { state: { ...stateData, tabs: stateData.childTabs } });
        notify({
          title: 'Success!',
          message: customerResponse?.message || 'Customer update Successful.',
          error: false,
          success: true,
        });
      } else {
        notify({
          title: 'Error!',
          message: customerResponse?.message || 'Customer update failed.',
          error: true,
          success: false,
        });
      }
    } catch (error) {
      console.error('An error occurred while saving:', error);
      notify({
        title: 'Error!',
        message: error?.message,
        error: true,
        success: false,
      });
    }
  };

  const handleStateChange = (event) => {
    const value = event.target.value;
    setNewAddress(prev => ({
      ...prev,
      state: value,
      city: ''
    }));
    setCities(states[value] || []);
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setNewAddress(prev => ({
      ...prev,
      city: value
    }));
  };


  const handleCancel = () => {
    navigate('/crm/customer', { state: { ...stateData, tabs: stateData.childTabs } });
  };

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  const handleNext = () => {
    const currentIndex = options.indexOf(activeTab);
    if (currentIndex < options.length - 1) {
      setActiveTab(options[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = options.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(options[currentIndex - 1]);
    }
  };

  const handleSetAddress = () => {
    setAddresses(prev => [...prev, newAddress]);
    setCustomer(prev => ({
      ...prev,
      location: [...(prev.location || []), newAddress],
    }));
    close();
    setNewAddress({ address1: '', address2: '', city: '', state: '', pincode: '', country: 'INDIA' });
  };

  const handleNewAddressChange = (event, key) => {
    const { value } = event.target;
    setNewAddress(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEdit = (addr) => {
    setNewAddress(addr);
    open();
  };

  const handleClear = (addr) => {
    setAddresses(prev => prev.filter(address => address !== addr));
    setCustomer(prev => ({
      ...prev,
      location: prev.location.filter(location => location !== addr),
    }));
  };

  console.log('cust : ', customer);
  console.log('cust-addr : ', addresses);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <B2BButton
          style={{ color: '#000' }}
          name="Back"
          onClick={handleCancel}
          leftSection={<IconArrowLeft size={15} />}
          color={"rgb(207, 239, 253)"}
        />
      </div>
      <Tabs value={activeTab} onTabChange={setActiveTab} color='2px solid #3c6d8e'>
        <Tabs.List>
          {options.map((item, index) => (
            <Tabs.Tab key={index} value={item} onClick={() => handleTabChange(item)}
              style={{
                color: activeTab === item ? '#3c6d8e' : '#3c6d8e',
                fontSize: '14px',
                fontWeight: activeTab === item ? 'bold' : 'normal',
              }}
            >
              {item}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value='Customer'>
          <div className='customer-container'>
            <div className='customer-details-header'>New Customer</div>
            <div className='customer-form-section'>
              {customerFields.filter(field => field.id <= 16).map(field => (
                <div key={field.id} className="customer-form-group">
                  <label className='customer-label'>{field.name}</label>
                  {field.fieldType === 'textField' && (
                    <B2BInput
                      value={field.value}
                      className='customer-input'
                      required
                      type={field.type}
                      placeholder={field.name}
                      onChange={field.onChange}
                      disabled={field.disabled}
                      maxLength={field.maxLength}
                    />
                  )}
                  {field.fieldType === 'selectField' && (
                    <B2BSelect
                      value={field.value || ''}
                      styles={{ input: { fontSize: '14px' } }}
                      data={field.options || []}
                      placeholder={field.name}
                      onChange={(value) => field.onChange({ target: { value } })}
                      clearable={field.clearable}
                    />
                  )}
                  {field.fieldType === 'checkBox' && (
                    <Checkbox
                      checked={field.checked}
                      onChange={field.onChange}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </Tabs.Panel>

        <Tabs.Panel value='Address'>
          <div className='address-container'>
            <div className='address-details-header'>Address</div>
            <div className='address-container-field'>
              <div className="add-address">
                <FontAwesomeIcon icon={faPlusCircle} className="address-icon" onClick={open} />
                <div className="address-label">Add Address</div>
              </div>
              <Modal opened={opened} onClose={close} title="Address Details" size="lg">
                <div className='address-form-section'>
                  {customerFields.filter(field => field.id > 16).map(field => (
                    <div key={field.id} className="address-form-group">
                      <label className='address-label'>{field.name}</label>
                      {field.fieldType === 'textField' && (
                        <B2BInput
                          value={field.value}
                          className='address-input'
                          required
                          type={field.type}
                          placeholder={field.name}
                          onChange={field.onChange}
                          disabled={field.disabled}
                          maxLength={field.maxLength}
                        />
                      )}
                      {field.fieldType === 'selectField' && (
                        <B2BSelect
                          value={field.value || ''}
                          styles={{ input: { fontSize: '14px' } }}
                          data={field.options || []}
                          placeholder={field.name}
                          onChange={(value) => field.onChange({ target: { value } })}
                          clearable={field.clearable}
                        />
                      )}
                    </div>
                  ))}
                  <B2BButton name={'Set Address'} onClick={handleSetAddress} />
                </div>
              </Modal>
              {addresses.length > 0 && addresses.map((addr, index) => (
                <div key={addr.id} className="location-card">
                  <div className="location-details">
                    <div className="address-header">Location - {index + 1}</div>
                    <div className="address-info">
                      <div className="address-line">
                        <span><p>Address 1</p><p>-</p></span>
                        <span>{addr.address1}</span>
                      </div>
                      <div className="address-line">
                        <span><p>Address 2</p><p>-</p></span>
                        <span>{addr.address2}</span>
                      </div>
                      <div className="address-line">
                        <span><p>Country</p><p>-</p></span>
                        <span>{addr.country}</span>
                      </div>
                      <div className="address-line">
                        <span><p>State</p><p>-</p></span>
                        <span>{addr.state}</span>
                      </div>
                      <div className="address-line">
                        <span><p>City</p><p>-</p></span>
                        <span>{addr.city}</span>
                      </div>
                      <div className="address-line">
                        <span><p>Pin Code</p><p>-</p></span>
                        <span>{addr.pincode}</span>
                      </div>
                    </div>
                    <div className='address-btn'>
                      {addr.id ? '' : <button className="addr-btn clear-button" onClick={() => { handleClear(addr) }}>Clear</button>}
                      <button className="addr-btn edit-button" onClick={() => { handleEdit(addr) }}>Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Tabs.Panel>
      </Tabs>
      <div className='custBtn'>
        <B2BButton type='button' onClick={handleBack} color='red' name="Back" />
        {
          activeTab === 'Address' ? "" : <B2BButton type='button' onClick={handleNext} color='blue' name="Next" />
        }
        {activeTab === 'Address' && (
          <B2BButton type='button' onClick={handleSave} color='green' name={customer?.id ? "Update" : "Save"} />
        )}
      </div>
    </div>
  );
}

export default CustomerCreate;


// import React, { useContext, useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import B2BButton from '../../common/B2BButton';
// import { IconArrowLeft } from '@tabler/icons-react';
// import { ActiveTabContext } from '../../layout/Layout';
// import B2BInput from '../../common/B2BInput';
// import B2BSelect from '../../common/B2BSelect';
// import './CustomerCreate.css';
// import { Checkbox, Modal, Tabs } from '@mantine/core';
// import { B2B_API } from '../../api/Interceptor';
// import states from '../crm/StatesAndDistricts.json';
// import _ from 'lodash';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
// import { useDisclosure } from '@mantine/hooks';

// const CustomerCreate = () => {
//   const { stateData } = useContext(ActiveTabContext);
//   const initialCustomerState = {
//     name: '',
//     email: '',
//     mobileNo: '',
//     currency: '',
//     purchaseType: '',
//     purchaseMode: '',
//     creditLimit: '',
//     creditBalance: '',
//     creditDays: '',
//     gstType: '',
//     status: '',
//     checkPrintName: '',
//     gstnNo: '',
//     agents: '',
//     approveStatus: '',
//     approvalRequired: false,
//     activateLoyalty: '',
//     location: [
//       {
//         address1: '',
//         address2: '',
//         city: '',
//         state: '',
//         pincode: '',
//         country: 'INDIA',
//         isPrimary: true
//       }
//     ]
//   };
//   const [customer, setCustomer] = useState(initialCustomerState);
//   const [cities, setCities] = useState([]);
//   const options = ['Customer', 'Address'];
//   const [activeTab, setActiveTab] = useState(options[0]);
//   const [opened, { open, close }] = useDisclosure(false);
//   const [addresses, setAddresses] = useState([]);
//   // const [newAddress, setNewAddress] = useState({
//   //   address1: '',
//   //   address2: '',
//   //   city: '',
//   //   state: '',
//   //   pincode: '',
//   //   country: 'INDIA',
//   //   isPrimary: true
//   // });


//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const id = queryParams.get('id');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCustomerData = async () => {
//       if (!id) return;

//       try {
//         const [customerRes, locationRes] = await Promise.all([
//           B2B_API.get(`customer/${id}`).json(),
//           B2B_API.get(`locations/customer-location/${id}`).json(),
//         ]);

//         setCustomer(prev => ({
//           ...prev,
//           ...customerRes.response,
//           location: locationRes.response || initialCustomerState.location,
//         }));

//         setCities(states[locationRes.response.state] || []);
//       } catch (error) {
//         console.error('Error fetching customer data:', error);
//       }
//     };

//     fetchCustomerData();
//   }, [id]);


//   const customerFields = [
//     {
//       id: 1,
//       name: "Customer Name",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'name'),
//       value: customer?.name,
//       category: "customer"
//     },
//     {
//       id: 2,
//       name: "Email",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'email'),
//       value: customer?.email,
//       category: "customer"
//     },
//     {
//       id: 3,
//       name: "Mobile No.",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'mobileNo'),
//       value: customer?.mobileNo,
//       category: "customer"
//     },
//     {
//       id: 4,
//       name: "Currency",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'currency'),
//       value: customer?.currency,
//       category: "customer"
//     },
//     {
//       id: 5,
//       name: "Purchase Type",
//       fieldType: "selectField",
//       onChange: (event) => handleChange(event, 'purchaseType'),
//       value: customer?.purchaseType,
//       category: "customer",
//       options: ["Local", "Global"],
//       clearable: true
//     },
//     {
//       id: 6,
//       name: "Purchase Mode",
//       fieldType: "selectField",
//       onChange: (event) => handleChange(event, 'purchaseMode'),
//       value: customer?.purchaseMode,
//       category: "customer",
//       options: ["Credit", "Cash", "Consignment"],
//       clearable: true
//     },
//     {
//       id: 7,
//       name: "Credit Limit",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'creditLimit'),
//       value: customer?.creditLimit,
//       category: "customer"
//     },
//     {
//       id: 8,
//       name: "Credit Balance",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'creditBalance'),
//       value: customer?.creditBalance,
//       category: "customer"
//     },
//     {
//       id: 9,
//       name: "Credit days",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'creditDays'),
//       value: customer?.creditDays,
//       category: "customer"
//     },
//     {
//       id: 10,
//       name: "GST Type",
//       fieldType: "selectField",
//       onChange: (event) => handleChange(event, 'gstType'),
//       value: customer?.gstType,
//       category: "customer",
//       options: ["Regular", "Composite", "Un Registered"],
//       clearable: true
//     },
//     {
//       id: 11,
//       name: "Status",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'status'),
//       value: customer?.status,
//       category: "customer"
//     },
//     {
//       id: 12,
//       name: "Check Print Name",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'checkPrintName'),
//       value: customer?.checkPrintName,
//       category: "customer"
//     },
//     {
//       id: 13,
//       name: "GSTN No",
//       fieldType: "textField",
//       type: 'text',
//       onChange: (event) => handleChange(event, 'gstnNo'),
//       value: customer?.gstnNo,
//       category: "customer"
//     },
//     {
//       id: 14,
//       name: "Agents",
//       fieldType: "selectField",
//       onChange: (event) => handleChange(event, 'agents'),
//       value: customer?.agents,
//       category: "customer",
//       options: ["Agent 1", "Agent 2"],
//       clearable: true
//     },
//     {
//       id: 15,
//       name: "Approval required",
//       fieldType: "checkBox",
//       onChange: (event) => handleChange(event, 'approvalRequired'),
//       checked: customer?.approvalRequired,
//       category: "customer"
//     },
//     {
//       id: 16,
//       name: "Activate Loyalty",
//       fieldType: "textField",
//       type: 'text',
//       disabled: false,
//       onChange: (event) => handleChange(event, 'location.activateLoyalty'),
//       value: customer?.activateLoyalty,
//       category: "customer"
//     },
//     {
//       id: 17,
//       name: "Address 1",
//       fieldType: "textField",
//       type: 'text',
//       disabled: false,
//       onChange: (event) => handleNewAddressChange(event, 'address1'),
//       value: newAddress.address1,
//       category: "address"
//     },
//     {
//       id: 18,
//       name: "Address 2",
//       fieldType: "textField",
//       type: 'text',
//       disabled: false,
//       onChange: (event) => handleNewAddressChange(event, 'address2'),
//       value: newAddress.address2,
//       category: "address"
//     },
//     {
//       id: 19,
//       name: "Country",
//       fieldType: "textField",
//       type: 'text',
//       onChange: () => handleNewAddressChange({ target: { value: 'INDIA' } }, 'country'),
//       value: newAddress.country,
//       category: "address",
//       disabled: true
//     },
//     {
//       id: 20,
//       name: "State",
//       fieldType: "selectField",
//       onChange: (event) => handleStateChange(event),
//       value: newAddress.state,
//       category: "address",
//       options: Object.keys(states),
//       clearable: false
//     },
//     {
//       id: 21,
//       name: "City",
//       fieldType: "selectField",
//       onChange: (event) => handleCityChange(event, 'city'),
//       value: newAddress.city,
//       category: "address",
//       options: cities,
//       clearable: false
//     },
//     {
//       id: 22,
//       name: "Pin Code",
//       fieldType: "textField",
//       type: 'number',
//       disabled: false,
//       onChange: (event) => handleNewAddressChange(event, 'pincode'),
//       value: newAddress.pincode,
//       category: "address",
//       maxLength: 6,
//     },
//   ];

//   const handleChange = (event, key) => {
//     const { value, checked, type } = event.target;
//     if (key.includes('.')) {
//       const [parent, child] = key.split('.');
//       setCustomer((prev) => ({
//         ...prev,
//         [parent]: {
//           ...prev[parent],
//           [child]: value
//         }
//       }));
//     } else {
//       setCustomer(prev => ({
//         ...prev,
//         [key]: type === 'checkbox' ? checked : value,
//         ...(key === 'gstnNo' && { approveStatus: value ? 'APPROVED' : 'DRAFT' }),
//       }));
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const customerResponse = await B2B_API.post('customer/save', { json: customer }).json();
//       if (customerResponse.response.id) {
//         navigate('/crm/customer', { state: { ...stateData, tabs: stateData.childTabs } });
//         notify({
//           title: 'Success!',
//           message: customerResponse?.message || 'Customer update Successful.',
//           error: false,
//           success: true,
//         });
//       } else {
//         notify({
//           title: 'Error!',
//           message: customerResponse?.message || 'Customer update failed.',
//           error: true,
//           success: false,
//         });
//       }
//     } catch (error) {
//       console.error('An error occurred while saving:', error);
//       notify({
//         title: 'Error!',
//         message: error?.message,
//         error: true,
//         success: false,
//       });
//     }
//   };

//   const handleStateChange = (event) => {
//     const value = event.target.value;
//     setNewAddress(prev => ({
//       ...prev,
//       state: value,
//       city: ''
//     }));
//     setCities(states[value] || []);
//   };

//   const handleCityChange = (event) => {
//     const value = event.target.value;
//     setNewAddress(prev => ({
//       ...prev,
//       city: value
//     }));
//   };


//   const handleCancel = () => {
//     navigate('/crm/customer', { state: { ...stateData, tabs: stateData.childTabs } });
//   };

//   const handleTabChange = (tabValue) => {
//     setActiveTab(tabValue);
//   };

//   const handleNext = () => {
//     const currentIndex = options.indexOf(activeTab);
//     if (currentIndex < options.length - 1) {
//       setActiveTab(options[currentIndex + 1]);
//     }
//   };

//   const handleBack = () => {
//     const currentIndex = options.indexOf(activeTab);
//     if (currentIndex > 0) {
//       setActiveTab(options[currentIndex - 1]);
//     }
//   };

//   const handleSetAddress = () => {
//     setAddresses(prev => [...prev, newAddress]);
//     setCustomer(prev => ({
//       ...prev,
//       location: [...prev.location, newAddress],
//     }));
//     close();
//     setNewAddress({ address1: '', address2: '', city: '', state: '', pincode: '', country: 'INDIA' });
//   };

//   const handleNewAddressChange = (event, key) => {
//     const { value } = event.target;
//     setNewAddress(prev => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const handleEdit = (addr) => {
//     setNewAddress(addr);
//     open();
//   };

//   const handleClear = (addr) => {
//     setAddresses(prev => prev.filter(address => address !== addr));
//     setCustomer(prev => ({
//       ...prev,
//       location: prev.location.filter(location => location !== addr),
//     }));
//   };

//   console.log('cust : ', customer);

//   return (
//     <div>
//       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//         <B2BButton
//           style={{ color: '#000' }}
//           name="Back"
//           onClick={handleCancel}
//           leftSection={<IconArrowLeft size={15} />}
//           color={"rgb(207, 239, 253)"}
//         />
//       </div>
//       <Tabs value={activeTab} onTabChange={setActiveTab}>
//         <Tabs.List>
//           {options.map((item, index) => (
//             <Tabs.Tab key={index} value={item} onClick={() => handleTabChange(item)}>
//               {item}
//             </Tabs.Tab>
//           ))}
//         </Tabs.List>

//         <Tabs.Panel value='Customer'>
//           <div className='customer-container'>
//             <div className='customer-details-header'>New Customer</div>
//             <div className='customer-form-section'>
//               {customerFields.filter(field => field.id <= 16).map(field => (
//                 <div key={field.id} className="customer-form-group">
//                   <label className='customer-label'>{field.name}</label>
//                   {field.fieldType === 'textField' && (
//                     <B2BInput
//                       value={field.value}
//                       className='customer-input'
//                       required
//                       type={field.type}
//                       placeholder={field.name}
//                       onChange={field.onChange}
//                       disabled={field.disabled}
//                       maxLength={field.maxLength}
//                     />
//                   )}
//                   {field.fieldType === 'selectField' && (
//                     <B2BSelect
//                       value={field.value || ''}
//                       styles={{ input: { fontSize: '14px' } }}
//                       data={field.options || []}
//                       placeholder={field.name}
//                       onChange={(value) => field.onChange({ target: { value } })}
//                       clearable={field.clearable}
//                     />
//                   )}
//                   {field.fieldType === 'checkBox' && (
//                     <Checkbox
//                       checked={field.checked}
//                       onChange={field.onChange}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Tabs.Panel>

//         <Tabs.Panel value='Address'>
//           <div className='address-container'>
//             <div className='address-details-header'>Address</div>
//             <div className='address-container-field'>
//               <div className="add-address">
//                 <FontAwesomeIcon icon={faPlusCircle} className="address-icon" onClick={open} />
//                 <div className="address-label">Add Address</div>
//               </div>
//               <Modal opened={opened} onClose={close} title="Address Details" size="lg">
//                 <div className='address-form-section'>
//                   {customerFields.filter(field => field.id > 16).map(field => (
//                     <div key={field.id} className="address-form-group">
//                       <label className='address-label'>{field.name}</label>
//                       {field.fieldType === 'textField' && (
//                         <B2BInput
//                           value={field.value}
//                           className='address-input'
//                           required
//                           type={field.type}
//                           placeholder={field.name}
//                           onChange={field.onChange}
//                           disabled={field.disabled}
//                           maxLength={field.maxLength}
//                         />
//                       )}
//                       {field.fieldType === 'selectField' && (
//                         <B2BSelect
//                           value={field.value || ''}
//                           styles={{ input: { fontSize: '14px' } }}
//                           data={field.options || []}
//                           placeholder={field.name}
//                           onChange={(value) => field.onChange({ target: { value } })}
//                           clearable={field.clearable}
//                         />
//                       )}
//                     </div>
//                   ))}
//                   <B2BButton name={'Set Address'} onClick={handleSetAddress} />
//                 </div>
//               </Modal>
//               {addresses.length > 0 && addresses.map((addr, index) => (
//                 <div key={addr.id} className="location-card">
//                   <div className="location-details">
//                     <div className="address-header">Location - {index + 1}</div>
//                     <div className="address-info">
//                       <div className="address-line">
//                         <span><p>Address 1</p><p>-</p></span>
//                         <span>{addr.address1}</span>
//                       </div>
//                       <div className="address-line">
//                         <span><p>Address 2</p><p>-</p></span>
//                         <span>{addr.address2}</span>
//                       </div>
//                       <div className="address-line">
//                         <span><p>Country</p><p>-</p></span>
//                         <span>{addr.country}</span>
//                       </div>
//                       <div className="address-line">
//                         <span><p>State</p><p>-</p></span>
//                         <span>{addr.state}</span>
//                       </div>
//                       <div className="address-line">
//                         <span><p>City</p><p>-</p></span>
//                         <span>{addr.city}</span>
//                       </div>
//                       <div className="address-line">
//                         <span><p>Pin Code</p><p>-</p></span>
//                         <span>{addr.pincode}</span>
//                       </div>
//                     </div>
//                     <div className='address-btn'>
//                       <button className="addr-btn clear-button" onClick={() => { handleClear(addr) }}>Clear</button>
//                       <button className="addr-btn edit-button" onClick={() => { handleEdit(addr) }}>Edit</button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </Tabs.Panel>
//       </Tabs>
//       <div className='custBtn'>
//         <B2BButton type='button' onClick={handleBack} color='red' name="Back" />
//         {
//           activeTab === 'Address' ? "" : <B2BButton type='button' onClick={handleNext} color='blue' name="Next" />
//         }
//         {activeTab === 'Address' && (
//           <B2BButton type='button' onClick={handleSave} color='green' name={customer?.id ? "Update" : "Save"} />
//         )}
//       </div>
//     </div>
//   );
// }

// export default CustomerCreate;
