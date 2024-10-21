import React, { useContext, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faCheck, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import './ProductVariant.css';
import _ from 'lodash';
import B2BSelect from '../../../common/B2BSelect';
import { Button, Group, MultiSelect, Text } from '@mantine/core';
import { B2B_API } from '../../../api/Interceptor';
import { ProductContext } from './CreateProduct';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload } from '@tabler/icons-react';
import { BASE_URL } from '../../../api/EndPoints';


const ProductVariant = () => {
    const { product, setProduct, handleChange, inputError, setInputError } = useContext(ProductContext);
    const [attributes, setAttributes] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [] }]);
    const [combinations, setCombinations] = useState([]);
    const [variants, setVariants] = useState([]);
    const [activeTab, setActiveTab] = useState('Transaction');
    const [expandedRows, setExpandedRows] = useState([]);
    const [productVariantMap, setProductVariantMap] = useState(new Map())
    const isRowExpanded = (index) => expandedRows.includes(index);
    const openRef = useRef(null);
    const [productVariants, setProductVariants] = useState([]);

    useEffect(() => {
        fetchVariant();
    }, []);
    useEffect(() => {
        generateProductVariantMap()
    }, [product?.productVariants])

    useEffect(() => {
        updateCombinations(selectedPairs);
    }, [variants, selectedPairs]);


    const generateCombinations = (lists, variants = []) => {
        const result = [];
        const generateCombinationsRecursive = (depth, current) => {
            if (depth === lists.length) {
                result.push([...current]);
                return;
            }
            for (const element of lists[depth]) {
                current.push(element);
                generateCombinationsRecursive(depth + 1, current);
                current.pop();
            }
        };
        generateCombinationsRecursive(0, []);
        return result;
    };

    const generateProductVariantMap = () => {
        if (product.productVariants && _.size(product.productVariants) > 0 && _.size(product.productVariants[0].variants) > 0) {
            const productMap = new Map();
            _.map(product.productVariants, pv => {
                const variantIds = _.map(pv.variants, va => va.id);
                // Sort the variant IDs to ensure a consistent key
                const sortedVariantIds = _.sortBy(variantIds);
                productMap.set(JSON.stringify(sortedVariantIds), pv); // Use sorted keys
            });
            setProductVariantMap(productMap);
        }
    };

    const findMatchingVariant = (combination) => {
        for (let i = 0; i < combination.length; i++) {
            const partialCombination = _.slice(combination, 0, i + 1);
            const flattenedCombination = _.flatten(partialCombination);
            const sortedFlattenedCombination = _.sortBy(flattenedCombination);
            const key = JSON.stringify(sortedFlattenedCombination);
            if (productVariantMap.has(key)) {
                return productVariantMap.get(key);
            }
        }
        return null;
    };

    const updateCombinations = async (pairs) => {
        const newCombinations = generateCombinations(pairs.map(pair => pair.values), variants);
        const prodVariants = [];
        setCombinations(newCombinations);
        _.forEach(newCombinations, combination => {
            let variant = findMatchingVariant(combination);
            if (variant === null || _.size(newCombinations) > _.size(product.productVariants)) {
                variant = {}
            }
            variant['variants'] = _.map(combination, c => _.find(variants, v => v.id === c));
            variant['status'] = variant.id ? variant.status : 'ACTIVE'
            prodVariants.push(variant);
        })
        setProduct(prev => ({
            ...prev,
            newProductVariants: prodVariants
        }));
        setProductVariants(prodVariants);
    };

    const fetchVariant = async () => {
        try {
            const response = await B2B_API.get('variant').json();
            const groupedVariants = _.groupBy(response.response, 'name');
            setAttributes(groupedVariants);
            setVariants(response.response);
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
                values: Array.from(new Set(prodVariants[key]))
            }));
            setSelectedPairs(pairs);
        }
    };

    const handleSelectChange = (index, selectedValue) => {
        const newPairs = [...selectedPairs];
        const oldKey = newPairs[index].key;
        newPairs[index].key = selectedValue || '';
        if (!selectedValue) {
            newPairs[index].values = [];
        }
        setSelectedPairs(newPairs);
        const updatedProdVariants = { ...product.prodVariants };
        if (oldKey && oldKey !== selectedValue) {
            delete updatedProdVariants[oldKey];
        }
        if (selectedValue) {
            updatedProdVariants[selectedValue] = newPairs[index].values || [];
        }
        setProduct(prevState => ({ ...prevState, prodVariants: updatedProdVariants }));
        updateCombinations(newPairs);
    };

    const handleMultiSelectChange = (index, selectedValues) => {
        const newPairs = [...selectedPairs];
        newPairs[index].values = selectedValues;
        const updatedProdVariants = { ...product.prodVariants };
        updatedProdVariants[newPairs[index].key] = selectedValues;
        setSelectedPairs(newPairs);
        setProduct(prev => ({ ...prev, prodVariants: updatedProdVariants }));
        updateCombinations(newPairs);
    };

    const addNewPair = () => {
        const newPairs = [...selectedPairs, { key: '', values: [] }];
        setSelectedPairs(newPairs);
        const newCombinations = [{ ...selectedPairs[0], values: [] }, ...combinations];
        setCombinations(newCombinations);
        updateCombinations(newPairs);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        const removedPairKey = newPairs[index].key;
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
        const updatedProdVariants = { ...product.prodVariants };
        delete updatedProdVariants[removedPairKey];
        setProduct(prev => ({ ...prev, prodVariants: updatedProdVariants }));
        updateCombinations(newPairs);
    };

    const getAvailableKeys = (currentIndex) => {
        const selectedKeys = selectedPairs.map(pair => pair.key);
        return Object.keys(attributes).filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
    };


    const handleToggle = (index) => {
        if (expandedRows.includes(index)) {
            setExpandedRows(expandedRows.filter((i) => i !== index));
        } else {
            setExpandedRows([...expandedRows, index]);
        }
    };

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
    };

    const json = [
        {
            label: "Stop GRN",
            type: 'radio',
            value: String(product?.otherInformation?.isStopGRN),
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
            value: String(product?.otherInformation?.isStopPurchaseReturn),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isStopPurchaseReturn"),
            name: "isStopPurchaseReturn",
        },
        {
            label: "Stop Sale",
            type: 'radio',
            value: String(product?.otherInformation?.isStopSale),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isStopSale"),
            name: "isStopSale",
        },
        {
            label: "Allow Refund",
            type: 'radio',
            value: String(product?.otherInformation?.isAllowRefund),
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
            value: String(product?.otherInformation?.isAllowNegative),
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
            value: String(product?.otherInformation?.isAllowCostEditInGRN),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isAllowCostEditInGRN"),
            name: "isAllowCostEditInGRN",
        },
        {
            label: "Enable Serial Number",
            type: 'radio',
            value: String(product?.otherInformation?.isEnableSerialNumber),
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
            value: String(product?.otherInformation?.isNonTrading),
            fieldType: 'radioField',
            options: [
                { label: "Yes", value: "true" },
                { label: "No", value: "false" }
            ],
            onChange: (event) => handleChange(event, "isNonTrading"),
            name: "isNonTrading",
        },
    ];

    const handleEnable = (index) => {
        setProduct((prevProduct) => {
            return {
                ...prevProduct,
                newProductVariants: prevProduct.newProductVariants.map((variant, i) => {
                    if (i === index) {
                        return {
                            ...variant,
                            status: variant.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                        };
                    }
                    return variant;
                }),
            };
        });
    };

    console.log('p : ', product.newProductVariants);

    console.log(product,"prod");
    


    return (
        <section className="product-variant-section">
            <div className="product-variant-section-wrap">
                <div className="product-variant-g-row">
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
                                {_.size(attributes) > _.size(selectedPairs) && (
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                        <button type="button" className="product-variant-btn product-variant-btn--text-go" onClick={addNewPair}>
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
            <div className="product-info-variant-mb1">
                <h3 className="product-info-variant-text-sub-heading product-info-variant-mb1" role="heading" aria-level="3">This product has {_.size(combinations)} variant</h3>
            </div>
            <div data-cy="variants-table-content">
                <table data-testid="table" className="product-info-variant-table-list">
                    <thead>
                        <tr data-testid="table-row" className="product-info-variant-table-list-row product-info-variant-table-list-row--header">
                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell cn-variant-name-column" aria-sort="none">Variant name</th>
                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell" aria-sort="none">
                                <div>Variant SKU</div>
                            </th>
                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant input-columns" aria-sort="none">
                                <div>Retail Price</div>
                                <p className="product-info-variant-text-supplementary product-info-variant-util-text-overflow-break-word">Excluding tax</p>
                            </th>
                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-center enabled-column" aria-sort="none">Enabled</th>
                            {/* <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-table-list-cell--action product-info-variant-pr0" aria-sort="none"></th> */}
                        </tr>
                    </thead>
                    {
                        product?.newProductVariants?.map((item, index) => (
                            <tbody>
                                <tr key={index} data-testid="table-row" data-cy="variantSummary" className={`product-info-variant-table-list-row product-info-variant-table-list-row--expandable ${isRowExpanded(index) ? 'product-info-variant-table-list-row--expanded' : ''}`}>
                                    <td onClick={() => handleToggle(index)} data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--compact product-info-variant-pt2 product-info-variant-pl0 product-info-variant-flex product-info-variant-flex--align-center">
                                        <FontAwesomeIcon icon={faAngleRight} className={`i fa product-info-variant-icon product-info-variant-table-list-toggle-icon ${isRowExpanded(index) ? 'product-info-variant-table-list-toggle-icon--toggled' : ''}`} onClick={() => handleToggle(index)} />
                                        <div className="product-info-variant-id-badge product-info-variant-id-badge--small">
                                            {/* <div key={index} className="product-info-variant-id-badge__image" data-cy="badgeImage" data-testid="badgeImage">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt="Uploaded Badge" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                ) : item.image ? <img src={`${BASE_URL}${item.image}?${Date.now()}`} alt="Uploaded Badge" style={{ maxWidth: '100px', maxHeight: '100px' }} /> : null}
                                            </div> */}
                                            <div className="product-info-variant-id-badge__content">
                                                <div className="product-info-variant-id-badge__header-title" data-cy="badgeHeader" data-testid="badgeHeader">
                                                    <h5>
                                                        {item.variants?.map(variant => variant?.value).join(' / ')}
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--input input-columns sku">
                                        <div className="product-info-variant-util-pos-relative">
                                            <input className="product-info-variant-input variant-sku-input" type="text" data-cy="variant-sku-input" value={item?.variantSku} placeholder="Enter SKU" disabled style={{ cursor: 'not-allowed' }} />
                                        </div>
                                    </td>
                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--input input-columns">
                                        <div className="product-info-variant-util-pos-relative">
                                            <input className="product-info-variant-input product-info-variant-input--text-align-right" type="text" placeholder="Enter the amount" name="sellingPrice" data-cy="retail-price-excluding-tax-input" value={item.sellingPrice} style={{ paddingLeft: '4ch'}}/>
                                            <div className="product-info-variant-input-icon product-info-variant-input-icon--left product-info-variant-input-symbol" value={item.sellingPrice}>Rs</div>
                                        </div>
                                    </td>
                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--toggle product-info-variant-align-center product-info-variant-valign-t product-info-variant-pt4 product-info-variant-pr0 product-info-variant-pl0">
                                        <div className="product-info-variant-switch product-info-variant-switch--small">
                                            <input
                                                className="product-info-variant-switch-input"
                                                type="checkbox"
                                                checked={item?.status === "ACTIVE"}
                                                onChange={() => handleEnable(index)}
                                            />
                                            {/* {
                                                product.productVariants.map((item, index) => (
                                                    <input
                                                        className="product-info-variant-switch-input"
                                                        type="checkbox"
                                                        checked={item?.status === "ACTIVE"}
                                                        onChange={() => handleEnable(index)}
                                                    />
                                                ))
                                            } */}
                                            <div className="product-info-variant-switch-track">
                                                <FontAwesomeIcon icon={faCheck} className="i fa product-info-variant-switch-icon" />
                                                <FontAwesomeIcon icon={faTimes} className="i fa product-info-variant-cross-icon" />
                                                <div className="product-info-variant-switch-track-knob"></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                                {isRowExpanded(index) && (
                                    <tr data-testid="table-row" className="product-info-variant-table-list-row product-info-variant-table-list-row--expanded-content">
                                        <td colSpan="50" data-testid="table-body-cell" className="product-info-variant-table-list-cell">
                                            <div className="product-info-variant-table-list-expanded-container">
                                                <div className="product-info-variant-table-list-expanded-content">
                                                    <div className="product-info-variant-tabs product-info-variant-mb5" role="tablist">
                                                        {/* <div className="product-info-variant-tab" data-cy="ImageTab" data-tab-name="Image">
                                                            <button
                                                                className={`product-info-variant-tab-button ${activeTab === 'Image' ? 'active-tab' : ''}`}
                                                                type="button"
                                                                role="tab"
                                                                data-cy="tab-button-image"
                                                                data-testid="tab-button-image"
                                                                onClick={() => handleTabClick('Image')}
                                                            >
                                                                Image
                                                            </button>
                                                        </div> */}
                                                        <div className="product-info-variant-tab" data-tab-name="Transaction">
                                                            <button
                                                                className={`product-info-variant-tab-button ${activeTab === 'Transaction' ? 'active-tab' : ''}`}
                                                                type="button"
                                                                role="tab"
                                                                data-cy="tab-button-Transaction"
                                                                data-testid="tab-button-Transaction"
                                                                onClick={() => handleTabClick('Transaction')}
                                                            >
                                                                Transaction
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {activeTab === 'Image' && (
                                                        <div key={index}>
                                                            <div className="cn-variant-image-container">
                                                                <Dropzone
                                                                    onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index)}
                                                                    openRef={openRef}
                                                                >
                                                                    {!item.image && !item.imageUrl ? (
                                                                        <>
                                                                            <IconUpload size={50} />
                                                                            <Text size="md">Drag images here or click to select files</Text>
                                                                        </>
                                                                    ) : <Text size="md">Click and choose file to change image</Text>}

                                                                    {item.imageUrl ? (
                                                                        <img src={item.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 100 }} />
                                                                    ) : (
                                                                        item.image && (
                                                                            <img src={`${BASE_URL}${item.image}?${Date.now()}`} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 100 }} />
                                                                        )
                                                                    )}

                                                                    {item.file && (
                                                                        <Text size="sm" mt={10}>
                                                                            Selected file: {item.file.name}
                                                                        </Text>
                                                                    )}
                                                                </Dropzone>
                                                            </div>
                                                            <div data-testid="inline-action-bar" className="product-info-variant-action-bar product-info-variant-action-bar--inline react-variant-image-action-bar product-info-variant-pl5 product-info-variant-pr5">
                                                                <Group spacing="sm">
                                                                    <Button onClick={() => handleReset(index)} color="red">Reset</Button>
                                                                </Group>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {activeTab === 'Transaction' && (
                                                        <div key={index} className='form-container'>
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
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        ))}
                </table>
            </div>
        </section>

    );
};

export default ProductVariant;