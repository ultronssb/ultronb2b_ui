import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, FileButton, Group, MultiSelect } from '@mantine/core';
import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { createB2BAPI } from '../../../api/Interceptor';
import B2BInput from '../../../common/B2BInput';
import B2BModal from '../../../common/B2BModal';
import B2BSelect from '../../../common/B2BSelect';
import notify from '../../../utils/Notification';
import AddBrand from '../product_category/AddBrand';
import { ProductContext } from './CreateProduct';

const ProductType = () => {
    // const { stateData } = useContext(ActiveTabContext);
    const initialData = {
        name: "",
        status: "ACTIVE"
    }
    const { product, setProduct, handleChange, setImageFile, imageFile, inputError } = useContext(ProductContext);
    const [brand, setBrand] = useState([]);
    const [productTags, setProductTags] = useState([]);
    const [taxonomy, setTaxonomy] = useState([]);
    const [open, setOpen] = useState(false);
    const [modalContent, setModalContent] = useState(initialData);
    const [activeComponent, setActiveComponent] = useState('');
    const [contentUpdated, setContentUpdated] = useState(false)
    const [imageError, setImageError] = useState('');
    const B2B_API = createB2BAPI();
    const resetRef = useRef(null);

    useEffect(() => {
        fetchAllBrand();
        fetchAllTags();
        getAllTaxonomy();
    }, [contentUpdated]);

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
        if (resetRef.current) {
            resetRef.current();
        }
        setImageFile(null)
        // setCurrentImage(null)
    };

    const fileChange = (file) => {
        const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB

        if (file) {
            if (file.size > MAX_SIZE_BYTES) {
                setImageError('File size should be less than 3MB');
                setImageFile(null); // Clear the file if it exceeds the size limit
            } else {
                setImageError(''); // Clear any previous errors
                setImageFile(file); // Set the file if it meets the size requirement
                setProduct(prev => ({
                    ...prev,
                    image: URL.createObjectURL(file)
                }))
            }
        } else {
            setImageFile(null);
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
            value: product?.isCreateBarcode,
            fieldType: 'radioField',
            require: true,
            options: [
                { label: "Yes", value: true },
                { label: "No", value: false }
            ],
            onChange: (event) => handleChange(event, "isCreateBarcode"),
            name: "barcode",
            checked: product?.isCreateBarcode,
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
            label: "Taxonomy",
            value: product?.taxonomyNode?.id,
            data: taxonomy ? taxonomy.map(b => ({ label: b.name, value: b.id })) : [],
            onChange: (event) => handleChange(_.find(taxonomy, tax => tax.id === event), "taxonomyNode"),
            type: "Select",
            fieldType: 'selectField',
            placeholder: "Enter Taxonomy",
            clearable: true,
            require: true,
            error: inputError.taxonomyErrorMessage,
            masterCreation: true,
            masterNew: 'Create Taxonomy',
            name: 'Taxonomy'
        },
        {
            label: "Brand",
            value: product?.brandId,
            onChange: (event) => handleChange(event, "brandId"),
            type: "select",
            name: 'Brand',
            fieldType: 'selectField',
            placeholder: "Enter Brand",
            data: brand ? brand.map(b => ({ label: b.name, value: b.brandId })) : [],
            clearable: true,
            masterCreation: true,
            masterNew: 'Create Brand',
        },
        {
            label: "Product Tag",
            type: "multiselect",
            name: 'Product-Tag',
            fieldType: 'multiselectField',
            placeholder: "Enter Tag",
            masterCreation: true,
            masterNew: 'Create Product Tag',
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
            error: inputError.descErrorMessage,
        },
        {
            label: "Status",
            type: 'radio',
            value: product?.status,
            fieldType: 'radioField',
            options: [
                { label: "ACTIVE", value: "ACTIVE" },
                { label: "INACTIVE", value: "INACTIVE" }
            ],
            onChange: (event) => handleChange(event, "status"),
            name: "status",
            checked: product?.status
        },
    ];

    const handleSelectChange = (value) => {
        const group = _.find(groups, gr => gr.name === value);
        setCategoryTree(prevTree => [{ ...prevTree[0], productGroup: group }]);
    };

    const getAllTaxonomy = async () => {
        const res = await B2B_API.get("taxonomy").json();
        setTaxonomy(res.response);
    }

    const handleOpenModal = (key) => {
        setActiveComponent(key)
        setModalContent(prev => ({ ...prev, title: key }))
        setOpen(true);
    }

    const handleModalChange = (event, key) => {
        setModalContent((prev => ({ ...prev, [key]: event.target.value })))
    }

    const saveData = async (e, key) => {
        e.preventDefault();
        try {
            await B2B_API.post(`${key?.toLowerCase()}`, { json: modalContent }).json();
            setOpen(false);
            setContentUpdated(prev => !prev)
            setModalContent(initialData)
            notify({
                title: 'Success!',
                message: `${modalContent.title}` + ' added Successfully.',
                error: false,
                success: true,
            });
        } catch (e) {
            notify({
                error: true,
                success: false,
                title: e?.message
            });
        }
    }

    const handleClose = () => {
        setOpen(false)
    }

    const renderModalChild = () => {
        return <AddBrand onClose={handleClose} modalContent={modalContent} handleModalChange={handleModalChange} saveData={saveData} />
    }

    return (
        <div className='productType-container' style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem' }}>
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
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', cursor: 'pointer', fontSize: '1.25rem' }}>
                                    <B2BSelect
                                        data={field.data}
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder={field.placeholder}
                                        clearable={field.clearable}
                                        error={field.error}
                                        maxDropdownHeight={400}
                                    />
                                    {field.masterCreation && (<FontAwesomeIcon icon={faCirclePlus} title={field.masterNew} onClick={() => handleOpenModal(field.name)} />)}
                                </div>
                            )
                        }
                        {
                            field.fieldType === 'multiselectField' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', cursor: 'pointer', fontSize: '1.25rem' }}>
                                    <MultiSelect
                                        value={product?.tags || []}
                                        style={{ width: '250px' }}
                                        placeholder="Tags"
                                        withScrollArea={true}
                                        size='xs'
                                        data={productTags.map(tag => tag.name)}
                                        onChange={(selectedTags) => handleChange({ target: { value: selectedTags } }, "tags")}
                                    />
                                    {field.masterCreation && (<FontAwesomeIcon icon={faCirclePlus} title={field.masterNew} onClick={() => handleOpenModal(field.name)} />)}
                                </div>
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
                                            value={option?.value}
                                            name={field.name}
                                            onChange={field?.onChange}
                                            checked={field?.checked === option?.value}
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
                        {imageError && notify({
                            title: 'Error!!',
                            message: imageError || 'Failed to add Image.',
                            error: true,
                            success: false,
                        })}
                    </div>
                </div>
            </form>
            <B2BModal opened={open} size={'lg'} title={modalContent.title} close={() => {
                setModalContent(initialData);
                setOpen(false)
            }}
            >
                {renderModalChild()}
            </B2BModal>
        </div>
    );
};

export default ProductType;
