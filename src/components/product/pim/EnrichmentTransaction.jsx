import React, { useContext } from 'react';
import { EnrichProductContext } from './EnrichProduct';
import B2BInput from '../../../common/B2BInput';

const EnrichmentTransaction = () => {

    const { handleChange, product ,pim} = useContext(EnrichProductContext);

    console.log(pim,"pim");
    
    const json = [
        {
            label: "Stop GRN",
            type: 'radio',
            value:String( pim?.pimOtherInformation?.isStopGRN),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isStopGRN"),
            name: "isStopGRN",
        },
        {
            label: "Stop Purchase Return",
            type: 'radio',
            value: String(pim?.pimOtherInformation?.isStopPurchaseReturn),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false"}
            ],
            onChange: (event) => handleChange(event, "isStopPurchaseReturn"),
            name: "isStopPurchaseReturn",
        },
        {
            label: "Stop Sale",
            type: 'radio',
            value:String(pim?.pimOtherInformation?.isStopSale),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true"},
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isStopSale"),
            name: "isStopSale",
        },
        {
            label: "Allow Refund",
            type: 'radio',
            value: String(pim?.pimOtherInformation?.isAllowRefund),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isAllowRefund"),
            name: "isAllowRefund",
        },
        {
            label: "Allow Negative",
            type: 'radio',
            value: String(pim?.pimOtherInformation?.isAllowNegative),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isAllowNegative"),
            name: "isAllowNegative",
        },
        {
            label: "Allow Cost Edit",
            type: 'radio',
            value: String(pim?.pimOtherInformation?.isAllowCostEditInGRN),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false"}
            ],
            onChange: (event) => handleChange(event, "isAllowCostEditInGRN"),
            name: "isAllowCostEditInGRN",
        },
        {
            label: "Enable Serial Number",
            type: 'radio',
            value: String(pim?.pimOtherInformation?.isEnableSerialNumber),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isEnableSerialNumber"),
            name: "isEnableSerialNumber",
        },
        {
            label: "Non-trading",
            type: 'radio',
            value: String(pim?.pimOtherInformation?.isNonTrading),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isNonTrading"),
            name: "isNonTrading",
        },
    ];

    console.log(product,"infoproduct");
    

    return (
        <div>
            <form className='form-container'>
                {json?.map((field, index) => (
                    <div key={index} className={field.className ? field.className : "form-group"}>
                        <label className='form-label'>{field.label}</label>
                        {field.fieldType === "radioField" && (
                            <div className="radio-group">
                                {field.options.map((option, idx) => (
                                    <div key={idx} className="radio-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input
                                            type="radio"
                                            value={option.value}
                                            name={field.name}
                                            onChange={field?.onChange}
                                            checked={field.value === option.value}
                                        />
                                        <label className='radio-label'>{option.label}</label>
                                    </div>
                                ))}
                                {field?.error && (
                                    <span className='error-message'>
                                        {field?.error}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </form>
        </div>
    );
};

export default EnrichmentTransaction;
