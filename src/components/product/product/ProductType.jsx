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
import _ from 'lodash';
import notify from '../../../utils/Notification';

const ProductType = () => {
    const { stateData } = useContext(ActiveTabContext);
    const [errorMessage, setErrorMessage] = useState('');
    const { product, handleChange, setProduct, setImageFile, imageFile, inputError } = useContext(ProductContext);
    const [brand, setBrand] = useState([]);
    const resetRef = useRef(null);
    const [productTags, setProductTags] = useState([]);
    const [taxonomy, setTaxonomy] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllBrand();
        fetchAllTags();
        getAllTaxonomy();
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
            ...prevProduct, image: ''
        }));
        if (resetRef.current) {
            resetRef.current();
        }
        setImageFile(null)
        setCurrentImage(null)
    };

    const fileChange = (file) => {
        const MAX_SIZE_BYTES = 3 * 1024 * 1024;

        if (file) {
            if (file.size > MAX_SIZE_BYTES) {
                setErrorMessage(`File size exceeds the 3MB limit for the Image!! `);
                if (file.size > MAX_SIZE_BYTES) {
                    setImageFile(null);
                    setProduct((prevProduct) => ({
                        ...prevProduct,
                        image: '',
                    }));
                }
            } else {
                setErrorMessage("")
                setImageFile(file);
                const reader = new FileReader()
                reader.onloadend = () => {
                    setProduct((prevProduct) => ({
                        ...prevProduct,
                        image: reader.result,
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            setErrorMessage('');
            setImageFile(null);
            setProduct((prevProduct) => ({
                ...prevProduct,
                image: '',
            }));
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
            placeholder: "Enter Product Name",
            error: inputError.articleNameErrorMessage,
        },
        {
            label: "Barcode",
            type: 'radio',
            value: product.isCreateBarcode,
            fieldType: 'radioField',
            require: true,
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            placeholder: "Enter Description",
            onChange: (event) => handleChange(event, "barcode"),
            name: "barcode",
            checked: product?.barcode,
            error: inputError?.barcodeErrorMessage
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
            require: true,
            className: "form-group",
            error: inputError.uomErrorMessage,
        },
        {
            label: "Brand",
            value: product?.brandId,
            onChange: (event) => handleChange(event, "brandId"),
            type: "select",
            fieldType: 'selectField',
            placeholder: "Enter Brand",
            data: brand ? brand.map(b => ({ label: b.name, value: b.brandId })) : [],
            clearable: true
        },
        {
            label: "Product Tag",
            type: "multiselect",
            fieldType: 'multiselectField',
            placeholder: "Enter Tag"
        },
        {
            label: "Description",
            value: product.description,
            onChange: (event) => handleChange(event, "description"),
            type: "textarea",
            fieldType: 'textAreaField',
            placeholder: "Enter Description",
            rows: 1,
            cols: 50,
            error: inputError.descErrorMessage
        },
        {
            label: "Taxonomy",
            value: product?.taxonomyNode?.id,
            data: taxonomy ? taxonomy.map(b => ({ label: b.name, value: b.id })) : [],
            onChange: (event) => handleChange(_.find(taxonomy, tax => tax.id === event), "taxonomyNode"),
            type: "Select",
            fieldType: 'selectField',
            placeholder: "Enter Taxonomy",
            clearable: true
        },
        {
            label: "Status",
            type: 'radio',
            value: product?.status,
            fieldType: 'radioField',
            options: [
                { label: "ACTIVE", value: "true" },
                { label: "INACTIVE", value: "false" }
            ],
            onChange: (event) => handleChange(event, "status"),
            name: "status",
            checked: product?.status
        },
    ];

    const handleCancel = () => {
        navigate('/product/product/articles', { state: { ...stateData, tabs: stateData.childTabs } })
    }

    const handleSelectChange = (value) => {
        const group = _.find(groups, gr => gr.name === value);
        setCategoryTree(prevTree => [{ ...prevTree[0], productGroup: group }]);
    };

    const getAllTaxonomy = async () => {
        const res = await B2B_API.get("taxonomy").json();
        setTaxonomy(res.response);
    }

    return (
        <div className='productType-container' style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <B2BButton style={{ color: '#000' }} name="Back" onClick={() => handleCancel()} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />
            </div>
            <form className='form-container'>
                {json?.map((field, index) => (
                    <div key={index} className={field.className ? field.className : "form-group"}>
                        <label className='form-label'>{field.label}
                            {field.require && <span className="error-message"> *</span>}
                        </label>
                        {
                            field.fieldType === 'textField' && (
                                <B2BInput
                                    value={field.value}
                                    className='form-input'
                                    style={field.style}
                                    disabled={field.disabled}
                                    onChange={field.onChange}
                                    type={field.type}
                                    placeholder={field.placeholder}
                                    error={field.error}
                                />
                            )
                        }
                        {
                            field.fieldType === "selectField" && (
                                <B2BSelect
                                    data={field.data}
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder={field.placeholder}
                                    clearable={field.clearable}
                                    error={field.error}
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
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <textarea
                                        value={field.value}
                                        className='form-input-textarea'
                                        disabled={field.disabled}
                                        onChange={field.onChange}
                                        placeholder={field.placeholder}
                                    />
                                    {field.error && (
                                        <div className="error-message">{field.error}</div>
                                    )}
                                </div>
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
                                            checked={
                                                product?.otherInformation.unitOfMeasures?.[option.value] || false
                                            }
                                        />
                                        <label className='checkbox-label'>{option.label}</label>
                                    </div>
                                ))}
                                {field?.error && (
                                    <span className='error-message'>
                                        {field?.error}
                                    </span>
                                )}
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
                                            onChange={field?.onChange}
                                            checked={field.checked === option?.value || field.checked === option?.label}
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
                <div className='form-group' style={{ display: 'flex', flexDirection: 'column' }}>
                    <Group justify="flex-start">
                        <FileButton resetRef={null} onChange={fileChange} accept="image/png,image/jpeg">
                            {(props) => <Button {...props}>{product.id ? "Update Image " : "Add Image"}</Button>}
                        </FileButton>
                        <Button disabled={!imageFile} color="red" onClick={clearFile}>
                            Reset
                        </Button>
                    </Group>

                    {/* Image Display Section */}
                    <div style={{ textAlign: 'center', marginBottom: '1rem', border: '1px solid #ccc', padding: '10px', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                        {imageFile ? (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="Uploaded"
                                style={{ maxWidth: '100%', maxHeight: '100%' }}
                            />
                        ) : (
                            <p style={{ color: '#888' }}>No image uploaded</p>
                        )}
                    </div>
                    {errorMessage && notify({
                        title: 'Error!!',
                        message: errorMessage || 'Failed to add Image.',
                        error: true,
                        success: false,
                    })}
                </div>
            </form>
        </div>
    );
};

export default ProductType;
