import React, { useContext } from 'react';
import { EnrichProductContext } from './EnrichProduct';
import B2BInput from '../../../common/B2BInput';

const EnrichmentTransaction = () => {

    const { handleChange, product } = useContext(EnrichProductContext);

    const json = [
        {
            label: "Stop GRN",
            type: 'radio',
            value: product.otherInformation.isStopGRN,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isStopGRN"),
            name: "isStopGRN",
        },
        {
            label: "Stop Purchase Return",
            type: 'radio',
            value: product.otherInformation.isStopPurchaseReturn,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isStopPurchaseReturn"),
            name: "isStopPurchaseReturn",
        },
        {
            label: "Stop Sale",
            type: 'radio',
            value: product.otherInformation.isStopSale,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isStopSale"),
            name: "isStopSale",
        },
        {
            label: "Allow Refund",
            type: 'radio',
            value: product.otherInformation.isAllowRefund,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isAllowRefund"),
            name: "isAllowRefund",
        },
        {
            label: "Allow Negative",
            type: 'radio',
            value: product.otherInformation.isAllowNegative,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isAllowNegative"),
            name: "isAllowNegative",
        },
        {
            label: "Allow Cost Edit",
            type: 'radio',
            value: product.otherInformation.isAllowCostEdit,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isAllowCostEdit"),
            name: "isAllowCostEdit",
        },
        {
            label: "Enable Serial Number",
            type: 'radio',
            value: product.otherInformation.isEnableSerialNumber,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isEnableSerialNumber"),
            name: "isEnableSerialNumber",
        },
        {
            label: "Non-trading",
            type: 'radio',
            value: product.otherInformation.isNonTrading,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "otherInformation.isNonTrading"),
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
