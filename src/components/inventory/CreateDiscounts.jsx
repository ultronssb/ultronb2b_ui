import React from 'react';
import B2BDateInput from '../../common/B2BDateInput';
import B2BInput from '../../common/B2BInput';
import B2BSelect from '../../common/B2BSelect';
import './CreateDiscounts.css';

const CreateDiscounts = () => {

  const discountFields = [
    { id: 1, name: 'Discount ID', type: 'textField', disabled: false, },
    { id: 2, name: 'Channel Name', type: 'textField', disabled: false, },
    { id: 3, name: 'Discount Name', type: 'textField', disabled: false, },
    { id: 4, name: 'Discount Type', type: 'select', data: ['Buy X Get Y', 'Amount Off Product', 'Amount Off Order', 'Free Shipping'], disabled: false, },
    { id: 5, name: 'Discount Code', type: 'textField', disabled: false, },
    { id: 6, name: 'Customer Eligibility', type: 'select', data: ['All Customers', 'Specific Customer Segment', 'Specific Customer'], disabled: false, },
    { id: 7, name: 'Customer/Segment', type: 'select', data: [], disabled: false, },
    { id: 8, name: 'Start Date', type: 'date', disabled: false, },
    { id: 9, name: 'End Date', type: 'date', disabled: false, },
    { id: 10, name: 'Min times Reuse', type: 'textField', disabled: false, },
    { id: 11, name: 'This discount can combine with', type: 'select', data: ['Shipping Discount', 'Order Discount', 'Product Discount'], disabled: false, },
  ];

  const buyRuleFields = [
    { id: 1, name: 'Buy', type: 'select', data: ['Collection', 'Specific Product'], disabled: false, },
    { id: 2, name: 'Product/Collection', type: 'select', data: [], disabled: false, },
    { id: 3, name: 'Min. Value', type: 'textField', disabled: false, },
    { id: 4, name: 'Min. Qty', type: 'textField', disabled: false, },
  ];

  const getRuleFields = [
    { id: 1, name: 'Get', type: 'select', data: ['Collection', 'Specific Product'], disabled: false, },
    { id: 2, name: 'Product/Collection', type: 'select', data: [], disabled: false, },
    { id: 3, name: 'Discount', type: 'textField', disabled: false, },
    { id: 4, name: 'Percentage', type: 'textField', disabled: false, },
    { id: 5, name: 'Free', type: 'textField', disabled: false, },
  ];

  return (
    <div>
      <div className='header'>Discount</div>
      <div className="discount-form">
        {discountFields.map((field) => (
          <div key={field.id} className="discount-form-group">
            <label className='discount-label'>{field.name}</label>
            {field.type === 'textField' && (
              <B2BInput placeholder={field.name} disabled={field.disabled} />
            )}
            {field.type === 'select' && (
              <B2BSelect key={field.id} labelName={field.name} data={field.data} placeholder={field.data ? field.data[0] : ''} />
            )}
            {field.type === 'date' && (
              <B2BDateInput key={field.id} labelName={field.name} />
            )}
          </div>
        ))}
      </div>
      <div className='header'>Rule</div>
      <div className="rule-form">
        <div className="buyRule-form-group">
          {
            buyRuleFields.map((rule) => (
              <div className='rule-input-form'>
                <label className='rule-label'>{rule.name}</label>
                {rule.type === 'textField' && (
                  <B2BInput placeholder={rule.name} disabled={rule.disabled} />
                )}
                {rule.type === 'select' && (
                  <B2BSelect key={rule.id} labelName={rule.name} data={rule.data} placeholder={rule.data ? rule.data[0] : ''} />
                )}
              </div>
            ))
          }
        </div>
        <div className="getRule-form-group">
          {
            getRuleFields.map((rule) => (
              <div className='rule-input-form'>
                <label className='rule-label'>{rule.name}</label>
                {rule.type === 'textField' && (
                  <B2BInput placeholder={rule.name} disabled={rule.disabled} />
                )}
                {rule.type === 'select' && (
                  <B2BSelect key={rule.id} labelName={rule.name} data={rule.data} placeholder={rule.data ? rule.data[0] : ''} />
                )}
              </div>
            ))
          }
        </div>
      </div>
      <div className='btn-container'>
        <button className='discountBtn'>Save</button>
      </div>
    </div>
  );
}

export default CreateDiscounts;


