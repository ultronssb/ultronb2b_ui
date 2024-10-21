import { IconArrowLeft } from '@tabler/icons-react';
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import B2BDateInput from '../../common/B2BDateInput';
import B2BInput from '../../common/B2BInput';
import B2BSelect from '../../common/B2BSelect';
import { ActiveTabContext } from '../../layout/Layout';
import './DiscountCreation.css';

const DiscountCreation = () => {
  const { stateData } = useContext(ActiveTabContext);

  // const initialDiscountState = {
  //   discountId: '',
  //   name: '',
  //   discountCode: '',
  //   startDate: '',
  //   endDate: '',
  //   minReuse: '',
  //   discountRules: {
  //     minValue: '',
  //     minQuantity: '',
  //     discount: '',
  //     percentage: '',
  //     free: '',
  //     buyCollections: {
  //       id: '',
  //     },
  //     getCollections: {
  //       id: '',
  //     }
  //   }
  // };


  const initialDiscountState = {
    discountId: '',
    channelName: '',
    discountName: '',
    discountType: '',
    discountCode: '',
    customerEligibility: '',
    customerSegment: '',
    startDate: '',
    endDate: '',
    minReuse: '',
    discountCombine: '',
    buyCollections: {
      buy: '',
      buyCollectionOrProduct: '',
      minValue: '',
      minQuantity: '',
    },
    getCollections: {
      get: '',
      getCollectionOrProduct: '',
      discount: '',
      percentage: '',
      free: '',
    },

  }

  const [discount, setDiscount] = useState(initialDiscountState);
  const navigate = useNavigate();

  const discountFields = [
    {
      id: 1,
      name: "Discount ID",
      fieldType: "textField",
      disabled: true,
      value: discount.discountId,
      onChange: (event) => handleChange(event, 'discountId'),
      category: "discount",
    },
    {
      id: 2,
      name: "Channel Name",
      fieldType: "textField",
      disabled: false,
      value: discount.channelName,
      onChange: (event) => handleChange(event, 'channelName'),
      category: "discount",
    },
    {
      id: 3,
      name: "Discount Name",
      fieldType: "textField",
      disabled: false,
      value: discount.discountName,
      onChange: (event) => handleChange(event, 'discountName'),
      category: "discount",
    },
    {
      id: 4,
      name: "Discount Type",
      fieldType: "select",
      options: ["Buy X Get Y", "Amount Off Product", "Amount Off Order", "Free Shipping"],
      disabled: false,
      value: discount.discountType,
      onChange: (event) => handleChange(event, 'discountType'),
      category: "discount",
    },
    {
      id: 5,
      name: "Discount Code",
      fieldType: "textField",
      disabled: false,
      value: discount.discountCode,
      onChange: (event) => handleChange(event, 'discountCode'),
      category: "discount",
    },
    {
      id: 6,
      name: "Customer Eligibility",
      fieldType: "select",
      options: ["All Customers", "Specific Customer Segment", "Specific Customer"],
      disabled: false,
      value: discount.customerEligibility,
      onChange: (event) => handleChange(event, 'customerEligibility'),
      category: "discount",
    },
    {
      id: 7,
      name: "Customer/Segment",
      fieldType: "select",
      options: [],
      disabled: false,
      value: discount.customerSegment,
      onChange: (event) => handleChange(event, 'customerSegment'),
      category: "discount",
    },
    {
      id: 8,
      name: "Start Date",
      fieldType: "date",
      disabled: false,
      value: discount.startDate,
      onChange: (event) => handleChange(event, 'startDate'),
      category: "discount",
    },
    {
      id: 9,
      name: "End Date",
      fieldType: "date",
      disabled: false,
      value: discount.endDate,
      onChange: (event) => handleChange(event, 'endDate'),
      category: "discount",
    },
    {
      id: 10,
      name: "Min times Reuse",
      fieldType: "textField",
      disabled: false,
      value: discount.minReuse,
      onChange: (event) => handleChange(event, 'minReuse'),
      category: "discount",
    },
    {
      id: 11,
      name: "This discount can combine with",
      fieldType: "select",
      options: ["Shipping Discount", "Order Discount", "Product Discount"],
      disabled: false,
      value: discount.discountCombine,
      onChange: (event) => handleChange(event, 'discountCombine'),
      category: "discount",
    },
    {
      id: 12,
      name: "Buy",
      fieldType: "select",
      options: ["Collection", "Specific Product"],
      disabled: false,
      value: discount.buyCollections.buy,
      onChange: (event) => handleChange(event, 'buyCollections.buy'),
      category: "buyRule",
    },
    {
      id: 13,
      name: "Product/Collection",
      fieldType: "select",
      options: [],
      disabled: false,
      value: discount.buyCollections.buyCollectionOrProduct,
      onChange: (event) => handleChange(event, 'buyCollections.buyCollectionOrProduct'),
      category: "buyRule",
    },
    {
      id: 14,
      name: "Min. Value",
      fieldType: "textField",
      disabled: false,
      value: discount.buyCollections.minValue,
      onChange: (event) => handleChange(event, 'buyCollections.minValue'),
      category: "buyRule",
    },
    {
      id: 15,
      name: "Min. Qty",
      fieldType: "textField",
      disabled: false,
      value: discount.buyCollections.minQuantity,
      onChange: (event) => handleChange(event, 'buyCollections.minQuantity'),
      category: "buyRule",
    },
    {
      id: 16,
      name: "Get",
      fieldType: "select",
      options: ["Collection", "Specific Product"],
      disabled: false,
      value: discount.getCollections.get,
      onChange: (event) => handleChange(event, 'getCollections.get'),
      category: "getRule",
    },
    {
      id: 17,
      name: "Product/Collection",
      fieldType: "select",
      options: [],
      disabled: false,
      value: discount.getCollections.getCollectionOrProduct,
      onChange: (event) => handleChange(event, 'getCollections.getCollectionOrProduct'),
      category: "getRule",
    },
    {
      id: 18,
      name: "Discount",
      fieldType: "textField",
      disabled: false,
      value: discount.getCollections.discount,
      onChange: (event) => handleChange(event, 'getCollections.discount'),
      category: "getRule",
    },
    {
      id: 19,
      name: "Percentage",
      fieldType: "textField",
      disabled: false,
      value: discount.getCollections.percentage,
      onChange: (event) => handleChange(event, 'getCollections.percentage'),
      category: "getRule",
    },
    {
      id: 20,
      name: "Free",
      fieldType: "textField",
      disabled: false,
      value: discount.getCollections.free,
      onChange: (event) => handleChange(event, 'getCollections.free'),
      category: "getRule",
    }
  ]

  const handleChange = (event, key) => {
    const { value } = event.target;
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setDiscount((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setDiscount(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const handleCancel = () => {
    navigate('/inventory/discounts', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  const handleSave = () => {

  }

  return (
    <div style={{ marginTop: '4rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <header>Create Discount</header>
        <B2BButton style={{ color: '#000' }} name="Back" onClick={() => handleCancel()} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />
      </div>
      <div>
        <div className='header'>Discount</div>
        <div className="discount-form">
          {discountFields.map((field) => (
            field.category === 'discount' && (
              <div key={field.id} className="discount-form-group">
                <label className='discount-label'>{field.name}</label>
                {field.fieldType === 'textField' && (
                  <B2BInput
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.name}
                    disabled={field.disabled}
                  />
                )}
                {field.fieldType === 'select' && (
                  <B2BSelect
                    value={field?.value || ''}
                    styles={{ input: { fontSize: '14px' } }}
                    data={field.options || []}
                    placeholder={field.name}
                    onChange={(value) => field.onChange({ target: { value } })}
                    labelName={field.name}
                  />
                )}
                {field.fieldType === 'date' && (
                  <B2BDateInput
                    key={field.id}
                    labelName={field.name}
                    value={field.value}
                    onChange={(event) => handleChange(event, field.key)}
                  />
                )}
              </div>
            )
          ))}
        </div>
        <div className='header'>Rule</div>
        <div className="rule-form">
          <div className="buyRule-form-group">
            {discountFields.map((rule) => (
              rule.category === 'buyRule' && (
                <div className='rule-input-form'>
                  <label className='rule-label'>{rule.name}</label>
                  {rule.fieldType === 'textField' && (
                    <B2BInput
                      value={rule.value}
                      onChange={rule.onChange}
                      placeholder={rule.name}
                      disabled={rule.disabled}
                    />
                  )}
                  {rule.fieldType === 'select' && (
                    <B2BSelect
                      value={rule?.value || ''}
                      styles={{ input: { fontSize: '14px' } }}
                      data={rule.options || []}
                      placeholder={rule.name}
                      onChange={(value) => rule.onChange({ target: { value } })}
                      labelName={rule.name}
                    />
                  )}
                </div>
              )
            ))}
          </div>
          <div className="getRule-form-group">
            {discountFields.map((rule) => (
              rule.category === 'getRule' && (
                <div className='rule-input-form'>
                  <label className='rule-label'>{rule.name}</label>
                  {rule.fieldType === 'textField' && (
                    <B2BInput
                      value={rule.value}
                      onChange={rule.onChange}
                      placeholder={rule.name}
                      disabled={rule.disabled}
                    />
                  )}
                  {rule.fieldType === 'select' && (
                    <B2BSelect
                      value={rule?.value || ''}
                      styles={{ input: { fontSize: '14px' } }}
                      data={rule.options || []}
                      placeholder={rule.name}
                      onChange={(value) => rule.onChange({ target: { value } })}
                      labelName={rule.name}
                    />
                  )}
                </div>
              )
            ))}
          </div>
        </div>
        <div className='btn-container'>
          <B2BButton className='discountBtn' onClick={handleSave} name='Save' color='rgb(26, 160, 70)' />
        </div>
      </div>
    </div>
  );
}

export default DiscountCreation;

