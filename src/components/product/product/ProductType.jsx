import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, FileButton, Group, MultiSelect, Text } from '@mantine/core';
import { B2B_API } from '../../../api/Interceptor';
import { ProductContext } from './CreateProduct';
import B2BSelect from '../../../common/B2BSelect';
import B2BButton from '../../../common/B2BButton';
import { useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActiveTabContext } from '../../../layout/Layout';
import B2BInput from '../../../common/B2BInput';

const ProductType = () => {
    const { stateData } = useContext(ActiveTabContext);

    const { product, handleChange, setProduct, setImageFile, imageFile } = useContext(ProductContext);
    const [brand, setBrand] = useState([]);
    const resetRef = useRef(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [productTags, setProductTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([])
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllBrand();
        fetchAllTags();
    }, []);

    const fetchAllBrand = async () => {
        try {
            const res = await B2B_API.get(`brand`).json();
            setBrand(res.response);
        } catch (err) {
            console.error("Failed to Fetch Brand");
        }
    };

    const fetchAllTags = async () => {
        try {
            const res = await B2B_API.get(`product-tag`).json();
            setProductTags(res.response);
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
            label: "Product Name",
            value: product.articleName,
            onChange: (event) => handleChange(event, "articleName"),
            type: "text",
            fieldType: 'textField',
            require: true,
            placeholder: "Enter Product Name"
        },
        {
            label: "Brand",
            value: brand.map(b => b?.name),
            onChange: (event) => handleChange(event, "brandId"),
            type: "select",
            fieldType: 'selectField',
            required: true,
            placeholder: "Enter Brand"
        },
        {
            label: "Product Tag",
            type: "multiselect",
            fieldType: 'multiselectField',
            placeholder: "Enter Tag"
        },
        {
            label: "UOM",
            value: {
                isKg: product?.otherInformation.unitOfMeasures?.isKg || false,
                isRoll: product?.otherInformation.unitOfMeasures?.isRoll || false
            },
            onChange: (values) => handleChange(values, "UOM"),
            type: "checkbox",
            fieldType: 'checkBoxField',
            options: [
                { label: "Kg", value: "isKg" },
                { label: "Roll", value: "isRoll" }
            ],
            name: 'UOM',
            placeholder: "Select UOM Type",
            required: true,
            className: "form-group",
        },
        {
            label: "Description",
            value: product.description,
            onChange: (event) => handleChange(event, "description"),
            type: "textarea",
            fieldType: 'textAreaField',
            placeholder: "Enter Description",
            rows: 1,
            cols: 50
        },
        {
            label: "Barcode",
            type: 'radio',
            value: product.isCreateBarcode,
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            placeholder: "Enter Description",
            onChange: (event) => handleChange(event, "barcode"),
            name: "barcode"
        }


    ];

    const handleCancel = () => {
        navigate('/product/product/articles', { state: { ...stateData, tabs: stateData.childTabs } })
    }

    return (
        <div className='productType-container' style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <B2BButton style={{ color: '#000' }} name="Back" onClick={() => handleCancel()} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />
            </div>
            <form className='form-container'>
                {json?.map((field, index) => (
                    <div key={index} className={field.className ? field.className : "form-group"}>
                        <label className='form-label'>{field.label}</label>
                        {
                            field.fieldType === 'textField' && (
                                <B2BInput
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
                        {
                            field.fieldType === "selectField" && (
                                <B2BSelect
                                    data={brand.map(b => ({ label: b.name, value: b.brandId }))}
                                    value={product?.brandId}
                                    onChange={field.onChange}
                                    placeholder={"Select Brand Name"}
                                    clearable={true}
                                    maxDropdownHeight={400}
                                />
                            )
                        }
                        {
                            field.fieldType === 'multiselectField' && (
                                <MultiSelect
                                    value={product?.tags || []}
                                    style={{ width: '250px' }}
                                    placeholder="Tags"
                                    data={productTags.map(tag => tag.name)}
                                    onChange={(selectedTags) => handleChange({ target: { value: selectedTags } }, "tags")}
                                />
                            )
                        }
                        {
                            field.fieldType === 'textAreaField' && (
                                <textarea
                                    value={field.value}
                                    className='form-input-textarea'
                                    disabled={field.disabled}
                                    onChange={field.onChange}
                                    type={field.type}
                                    required={field.required}
                                    placeholder={field.placeholder}
                                />
                            )
                        }
                        {field.fieldType === "checkBoxField" && (
                            <div className="checkbox-group">
                                {field.options.map((option, idx) => (
                                    <div key={idx} className="checkbox-item" style={{ display: 'flex', gap: '1rem' }}>
                                        <input
                                            type={field.type}
                                            value={option.value}
                                            onChange={field.onChange}
                                            required={field.required}
                                        />
                                        <label className='checkbox-label'>{option.label}</label>
                                    </div>
                                ))}
                            </div>
                        )}
                        {field.fieldType === "radioField" && (
                            <div className="radio-group">
                                {field.options.map((option, idx) => (
                                    <div key={idx} className="radio-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <input
                                            type="radio"
                                            value={option.value}
                                            name={field.name}
                                            onChange={field.onChange}
                                            checked={product.barcode === option.value}
                                        />
                                        <label className='radio-label'>{option.label}</label>
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                ))}
                <div className='form-group' style={{ display: 'flex', flexDirection: 'column' }}>
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
