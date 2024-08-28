import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, FileButton, Group, MultiSelect, Text } from '@mantine/core';
import { B2B_API } from '../../../api/Interceptor';
import { ProductContext } from './CreateProduct';
import B2BSelect from '../../../common/B2BSelect';
import B2BButton from '../../../common/B2BButton';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActiveTabContext } from '../../../layout/Layout';

const ProductDimension = () => {
    const { stateData } = useContext(ActiveTabContext);

    const { product, handleChange, setProduct, setImageFile, imageFile } = useContext(ProductContext);
    const resetRef = useRef(null);
    const navigate = useNavigate();

    const clearFile = () => {
        setProduct((prevProduct) => ({
            ...prevProduct,
        }));
        if (resetRef.current) {
            resetRef.current();
        }
        setImageFile(null)
        setImagePreview(null)
    };

    const json = [
        {
            label: "Length",
            type: "number",
            placeholder: "Enter Length",
            value: product.metrics?.length || '',
            onChange: (event) => handleChange(event, "metrics.length"),
        },
        {
            label: "Width",
            type: "number",
            placeholder: "Enter Width",
            value: product.metrics?.width || '',
            onChange: (event) => handleChange(event, "metrics.width"),
        },
        {
            label: "Thickness",
            type: "number",
            placeholder: "Enter Thickness",
            value: product.metrics?.thickness || '',
            onChange: (event) => handleChange(event, "metrics.thickness"),
        },
        {
            label: "Weight",
            type: "number",
            placeholder: "Weight in gsm",
            value: product.metrics?.weight || '',
            onChange: (event) => handleChange(event, "metrics.weight"),
        }
    ];
    console.log(product);
    
    return (
        <div className='productType-container' style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
            <form className='form-container'>
                {json.map((field, index) => (
                    <div key={index} className={field.className ? field.className : "form-group"}>
                        <label className='form-label'>{field.label}</label>
                        {
                            field.type === 'number' && (
                                <input
                                    value={field.value}
                                    className='form-input'
                                    style={field.style}
                                    disabled={field.disabled}
                                    onChange={field.onChange}
                                    type={field.type}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                />
                            )
                        }
                    </div>
                ))}
            </form>
        </div>
    );
};

export default ProductDimension;
