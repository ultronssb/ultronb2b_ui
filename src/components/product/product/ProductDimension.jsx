import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActiveTabContext } from '../../../layout/Layout';
import { ProductContext } from './CreateProduct';

const ProductDimension = () => {
    const { stateData } = useContext(ActiveTabContext);

    const { product, handleChange, setProduct, setImageFile, imageFile } = useContext(ProductContext);
    const resetRef = useRef(null);
    const navigate = useNavigate();


    const json = [
        {
            label:"Thickness",
            type: "number",
            placeholder: "In mm",
            value: product.metrics?.thickness || '',
            onChange: (event) => handleChange(event, "metrics.thickness"),
        },
        {
            label: "Width",
            type: "number",
            placeholder: "In Inches",
            value: product.metrics?.width || '',
            onChange: (event) => handleChange(event, "metrics.width"),
        },
        {
            label: "Weight",
            type: "number",
            placeholder: "In gsm",
            value: product.metrics?.weight || '',
            onChange: (event) => handleChange(event, "metrics.weight"),
        }
    ];

    return (
        <form className='form-container' style={{display:'flex', gap:'5rem',justifyContent:'center'}}>
            {json.map((field, index) => (
                <div key={index} style={{display:'flex',flexDirection:'column'}}>
                    <label style={{fontSize:'16px',fontWeight:'800'}}>{field.label}</label>
                    {
                        field.type === 'number' && (
                            <input
                                value={field.value}
                                className='form-input'
                                style={field.style}
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
    );
};

export default ProductDimension;
