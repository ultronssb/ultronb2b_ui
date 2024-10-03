import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, Modal, Tabs } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconArrowLeft } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { B2B_API } from '../../api/Interceptor';
import B2BButton from '../../common/B2BButton';
import B2BInput from '../../common/B2BInput';
import B2BSelect from '../../common/B2BSelect';
import { ActiveTabContext } from '../../layout/Layout';
import notify from '../../utils/Notification';
import states from '../crm/StatesAndDistricts.json';
import './CustomerCreate.css';

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
    location:
    {
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'INDIA',
      isPrimary: true,
      custmoerId: ''
    }
  };

  const [customer, setCustomer] = useState(initialCustomerState);
  const [cities, setCities] = useState([]);
  const options = ['Customer', 'Address'];
  const [activeTab, setActiveTab] = useState(options[0]);
  const [opened, { open, close }] = useDisclosure(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([])
  const initialAddressState = {
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'INDIA',
    isPrimary: false,
    custmoerId: id
  }
  const [address, setAddress] = useState(initialAddressState);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;
      try {
        const customerRes = await B2B_API.get(`customer/${id}`).json();
        setCustomer(prev => ({
          ...prev,
          ...customerRes.response,
        }));
      } catch (error) {
        console.error('Error fetching customer data:', error);
      }
    };
    fetchCustomerData();
  }, [id]);

  useEffect(() => {
    fetchAddressData();
  }, []);

  const fetchAddressData = async () => {
    try {
      const locationRes = await B2B_API.get(`locations/customer/${id}`).json();
      setAddresses(locationRes.response);
      setCities(states[locationRes.response.state] || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    }
  };

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
      onChange: (event) => handleChange(event, 'activateLoyalty'),
      value: customer?.activateLoyalty,
      category: "customer"
    },
    {
      id: 17,
      name: "Address 1",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleChange(event, 'location.address1'),
      value: customer?.location?.address1,
      category: "address",
    },
    {
      id: 18,
      name: "Address 2",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleChange(event, 'location.address2'),
      value: customer?.location?.address2,
      category: "address",
    },
    {
      id: 19,
      name: "Country",
      fieldType: "textField",
      type: 'text',
      onChange: () => handleChange({ target: { value: 'INDIA' } }, 'location.country'),
      value: customer?.location?.country,
      category: "address",
      disabled: true,
    },
    {
      id: 20,
      name: "State",
      fieldType: "selectField",
      onChange: (event) => handleStateChange(event),
      value: customer?.location?.state,
      category: "address",
      options: Object.keys(states),
      clearable: false,
    },
    {
      id: 21,
      name: "City",
      fieldType: "selectField",
      onChange: (event) => handleCityChange(event),
      value: customer?.location?.city,
      category: "address",
      options: cities,
      clearable: false,
    },
    {
      id: 22,
      name: "Pin Code",
      fieldType: "textField",
      type: 'number',
      disabled: false,
      onChange: (event) => handleChange(event, 'location.pincode'),
      value: customer?.location?.pincode,
      category: "address",
      maxLength: 6,
    },
  ];

  const addressFields = [
    {
      id: 1,
      name: "Address 1",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleAddressChange(event, 'address1'),
      value: address.address1,
      category: "address",
    },
    {
      id: 2,
      name: "Address 2",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleAddressChange(event, 'address2'),
      value: address.address2,
      category: "address",
    },
    {
      id: 3,
      name: "Country",
      fieldType: "textField",
      type: 'text',
      onChange: () => handleAddressChange({ target: { value: 'INDIA' } }, 'country'),
      value: address?.country,
      category: "address",
      disabled: true,
    },
    {
      id: 4,
      name: "State",
      fieldType: "selectField",
      onChange: (event) => handleAddressStateChange(event),
      value: address?.state,
      category: "address",
      options: Object.keys(states),
      clearable: false,
    },
    {
      id: 5,
      name: "City",
      fieldType: "selectField",
      onChange: (event) => handleAddressCityChange(event),
      value: address?.city,
      category: "address",
      options: cities,
      clearable: false,
    },
    {
      id: 6,
      name: "Pin Code",
      fieldType: "textField",
      type: 'number',
      disabled: false,
      onChange: (event) => handleAddressChange(event, 'pincode'),
      value: address?.pincode,
      category: "address",
      maxLength: 6,
    },
  ]

  /* OnChange Functions for Customer Field */
  const handleChange = (event, key) => {
    const { value, checked, type } = event.target;
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setCustomer(prev => ({
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

  const handleStateChange = (event) => {
    const value = event.target.value;
    setCustomer(prev => ({
      ...prev,
      location: { ...prev.location, state: value, city: '' },
    }));
    setCities(states[value] || []);
  };

  const handleCityChange = (event) => {
    const value = event.target.value;
    setCustomer(prev => ({
      ...prev,
      location: { ...prev.location, city: value },
    }));
  };


  /* OnChange Functions for Address Field */
  const handleAddressChange = (event, key) => {
    const { value } = event.target;
    setAddress(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddressStateChange = (event) => {
    const value = event.target.value;
    setAddress(prev => ({
      ...prev,
      state: value,
      city: '',
    }));
    setCities(states[value] || []);
  };

  const handleAddressCityChange = (event) => {
    const value = event.target.value;
    setAddress(prev => ({
      ...prev,
      city: value,
    }));
  };

  /* Tab Functions */
  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
  };

  /* new customer save function */
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

  /* save address function */
  const handleSaveAddress = async () => {
    try {
      const addressResponse = await B2B_API.post('locations/save', { json: address }).json();
      if (addressResponse.message !== '') {
        notify({
          title: 'Success!',
          message: addressResponse.message || 'Address update successful.',
          error: false,
          success: true,
        });
        setAddress(initialAddressState);
        close();
        fetchAddressData()
      }
    } catch (error) {
      console.error('An error occurred while saving:', error);
      notify({
        title: 'Error!',
        message: error.message || 'An unexpected error occurred.',
        error: true,
        success: false,
      });
    }
  };

  const handleCancel = () => {
    navigate('/crm/customer', { state: { ...stateData, tabs: stateData.childTabs } });
  };

  /* Modal Popup button functions */
  const handleEdit = (addr) => {
    setAddress(addr);
    open();
    setCities(states[addr.state] || []);
  };

  const handleClose = () => {
    setAddress(initialAddressState);
    close();
  };

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
      {
        id && (
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
                  <Modal opened={opened} onClose={handleClose} title="Address Details" size="lg">
                    <div className='address-form-section'>
                      {addressFields.map(field => (
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
                      <B2BButton name={address.locationId ? 'Update Address' : 'Save Address'} onClick={handleSaveAddress} />
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
                          <button className="addr-btn edit-button" onClick={() => { handleEdit(addr) }}>Edit</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Tabs.Panel>
          </Tabs>
        )
      }
      {
        id && (
          <div className='custBtn'>
            {activeTab === 'Customer' && (<B2BButton type='button' onClick={handleSave} color='green' name={customer?.id ? "Update" : "Save"} />)}
          </div>
        )
      }
      {
        !id && (
          <div className='customer-container'>
            <div className='customer-details-header'>New Customer</div>
            <div className='customer-form-section'>
              {customerFields.map((field, index) => (
                field.category === 'customer' && (
                  <div className="customer-form-group">
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
                      />
                    )}
                    {field.fieldType === 'selectField' && (
                      <B2BSelect
                        value={field?.value || ''}
                        styles={{ input: { fontSize: '14px' } }}
                        data={field.options || []}
                        placeholder={field.name}
                        onChange={(value) => field.onChange({ target: { value } })}
                        clearable={field.clearable}
                      />
                    )}
                    {field.fieldType === 'checkBox' && (
                      <Checkbox
                        checked={customer.approvalRequired}
                        onChange={(event) => handleChange(event, 'approvalRequired')}
                      />
                    )}
                  </div>
                )
              ))}
            </div>
            <div className='address-details-header'>Address</div>
            <div className='address-form-section'>
              {customerFields.map((field, index) => (
                field.category === 'address' && (
                  <div key={index} className="customer-form-group">
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
                        value={field?.value || ''}
                        styles={{ input: { fontSize: '14px' } }}
                        data={field.options || []}
                        placeholder={field.name}
                        onChange={(value) => field.onChange({ target: { value } })}
                        clearable={field.clearable}
                      />
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        )
      }
      {
        !id && (
          <div className='custBtn'>
            <B2BButton type='button' onClick={() => handleCancel()} color='red' name="Cancel" />
            <B2BButton type='button' onClick={() => handleSave()} name={"Save"} />
          </div>
        )
      }
    </div>
  );
}

export default CustomerCreate;