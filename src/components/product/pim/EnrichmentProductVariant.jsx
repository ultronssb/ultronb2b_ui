import { faAngleRight, faCheck, faPlus, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useContext, useEffect, useState } from 'react'
import B2BSelect from '../../../common/B2BSelect'
import './EnrichmentProductVariant.css'
import { MultiSelect } from '@mantine/core'
import _ from 'lodash'
import { B2B_API } from '../../../api/Interceptor'
import { EnrichProductContext } from './EnrichProduct'
import B2BInput from '../../../common/B2BInput'

const EnrichmentProductVariant = () => {
    const { product, setProduct, pim, setPim } = useContext(EnrichProductContext);
    const [activeTab, setActiveTab] = useState('Price');
    const [expandedRows, setExpandedRows] = useState([]);
    const isRowExpanded = (index) => expandedRows.includes(index);
    const [attributes, setAttributes] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [] }]);
    const [isChecked, setIsChecked] = useState([]);
    const [variantValues, setVariantValues] = useState([]);
    const [productPims, setProductPims] = useState([]);

    useEffect(() => {
        if (pim?.pimVariants) {
            const variantMap = {};
            pim.pimVariants.forEach(variantItem => {
                variantItem.variants?.forEach(variant => {
                    if (!variantMap[variant.name]) {
                        variantMap[variant.name] = new Set();
                    }
                    variantMap[variant.name].add(variant.value);
                });
            });
            const formattedVariantValues = Object.entries(variantMap).reduce((acc, [key, value]) => {
                acc[key] = Array.from(value);
                return acc;
            }, {});
            setVariantValues(formattedVariantValues);
        }
    }, [pim]);

    useEffect(() => {
        fetchVariant();
        getAllPimVariants();
    }, []);

    console.log(pim, "pim");


    const fetchVariant = async () => {
        try {
            const response = await B2B_API.get('variant').json();
            const groupedVariants = _.groupBy(response.response, 'name');
            setAttributes(groupedVariants);
        } catch (error) {
            console.error('Error fetching variants:', error);
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

        // setProduct(prevState => {
        //     const updatedProdVariants = { ...prevState.prodVariants };
        //     if (oldKey && oldKey !== selectedValue) {
        //         delete updatedProdVariants[oldKey];
        //     }


        //     if (selectedValue) {
        //         updatedProdVariants[selectedValue] = newPairs[index].values || 0;
        //     }

        //     return {
        //         ...prevState,
        //         prodVariants: updatedProdVariants
        //     };
        // });
    };
    const handleMultiSelectChange = (index, selectedValues) => {
        const newPairs = [...selectedPairs];
        newPairs[index].values = selectedValues;
        setSelectedPairs(newPairs);

        const updatedVariants = { ...product.prodVariants };
        updatedVariants[newPairs[index].key] = selectedValues;
        // setProduct(prev => ({ ...prev, prodVariants: updatedVariants }));
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

        // setProduct(prev => ({ ...prev, prodVariants: updatedVariants }));
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

    const handleEnable = (index) => {
        setIsChecked((prevChecked) => {
            const newChecked = [...prevChecked];
            newChecked[index] = !newChecked[index]; // Toggle the checked state
            return newChecked;
        });
    };

    const getAllPimVariants = async () => {
        const res = await B2B_API.get(`pim/product/${pim?.pimId}`).json()
        const pims = res?.response?.pimVariants
        setProductPims(pims);
        console.log(pims, "pimsssss");
    }
    console.log(variantValues, "variantValues");

    const [allVariants, setAllVariants] = useState([]);
    useEffect(() => {
        const flattenedVariants = productPims.map((item) => item.variants).flat();
        setAllVariants(flattenedVariants);
    }, []);

    console.log("allVariants : ", allVariants);
    console.log("productPims : ", productPims);




    return (
        <div>
            <section className="helios-c-PJLV product-info-variant-section">
                <div className="helios-c-PJLV product-info-variant-section-wrap">
                    <h2 className="product-info-variant-text-sub-heading product-info-variant-mb4" role="heading" aria-level="2">Variants</h2>
                    <div className="product-info-variant-g-row">
                        <div className="product-info-variant-g-col product-info-variant-g-s-12 product-info-variant-g-m-3 product-info-variant-grid-settings-item" data-testid="sr-settings-about">Choose up to three variable attributes for this product to create and manage SKUs and their inventory levels.</div>
                        <div className="product-info-variant-g-col product-info-variant-g-s-12 product-info-variant-g-m-9" data-testid="sr-settings-content">
                            <div>
                                <div className="product-info-variant-g-row">
                                    <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-4">
                                        <label>
                                            <span className="product-info-variant-text-label">Variant Name (e.g. colour)</span>
                                        </label>
                                    </div>
                                    <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-8">
                                        <label>
                                            <span className="product-info-variant-text-label">Value (e.g. Green)</span>
                                        </label>
                                    </div>
                                </div>
                                {selectedPairs.map((pair, index) => (
                                    <div key={index} className="product-info-variant-g-row">
                                        <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-4">
                                            <div className="product-info-variant-flex">
                                                <div className="product-info-variant-flex-grow-1 product-info-variant-mr2">
                                                    <div className="product-info-variant-popover-tether-target-wrapper">
                                                        <div className="product-info-variant-autocomplete-input-container">
                                                            {
                                                                Object.keys(variantValues).map((key, index) => {
                                                                    return (
                                                                        <B2BInput
                                                                            key={index}
                                                                            value={key || ""}
                                                                            data={getAvailableKeys(index)}
                                                                            clearable={true}
                                                                            onChange={(e) => handleUniqueChange(index, e)}
                                                                        />
                                                                    );
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-8 product-info-variant-mb2">
                                            <div className="cn-attribute-values-row">
                                                <div className="cn-attribute-values">
                                                    <div className="product-info-variant-lozenge-group">
                                                        {
                                                            Object.keys(variantValues).map((key, index) => {
                                                                return (
                                                                    <B2BInput
                                                                        key={index}
                                                                        value={variantValues[key] || ""}
                                                                        data={getAvailableKeys(index)}
                                                                        clearable={true}
                                                                        onChange={(e) => handleUniqueChange(index, e)}
                                                                    />
                                                                );
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        className="product-info-variant-btn product-info-variant-btn--icon-no product-info-variant-ml2"
                                                        onClick={() => removePair(index)}
                                                    >
                                                        <FontAwesomeIcon className="fa product-info-variant-icon" icon={faTrash} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* <div className="product-info-variant-g-row">
                                    {_.size(attributes) > _.size(selectedPairs) && (
                                        <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-4">
                                            <button
                                                type="button"
                                                className="product-info-variant-btn product-info-variant-btn--text-go"
                                                onClick={addNewPair}
                                            >
                                                <FontAwesomeIcon className="fa product-info-variant-icon product-info-variant-mr2" icon={faPlus} />
                                                Add another attribute
                                            </button>
                                        </div>
                                    )}
                                </div> */}

                            </div>
                            <div className="product-info-variant-mb1">
                                <h3 className="product-info-variant-text-sub-heading product-info-variant-mb1" role="heading" aria-level="3">This product has 1 variant</h3>                            </div>
                            <div data-cy="variants-table-content">
                                <table data-testid="table" className="product-info-variant-table-list">
                                    <thead>
                                        <tr data-testid="table-row" className="product-info-variant-table-list-row product-info-variant-table-list-row--header">
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell cn-variant-name-column" aria-sort="none">Variant name</th>
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell" aria-sort="none">
                                                <div>SKU<br />code</div>
                                            </th>
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell input-columns supplier-code" aria-sort="none">
                                                <div>Supplier<br />code</div>
                                            </th>
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-right input-columns" aria-sort="none">
                                                <div>Supplier<br />price</div>
                                            </th>
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-right input-columns" aria-sort="none">
                                                <div>Retail<br />price</div>
                                                {/* <p className="product-info-variant-text-supplementary product-info-variant-util-text-overflow-break-word">Excluding tax</p> */}
                                            </th>
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-center enabled-column" aria-sort="none">Enabled</th>
                                            {/* <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-table-list-cell--action product-info-variant-pr0" aria-sort="none"></th> */}
                                        </tr>
                                    </thead>
                                    {
                                        productPims?.map((item, index) => (
                                            <tbody>
                                                <tr key={index} data-testid="table-row" data-cy="variantSummary" className={`product-info-variant-table-list-row product-info-variant-table-list-row--expandable ${isRowExpanded(index) ? 'expanded' : ''}`}>
                                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--compact product-info-variant-pt2 product-info-variant-pl0 product-info-variant-flex product-info-variant-flex--align-center">
                                                        <FontAwesomeIcon icon={faAngleRight} className={`i fa product-info-variant-icon product-info-variant-table-list-toggle-icon ${isRowExpanded(index) ? 'product-info-variant-table-list-toggle-icon--toggled' : ''}`} onClick={() => handleToggle(index)} />
                                                        <div className="product-info-variant-id-badge product-info-variant-id-badge--small">
                                                            <div className="product-info-variant-id-badge__image" data-cy="badgeImage" data-testid="badgeImage" style={{ backgroundImage: 'url(https://vendfrontendassets.freetls.fastly.net/images/products/placeholder.svg)' }}></div>
                                                            <div className="product-info-variant-id-badge__content">
                                                                <div className="product-info-variant-id-badge__header-title" data-cy="badgeHeader" data-testid="badgeHeader">
                                                                    <h5>
                                                                        {item.variants.filter(variant => (variant.name)).map(variant => variant.value).join('/')}
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--input input-columns sku">
                                                        <div className="product-info-variant-util-pos-relative">
                                                            <input className="product-info-variant-input variant-sku-input" type="text" data-cy="variant-sku-input" value={item.SKUCode} placeholder="Enter SKU" />
                                                        </div>
                                                    </td>
                                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--input supplier-code input-columns" data-cy="supplier-code">
                                                        <div className="product-info-variant-util-pos-relative">
                                                            <input className="product-info-variant-input" type="text" data-cy="supplier-code-2e133e1c-cf29-9ddc-11ef-7c9796da503b-2e133e1c-cf29-9ddc-11ef-7c9796d742e8" value={item.SupplierCode} placeholder="Enter code" />
                                                        </div>
                                                    </td>
                                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--input product-info-variant-align-left input-columns" data-cy="supplier-price">
                                                        <div className="product-info-variant-util-pos-relative">
                                                            <input className="product-info-variant-input product-info-variant-align-right" type="text" id="supply-price-input-2e133e1c-cf29-9ddc-11ef-7c9796da503b-2e133e1c-cf29-9ddc-11ef-7c9796d742e8" data-cy="supply-price-input-2e133e1c-cf29-9ddc-11ef-7c9796da503b-2e133e1c-cf29-9ddc-11ef-7c9796d742e8" value={item.SupplierPrice} placeholder="Enter the amount" style={{ paddingLeft: 'calc(25.5px)' }} />
                                                            <span className="product-info-variant-input-icon product-info-variant-input-icon--left product-info-variant-input-symbol">₹</span>
                                                        </div>
                                                    </td>
                                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--input input-columns">
                                                        <div className="product-info-variant-util-pos-relative">
                                                            <input className="product-info-variant-input product-info-variant-input--text-align-right" type="text" placeholder="Enter the amount" name="retailPrice" data-cy="retail-price-excluding-tax-input" value={item.RetailPrice} style={{ paddingLeft: '4ch' }} />
                                                            <div className="product-info-variant-input-icon product-info-variant-input-icon--left product-info-variant-input-symbol">Rs</div>
                                                        </div>
                                                    </td>
                                                    <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--toggle product-info-variant-align-center product-info-variant-valign-t product-info-variant-pt4 product-info-variant-pr0 product-info-variant-pl0">
                                                        <div className="product-info-variant-switch product-info-variant-switch--small">
                                                            <input
                                                                className="product-info-variant-switch-input"
                                                                type="checkbox"
                                                                checked={!!isChecked[index]}
                                                                onChange={() => handleEnable(index)}
                                                            />
                                                            <div className="product-info-variant-switch-track">
                                                                <FontAwesomeIcon icon={faCheck} className="i fa product-info-variant-switch-icon" />
                                                                <FontAwesomeIcon icon={faTimes} className="i fa product-info-variant-cross-icon" />
                                                                <div className="product-info-variant-switch-track-knob"></div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    {/* <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--action product-info-variant-align-center product-info-variant-valign-t product-info-variant-pt2 enabled-column">
                                                        <button type="button" className="product-info-variant-btn product-info-variant-btn--icon-no">
                                                            <FontAwesomeIcon icon={faTrash} className="i fa product-info-variant-icon" />
                                                        </button>
                                                    </td> */}
                                                </tr>
                                                {isRowExpanded(index) && (
                                                    <tr data-testid="table-row" className="product-info-variant-table-list-row product-info-variant-table-list-row--expanded-content">
                                                        <td colSpan="50" data-testid="table-body-cell" className="product-info-variant-table-list-cell">
                                                            <div className="product-info-variant-table-list-expanded-container">
                                                                <div className="product-info-variant-table-list-expanded-content">
                                                                    <div className="product-info-variant-tabs product-info-variant-mb5" role="tablist">
                                                                        <div className="product-info-variant-tab" data-tab-name="Price">
                                                                            <button
                                                                                className={`product-info-variant-tab-button ${activeTab === 'Price' ? 'active-tab' : ''}`}
                                                                                type="button"
                                                                                role="tab"
                                                                                data-cy="tab-button-price"
                                                                                data-testid="tab-button-price"
                                                                                onClick={() => handleTabClick('Price')}
                                                                            >
                                                                                Price
                                                                            </button>
                                                                        </div>
                                                                        <div className="product-info-variant-tab" data-cy="ImageTab" data-tab-name="Image">
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
                                                                        </div>
                                                                    </div>
                                                                    {activeTab === 'Price' && (
                                                                        <div>
                                                                            <div className="product-info-variant-text-signpost product-info-variant-util-text-overflow-break-word product-info-variant-mb6">Price</div>
                                                                            <table data-testid="table" className="product-info-variant-table-list" data-ta="product-pricebook-table">
                                                                                <thead>
                                                                                    <tr data-testid="table-row" className="product-info-variant-table-list-row product-info-variant-table-list-row--header">
                                                                                        <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell" aria-sort="none">Price point</th>
                                                                                        <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-right" aria-sort="none">Supply price</th>
                                                                                        <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-right" aria-sort="none">Markup</th>
                                                                                        <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-right" aria-sort="none">Margin</th>
                                                                                        <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-right" aria-sort="none">Retail price</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr data-testid="table-row" data-ta="product-pricebook-table-body-row" className="product-info-variant-table-list-row">
                                                                                        <td data-testid="table-body-cell" className="product-info-variant-table-list-cell" data-ta="product-pricebook-table-body-cell-name" width="30%">General Price Book (All Products)</td>
                                                                                        <td data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-align-right" data-ta="product-pricebook-table-body-cell-supply-price">
                                                                                            <span className="product-info-variant-text-body product-info-variant-util-text-overflow-normal">₹ {item.SupplierPrice}</span>
                                                                                        </td>
                                                                                        <td data-testid="table-body-cell" className="product-info-variant-table-list-cell" data-ta="product-pricebook-table-body-cell-markup" width="20%">
                                                                                            <div className="product-info-variant-util-pos-relative">
                                                                                                <input className="product-info-variant-input product-info-variant-align-right" type="text" value="" placeholder="Enter the amount" style={{ paddingRight: 'calc(27.8px)' }} />
                                                                                                <span className="product-info-variant-input-icon product-info-variant-input-icon--right product-info-variant-input-symbol">%</span>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td data-testid="table-body-cell" className="product-info-variant-table-list-cell" data-ta="product-pricebook-table-body-cell-markup" width="20%">
                                                                                            <div className="product-info-variant-util-pos-relative">
                                                                                                <input className="product-info-variant-input product-info-variant-align-right" type="text" value="" placeholder="Enter the amount" style={{ paddingRight: 'calc(27.8px)' }} />
                                                                                                <span className="product-info-variant-input-icon product-info-variant-input-icon--right product-info-variant-input-symbol">%</span>
                                                                                            </div>
                                                                                        </td>
                                                                                        <td data-testid="table-body-cell" className="product-info-variant-table-list-cell" data-ta="product-pricebook-table-body-cell-retail-price" width="20%">
                                                                                            <div className="product-info-variant-util-pos-relative">
                                                                                                <input className="product-info-variant-input product-info-variant-align-right" type="text" value={item.RetailPrice} placeholder="Enter the amount" style={{ paddingLeft: 'calc(25.5px)' }} />
                                                                                                <span className="product-info-variant-input-icon product-info-variant-input-icon--left product-info-variant-input-symbol">₹</span>
                                                                                            </div>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                    {activeTab === 'Image' && (
                                                                        <div>
                                                                            <div className="cn-variant-image-container">
                                                                                <label className="cn-variant-image-button" data-cy="chooseImageForVariant">
                                                                                    <img alt="" src="//vendfrontendassets.freetls.fastly.net/images/upload/tap-to-select-v6.svg" />
                                                                                    <span className="product-info-variant-mt2 cn-variant-image-button-text">
                                                                                        <button type="button" className="product-info-variant-btn product-info-variant-btn--link">Choose</button> an image for this variant
                                                                                    </span>
                                                                                </label>
                                                                            </div>
                                                                            <div data-testid="inline-action-bar" className="product-info-variant-action-bar product-info-variant-action-bar--inline react-variant-image-action-bar product-info-variant-pl5 product-info-variant-pr5">
                                                                                <button data-cy="chooseImageForVariant" type="button" className="product-info-variant-btn product-info-variant-btn--supplementary">Choose variant image</button>
                                                                            </div>
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
                        </div>
                    </div>
                </div>
            </section >
        </div>
    )
}

export default EnrichmentProductVariant;