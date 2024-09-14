import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActiveTabContext } from '../../layout/Layout';
import B2BInput from '../../common/B2BInput';
import B2BSelect from '../../common/B2BSelect';
import { B2B_API } from '../../api/Interceptor';
import './LoyaltyCreate.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleMinus, faCirclePlus } from '@fortawesome/free-solid-svg-icons';

const LoyaltyCreate = () => {
  const { stateData } = useContext(ActiveTabContext);

  const initialState = {
    name: '',
    basedOn: '',
    minRedeemPoints: '',
    redeemAmtPerPoint: '',
    effectiveForm: '',
    effectiveUntil: '',
    minRedemptionDays: '',
    pointsExpiryDays: '',
    rules: [{ fromAmount: '', toAmount: '', forEachRs: '', pointsEarned: '' }]
  };

  const [loyalty, setLoyalty] = useState(initialState);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLoyalty = async () => {
      if (!id) return;
      const res = await B2B_API.get(`loyalty/${id}`).json();
      setLoyalty(res.response || initialState);
    };
    fetchLoyalty();
  }, [id]);

  console.log("loyalty : ", loyalty);

  const handleChange = (event, key, groupIndex) => {
    const { value } = event.target;
    if (groupIndex !== undefined) {
      const updatedRules = [...loyalty.rules];
      updatedRules[groupIndex][key] = value;
      setLoyalty({ ...loyalty, rules: updatedRules });
    } else {
      setLoyalty({ ...loyalty, [key]: value });
    }
  };

  const addNewGroup = () => {
    setLoyalty({
      ...loyalty,
      rules: [...loyalty.rules, { fromAmount: '', toAmount: '', forEachRs: '', pointsEarned: '' }]
    });
  };

  const removeGroup = (index) => {
    if (loyalty.rules.length > 1) {
      const updatedRules = [...loyalty.rules];
      updatedRules.splice(index, 1);
      setLoyalty({ ...loyalty, rules: updatedRules });
    }
  };

  const handleCancel = () => {
    navigate('/crm/loyalty', { state: { ...stateData, tabs: stateData.childTabs } });
  };

  const loyaltyFields = [
    {
      "id": 1,
      "name": "Loyalty Name",
      "key": "name",
      "fieldType": "textField",
      "category": "loyalty",
    },
    {
      "id": 2,
      "name": "Based on",
      "key": "basedOn",
      "fieldType": "textField",
      "category": "loyalty",
    },
    {
      "id": 3,
      "name": "Min redeem Points",
      "key": "minRedeemPoints",
      "fieldType": "textField",
      "category": "loyalty",
    },
    {
      "id": 4,
      "name": "Redeem Amt. per Point",
      "key": "redeemAmtPerPoint",
      "fieldType": "textField",
      "category": "loyalty",
    },
    {
      "id": 5,
      "name": "Effective From",
      "key": "effectiveForm",
      "fieldType": "textField",
      "category": "loyalty",
    },
    {
      "id": 6,
      "name": "Effective Until",
      "key": "effectiveUntil",
      "fieldType": "textField",
      "category": "loyalty",
    },
    {
      "id": 7,
      "name": "Min Redemption Days",
      "key": "minRedemptionDays",
      "fieldType": "textField",
      "category": "loyalty",
    },
    {
      "id": 8,
      "name": "Points Expiry Days",
      "key": "pointsExpiryDays",
      "fieldType": "selectField",
      "options": [ "30", "60", "90", "180", "270", "360", "540" ],
      "category": "loyalty",
    },
    {
      "id": 9,
      "name": "From Amount",
      "key": "fromAmount",
      "fieldType": "textField",
      "category": "loyalty_rule",
    },
    {
      "id": 10,
      "name": "To Amount",
      "key": "toAmount",
      "fieldType": "textField",
      "category": "loyalty_rule",
    },
    {
      "id": 11,
      "name": "For Each Rs.",
      "key": "forEachRs",
      "fieldType": "textField",
      "category": "loyalty_rule",
    },
    {
      "id": 12,
      "name": "Points Earned",
      "key": "pointsEarned",
      "fieldType": "textField",
      "category": "loyalty_rule",
    }
  ]

  return (
    <div>
      <div className='backBtn'>
        <B2BButton
          style={{ color: '#000' }}
          name="Back"
          onClick={handleCancel}
          leftSection={<IconArrowLeft size={15} />}
          color={"rgb(207, 239, 253)"}
        />
      </div>
      <div className='loyalty-container'>
        <div className='loyalty-header'>Loyalty</div>
        <div className='loyalty-form-section'>
          {loyaltyFields.map(field => (
            field.category === 'loyalty' && (
              <div key={field.id} className="loyalty-form-group">
                <label className='loyalty-label'>{field.name}</label>
                {field.fieldType === 'textField' && (
                  <B2BInput
                    value={loyalty[field.key]}
                    className='loyalty-input'
                    required
                    type="text"
                    placeholder={field.name}
                    onChange={(e) => handleChange(e, field.key)}
                  />
                )}
                {field.fieldType === 'selectField' && (
                  <B2BSelect
                    value={loyalty[field.key]}
                    styles={{ input: { fontSize: '14px' } }}
                    data={field.options || []}
                    placeholder={field.name}
                    onChange={(value) => handleChange({ target: { value } }, field.key)}
                    clearable={true}
                  />
                )}
              </div>
            )
          ))}
        </div>
        <div className='loyalty-header'>Rule</div>
        <div className='loyalty-rule-form-section'>
          {loyalty.rules.map((group, groupIndex) => (
            <div key={groupIndex} className='loyalty-rule-group'>
              {loyaltyFields.map(field => (
                field.category === 'loyalty_rule' && (
                  <div key={field.id} className='loyalty-rule-input'>
                    <label className='loyalty-label'>{field.name}</label>
                    <B2BInput
                      value={group[field.key]}
                      className='loyalty-input'
                      required
                      type="text"
                      placeholder={field.name}
                      onChange={(e) => handleChange(e, field.key, groupIndex)}
                    />
                  </div>
                )))}
              <div className='addRemoveField'>
                <FontAwesomeIcon icon={faCircleMinus} onClick={() => removeGroup(groupIndex)} title='Remove'/>
              </div>
            </div>
          ))}
          <div className='addRemoveField'>
            <FontAwesomeIcon icon={faCirclePlus} onClick={addNewGroup} title='Add'/>
          </div>
        </div>
      </div>
      <div className='custBtn'>
        <B2BButton type='button' onClick={handleCancel} color='red' name="Cancel" />
        <B2BButton type='button' name={loyalty.id ? "Update" : "Save"} />
      </div>
    </div>
  );
};

export default LoyaltyCreate;
