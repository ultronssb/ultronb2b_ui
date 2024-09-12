import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, FileInput, Group, Image, MultiSelect } from '@mantine/core';
import _ from 'lodash';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';
import './ProductVariant.css';

const ProductVariant = () => {
    const { product, setProduct, handleChange, inputError, setInputError } = useContext(ProductContext);

    const [attributes, setAttributes] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [] }]);
    const [files, setFiles] = useState([]);
    const [variantImages, setVariantImages] = useState({});
    const inputRefs = useRef({});
    useEffect(() => {
        fetchVariant();
    }, []);

    const fetchVariant = async () => {
        try {
            const response = await B2B_API.get('variant').json();
            const groupedVariants = _.groupBy(response.response, 'name');
            setAttributes(groupedVariants);
            setSelectedPairsFromProduct();
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const setSelectedPairsFromProduct = () => {
        const { prodVariants } = product;
        const keys = Object.keys(prodVariants);
        if (_.size(keys) > 0) {
            const pairs = keys.map(key => ({
                key,
                values: prodVariants[key]
            }));
            setSelectedPairs(pairs);
        }
    };

    // const handleSelectChange = (index, selectedKey) => {
    //     const newPairs = [...selectedPairs];
    //     newPairs[index].key = selectedKey;
    //     newPairs[index].values = [];
    //     setSelectedPairs(newPairs);
    //     setInputError(prev => ({
    //         ...prev,
    //         variantError: false,
    //         variantErrorMessage: '',
    //     }));
    // };

    const handleSelectChange = (index, selectedValue) => {
        const newPairs = [...selectedPairs];
        const oldKey = newPairs[index].key;
        newPairs[index].key = selectedValue || '';
        if (!selectedValue) {
            newPairs[index].values = [];
        }

        setSelectedPairs(newPairs);

        setProduct(prevState => {
            const updatedProdVariants = { ...prevState.prodVariants };
            if (oldKey && oldKey !== selectedValue) {
                delete updatedProdVariants[oldKey];
            }


            if (selectedValue) {
                updatedProdVariants[selectedValue] = newPairs[index].values || 0;
            }

            return {
                ...prevState,
                prodVariants: updatedProdVariants
            };
        });
    };
    const handleMultiSelectChange = (index, selectedValues) => {
        const newPairs = [...selectedPairs];
        newPairs[index].values = selectedValues;
        setSelectedPairs(newPairs);

        const updatedVariants = { ...product.prodVariants };
        updatedVariants[newPairs[index].key] = selectedValues;
        setProduct(prev => ({ ...prev, prodVariants: updatedVariants }));
    };

    const addNewPair = () => {
        setSelectedPairs([...selectedPairs, { key: '', values: [] }]);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        const removedPairKey = newPairs[index].key;
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
        const updatedVariants = { ...product.prodVariants };
        delete updatedVariants[removedPairKey];

        setProduct(prev => ({ ...prev, prodVariants: updatedVariants }));
    };

    const getAvailableKeys = (currentIndex) => {
        const selectedKeys = selectedPairs.map(pair => pair.key);
        return Object.keys(attributes).filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
    };

    // const handleFileChange = (e) => {
    //     const selectedFiles = Array.from(e.target.files);
    //     setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    // };

    // const handleRemove = (fileToRemove) => {
    //     setFiles(files.filter((file) => file !== fileToRemove));
    // };
    // console.log(files, "files");
    const handleFileChange = (e, variantId, productId) => {
        const files = Array.from(e.target.files);

        setVariantImages((prevImages) => {
            const updatedImages = {
                ...prevImages,
                [variantId]: [...(prevImages[variantId] || []), ...files] // Add new files to existing files for this variant
            };

            // Update the productMedia in the response for the specific product and variant
            const updatedResponse = product?.productVariants.map(product => {
                if (product.id === productId) {
                    return {
                        ...product,
                        productMedia: [...updatedImages[variantId]]
                    };
                }
                return product;
            });

            console.log('Updated Response:', updatedResponse); // Log the updated response for debugging

            return updatedImages;
        });
    };

    // Handle removing images
    const handleRemove = (variantId, fileToRemove) => {
        setVariantImages((prevImages) => {
            const updatedFiles = prevImages[variantId].filter((file) => file !== fileToRemove);

            return {
                ...prevImages,
                [variantId]: updatedFiles
            };
        });
    };


    return (
        <section className="product-variant-section">
            <div className="product-variant-section-wrap">
                {/* <h2 className="product-variant-text-sub-heading">Variants</h2> */}
                <div className="product-variant-g-row">
                    {/* <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-3 product-variant-grid-settings-item">
                        Choose up to three variable attributes for this product to create and manage SKUs and their inventory levels.
                    </div> */}
                    <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-9">
                        <div>
                            <div className="product-variant-g-row">
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                    <label>
                                        <span className="product-variant-text-label">Variant Name (e.g. colour)</span>
                                        <span className="error-message"> *</span>
                                    </label>
                                </div>
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8">
                                    <label>
                                        <span className="product-variant-text-label">Value (e.g. Green)</span>
                                        <span className="error-message"> *</span>
                                    </label>
                                </div>
                            </div>
                            {selectedPairs.map((pair, index) => (
                                <div key={index} className="product-variant-g-row">
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                        <div className="product-variant-flex">
                                            <div className="product-variant-flex-grow-1 product-variant-mr2">
                                                <div className="product-variant-popover-tether-target-wrapper">
                                                    <div className="product-variant-autocomplete-input-container">
                                                        <B2BSelect
                                                            value={pair.key}
                                                            data={getAvailableKeys(index)}
                                                            clearable={true}
                                                            onChange={(e) => handleSelectChange(index, e)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8 product-variant-mb2">
                                        <div className="cn-attribute-values-row">
                                            <div className="cn-attribute-values">
                                                <div className="product-variant-lozenge-group">
                                                    <MultiSelect
                                                        style={{ width: '100%' }}
                                                        data={Array.isArray(attributes[pair.key])
                                                            ? attributes[pair.key].map(item => ({ value: item.id, label: item.value }))
                                                            : []}
                                                        onChange={(values) => handleMultiSelectChange(index, values)}
                                                        value={Array.isArray(pair.values) ? pair.values : []}
                                                        clearable={true}
                                                    />
                                                </div>
                                            </div>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    className="product-variant-btn product-variant-btn--icon-no product-variant-ml2"
                                                    onClick={() => removePair(index)}
                                                >
                                                    <FontAwesomeIcon className="fa product-variant-icon" icon={faTrash} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="product-variant-g-row">
                                {_.size(attributes) >= _.size(selectedPairs) && (
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                        <button
                                            type="button"
                                            className="product-variant-btn product-variant-btn--text-go"
                                            onClick={addNewPair}
                                        >
                                            <FontAwesomeIcon className="fa product-variant-icon product-variant-mr2" icon={faPlus} />
                                            Add another attribute
                                        </button>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            {/* <div>
                <input
                    type="file"
                    ref={inputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    multiple
                    onChange={(e)=>handleFileChange(e)}
                />

                <Button onClick={() => inputRef.current.click()}>Upload Images</Button>

                <Group mt="md">
                    {files.map((file, index) => (
                        <div key={index}>
                            <Image src={URL.createObjectURL(file)} alt={file.name} width={100} height={100} />
                            <p>{file.name}</p> 
                            <Button mt="sm" onClick={() => handleRemove(file)}>Remove</Button>
                        </div>
                    ))}
                </Group>
            </div> */}

            <div>
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Variant</th>
                            <th>Values</th>
                            <th>Images</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product?.productVariants.map(product =>
                            product.variants.map(variant => (
                                <tr key={variant.id}>
                                    <td>{variant.name}</td>
                                    <td>{variant.value}</td>
                                    <td>
                                        {variantImages[variant.id] && variantImages[variant.id].map((file, index) => (
                                            <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
                                                <img src={URL.createObjectURL(file)} alt={file.name} width={50} height={50} />
                                                <p>{file.name}</p>
                                                <button onClick={() => handleRemove(variant.id, file)}>Remove</button>
                                            </div>
                                        ))}
                                    </td>
                                    <td>
                                        <input
                                            type="file"
                                            ref={ref => inputRefs.current[variant.id] = ref}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            multiple
                                            onChange={(e) => handleFileChange(e, variant.id)}
                                        />
                                        <button onClick={() => inputRefs.current[variant.id].click()}>
                                            Upload Images
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default ProductVariant;


