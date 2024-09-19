import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActiveTabContext } from '../../layout/Layout';
import B2BInput from '../../common/B2BInput';
import B2BSelect from '../../common/B2BSelect';
import './CustomerCreate.css';
import { Checkbox } from '@mantine/core';
import { B2B_API } from '../../api/Interceptor';
import states from '../crm/StatesAndDistricts.json';

const CustomerCreate = () => {
  const { stateData } = useContext(ActiveTabContext);
  const initialState = {
    customer: {
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
    },
    location: {
      address1: '',
      address2: '',
      city: '',
      state: '',
      pincode: '',
      country: 'INDIA',
      activateLoyalty: '',
      isPrimary: true
    }

  };
  const [customer, setCustomer] = useState(initialState.customer);
  const [customerLocation, setCustomerLocation] = useState(initialState.location);
  const [cities, setCities] = React.useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!id) return;
      const customerRes = await B2B_API.get(`customer/${id}`).json();
      const customerData = customerRes.response;
      setCustomer(customerData);
      const locationRes = await B2B_API.get(`locations/customer-location/${id}`).json();
      const locationData = locationRes.response;
      setCustomerLocation(locationData || initialState.location);
      setCities(states[locationData.state] || []);
    };
    fetchCustomerData();
  }, [id]);


  const handleChange = (event, key) => {
    const { checked, type, value } = event.target;
    if (key === 'pincode' && value.length > 6) {
      return;
    }
    setCustomer(prev => {
      const newCustomer = {
        ...prev,
        [key]: type === 'checkbox' ? checked : event.target.value
      };
      if (key === 'gstnNo') {
        newCustomer.approveStatus = newCustomer.gstnNo ? 'APPROVED' : 'DRAFT';
      }
      return newCustomer;
    });
    setCustomerLocation(prev => ({
      ...prev,
      [key]: type === 'checkbox' ? checked : event.target.value
    }));
  };

  const handleStateChange = (event) => {
    const newState = event.target.value;
    setCustomerLocation(prevLocation => ({
      ...prevLocation,
      state: newState,
      city: ''
    }));
    setCities(states[newState] || []);
  };

  const handleCityChange = (event) => {
    const newCity = event.target.value;
    setCustomerLocation(prevLocation => ({
      ...prevLocation,
      city: newCity
    }));
  };

  const handleSave = async () => {
    try {
      const customerResponse = await B2B_API.post('customer/save', { json: customer }).json();
      if (customerResponse.response.id !== '') {
        const customerId = customer?.customerId;
        const locationData = { ...customerLocation, customerId };
        const locationResponse = await B2B_API.post('locations/save', { json: locationData }).json();

        if (locationResponse.message !== '') {
          navigate('/crm/customer', { state: { ...stateData, tabs: stateData.childTabs } });
        } else {
          notify({
            title: 'Error!!',
            message: customerResponse?.message || 'Customer updated successfully',
            error: false,
            success: true
          });
        }
      } else {
        notify({
          title: 'Error!!',
          message: locationResponse?.message,
          error: false,
          success: true
        });
      }
    } catch (error) {
      console.error('An error occurred while saving:', error);
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
      name: "Address 1",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleChange(event, 'address1'),
      value: customerLocation?.address1,
      category: "address"
    },
    {
      id: 16,
      name: "Address 2",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleChange(event, 'address2'),
      value: customerLocation?.address2,
      category: "address"
    },
    {
      id: 17,
      name: "Country",
      fieldType: "textField",
      type: 'text',
      onChange: () => handleChange({ target: { value: 'INDIA' } }, 'country'),
      value: "INDIA",
      category: "address",
      disabled: true
    },
    {
      id: 18,
      name: "State",
      fieldType: "selectField",
      disabled: false,
      onChange: (event) => handleStateChange(event, 'state'),
      value: customerLocation?.state,
      category: "address",
      options: Object.keys(states),
      clearable: false
    },
    {
      id: 19,
      name: "City",
      fieldType: "selectField",
      disabled: false,
      category: "address",
      onChange: (event) => handleCityChange(event, 'city'),
      value: customerLocation?.city,
      options: cities,
      clearable: false
    },
    {
      id: 20,
      name: "Pin Code",
      fieldType: "textField",
      type: 'number',
      disabled: false,
      onChange: (event) => handleChange(event, 'pincode'),
      value: customerLocation?.pincode,
      category: "address",
      maxLength: 6,
    },
    {
      id: 21,
      name: "Approval required",
      fieldType: "checkBox",
      onChange: (event) => handleChange(event, 'approvalRequired'),
      checked: customer?.approvalRequired,
      category: "address"
    },
    {
      id: 22,
      name: "Activate Loyalty",
      fieldType: "textField",
      type: 'text',
      disabled: false,
      onChange: (event) => handleChange(event, 'loyalty'),
      value: customerLocation?.loyalty,
      category: "address"
    }
  ];

  const handleCancel = () => {
    navigate('/crm/customer', { state: { ...stateData, tabs: stateData.childTabs } });
  };

  console.log('customer : ', customer);
  console.log('customerLocation : ', customerLocation);


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <B2BButton
          style={{ color: '#000' }}
          name="Back"
          onClick={() => handleCancel()}
          leftSection={<IconArrowLeft size={15} />}
          color={"rgb(207, 239, 253)"}
        />
      </div>
      <div className='customer-container'>
        <div className='customer-header'>New Customer</div>
        <div className='form-section'>
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
              </div>
            )
          ))}
        </div>
        <div className='customer-header'>Address</div>
        <div className='form-section'>
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
      </div>
      <div className='custBtn'>
        <B2BButton type='button' onClick={() => handleCancel()} color='red' name="Cancel" />
        <B2BButton type='button' onClick={() => handleSave()} name={customer?.id ? "Update" : "Save"} />
      </div>
    </div>
  );
}

export default CustomerCreate;
