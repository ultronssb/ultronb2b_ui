import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, FileButton, Group, Text } from '@mantine/core';
import { B2B_API } from '../../../api/Interceptor';
import { ProductContext } from './CreateProduct';
import B2BSelect from '../../../common/B2BSelect';

const ProductType = () => {

    const { product, handleChange, setProduct, setImageFile, imageFile } = useContext(ProductContext);
    const [brand, setBrand] = useState([]);
    const resetRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);

    console.log(product);


    useEffect(() => {
        fetchAllBrand();
    }, []);

    const fetchAllBrand = async () => {
        try {
            const res = await B2B_API.get(`brand`).json();
            setBrand(res.response);
        } catch (err) {
            console.error("Failed to Fetch Brand");
        }
    };

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

    const fileChange = (file) => {

        if (file) {
            setImageFile(file)
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const json = [
        {
            label: "Product Code",
            value: product.articleCode,
            onChange: (event) => handleChange(event, "articleCode"),
            type: "text",
            require: true,
            placeholder: "Enter Article Code"
        },
        {
            label: "Product Name",
            value: product.articleName,
            onChange: (event) => handleChange(event, "articleName"),
            type: "text",
            require: true,
            placeholder: "Enter Product Name"
        },
        {
            label: "Description",
            value: product.description,
            onChange: (event) => handleChange(event, "description"),
            type: "textarea",
            placeholder: "Enter Description",
            rows: 1,
            cols: 50
        },
        {
            label: "Product Tag",
            value: product.productTag,
            onChange: (event) => handleChange(event, "productTag"),
            type: "text",
            placeholder: "Enter Tag"
        },
        {
            label: "UOM",
            value: {
                isKg: product?.otherInformation.unitOfMeasures?.isKg || false,
                isRoll: product?.otherInformation.unitOfMeasures?.isRoll || false
            },
            onChange: (values) => handleChange(values, "UOM"),
            type: "checkbox-group",
            options: [
                { label: "Kg", value: "isKg" },
                { label: "Roll", value: "isRoll" }
            ],
            name: 'UOM',
            placeholder: "Select UOM Type",
            required: true,
            className: "form-group",
        }
        ,
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
        <div className='grid-container'>
            <form className='form-container'>
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
                                            // checked={
                                            //     product?.otherInformation.unitOfMeasures?.find(uom => uom.type === field.name)?.[option.value] || false
                                            // } 
                                            onChange={field.onChange}
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
                <div>
                    {product.image && (
                        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Selected"
                                style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                            />
                            <Text size="sm" ta="center" mt="sm">{product.image}</Text>
                        </div>
                    )}
                    <Group justify="flex-start">
                        <FileButton resetRef={resetRef} onChange={(file) => fileChange(file)} accept="image/png,image/jpeg">
                            {(props) => <Button {...props}>Upload image</Button>}
                        </FileButton>
                        <Button disabled={!imageFile} color="red" onClick={clearFile}>
                            Reset
                        </Button>
                    </Group>
                    {imagePreview && (
                        <div>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ width: '300px', height: 'auto', marginTop: '10px' }}
                            />
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ProductType;
