import React, { useContext, useEffect, useRef, useState } from 'react'
import B2BInput from '../../../common/B2BInput';
import { MultiSelect, Select } from '@mantine/core';
import { B2B_API } from '../../../api/Interceptor';
import { ProductContext } from './CreateProduct';
import B2BSelect from '../../../common/B2BSelect';
import B2BButton from '../../../common/B2BButton';

const ProductType = () => {

    const { product: product, handleChange: handleChange } = useContext(ProductContext);

    const [products, setProducts] = useState();
    const [brand, setBrand] = useState([]);
    const formRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        fetchAllBrand();
    }, [])

    const fetchAllBrand = async () => {
        try {
            const res = await B2B_API.get(`brand`).json();
            setBrand(res.response);
        } catch (err) {
            console.error("Failed to Fetch Brand")
        }
    }

    const json = [
        {
            label: "Product Name",
            // value: product.aritcleName, thirundhave maatta da.... Spelling mistake 
            value: product.articleName,
            onChange: (event) => handleChange(event, "articleName"),
            type: "text",
            require: true,
            placeholder: "Enter Product Name"
        },
        {
            label: "Product Code",
            value: product.articleCode,
            onChange: (event) => handleChange(event, "articleCode"),
            type: "text",
            require: true,
            placeholder: "Enter Article Code"
        },
        {
            label: "Description",
            value: product.description,
            onChange: (event) => handleChange(event, "description"),
            type: "text",
            placeholder: "Enter Description"
        },
        {
            label: "Sales UOM",
            value: product?.otherInformation.unitOfMeasures.find(uom => uom.type === 'SALES')?.isKg || false,
            onChange: (event) => handleChange(event, "SALES"),
            "type": "checkbox-group",
            options: [
                { label: "Kg", value: "isKg" },
                { label: "Roll", value: "isRoll" }
            ],
            placeholder: "Select UOM Type",
            required: true,
            name: 'SALES',
            className: "form-group"
        },
        {
            label: "Purchase UOM",
            value: product?.otherInformation.unitOfMeasures.find(uom => uom.type === 'PURCHASE')?.isKg || false,
            onChange: (values) => handleChange(values, "PURCHASE"),
            "type": "checkbox-group",
            options: [
                { label: "Kg", value: "isKg" },
                { label: "Roll", value: "isRoll" }
            ],
            name: 'PURCHASE',
            placeholder: "Select UOM Type",
            required: true,
            className: "form-group",
        },
        {
            label: "Brand",
            value: brand.map(b => b?.name),
            onChange: (event) => handleChange(event, "brandId"),
            type: "select",
            required: true,
            placeholder: "Enter Brand"
        }
    ];


    return (
        <div className='grid-container' ref={containerRef}>
            <form ref={formRef} className='form-container'>
                {json.map((field, index) => (
                    <div key={index} className={field.className ? field.className : "form-group"}>
                        <label className='form-label'>{field.label}</label>
                        {field.type === "checkbox-group" ? (
                            <div className="checkbox-group">
                                {field.options.map((option, idx) => (
                                    <div key={idx} className="checkbox-item" style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type="checkbox"
                                            value={option.value}
                                            checked={
                                                product?.otherInformation.unitOfMeasures.find(uom => uom.type === field.name)?.[option.value] || false
                                            } onChange={field.onChange}
                                            required={field.required}
                                        />
                                        <label className='checkbox-label'>{option.label}</label>
                                    </div>
                                ))}
                            </div>
                        ) : field.type === "select" ? (
                            <B2BSelect
                                data={brand.map(b => ({ label: b.name, value: b.brandId }))}
                                value={product?.brandId}
                                onChange={field.onChange}
                                placeholder={"Select Brand Name"}
                                clearable={true}
                                maxDropdownHeight={400}
                            />
                        ) : (
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
                        )}

                    </div>
                ))}
            </form>
        </div>

    )
}

export default ProductType