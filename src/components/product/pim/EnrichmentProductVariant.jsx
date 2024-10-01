import { faAngleRight, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, FileButton, Group, Text, rem } from '@mantine/core'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import _ from 'lodash'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor'
import './EnrichmentProductVariant.css'
import { EnrichProductContext } from './EnrichProduct'
import '@mantine/dropzone/styles.css';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';


const EnrichmentProductVariant = (props) => {
    const { product, setProduct, pim, setPim } = useContext(EnrichProductContext);
    const [activeTab, setActiveTab] = useState('Price');
    const [expandedRows, setExpandedRows] = useState([]);
    const isRowExpanded = (index) => expandedRows.includes(index);
    const [isChecked, setIsChecked] = useState([]);
    const [variantValues, setVariantValues] = useState([]);
    const [productPims, setProductPims] = useState([]);
    const [file, setFile] = useState();
    const openRef = useRef(null); // Ref to open the Dropzone
    const resetRef = useRef(null);
    const [imageUrl, setImageUrl] = useState(null);

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
        getAllPimVariants();
    }, []);

    console.log("productPims : ", productPims);

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
            newChecked[index] = !newChecked[index];
            return newChecked;
        });
    };

    const getAllPimVariants = async () => {
        const res = await B2B_API.get(`pim/product/${pim?.pimId}`).json()
        const pims = res?.response?.pimVariants
        setProductPims(pims);
        console.log("pimsssss : ", pims);
    }

    const handleDrop = (acceptedFiles, index) => {
        const uploadedFile = acceptedFiles[0];
        const fileUrl = URL.createObjectURL(uploadedFile);
        setProductPims((prevState) =>
            prevState.map((item, i) =>
                i === index ? { ...item, file: uploadedFile, imageUrl: fileUrl } : item
            )
        );
    };

    const handleReset = (index) => {
        setProductPims((prevState) =>
            prevState.map((item, i) =>
                i === index ? { ...item, file: null, imageUrl: null } : item
            )
        );
    };



    return (
        <div>
            <section className="helios-c-PJLV product-info-variant-section">
                <div className="helios-c-PJLV product-info-variant-section-wrap">
                    <h2 className="product-info-variant-text-sub-heading product-info-variant-mb4" role="heading" aria-level="2">Variants</h2>
                    <div className="product-info-variant-g-row">
                        <div className="product-info-variant-g-col product-info-variant-g-s-12 product-info-variant-g-m-3 product-info-variant-grid-settings-item" data-testid="sr-settings-about"></div>
                        <div className="product-info-variant-g-col product-info-variant-g-s-12 product-info-variant-g-m-9" data-testid="sr-settings-content">
                            <div>
                                <div className="product-info-variant-g-row">
                                    <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-4">
                                        <label>
                                            <span className="product-info-variant-text-label">Variant Name</span>
                                        </label>
                                    </div>
                                    <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-8">
                                        <label>
                                            <span className="product-info-variant-text-label">Variant Value</span>
                                        </label>
                                    </div>
                                </div>
                                <div>
                                    {
                                        Object.keys(variantValues).map((key, index) => (
                                            <div className="product-info-variant-g-row">
                                                <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-4">
                                                    <div className="product-info-variant-flex">
                                                        <div className="product-info-variant-flex-grow-1 product-info-variant-mr2" data-cy="select-attribute">
                                                            <div className="product-info-variant-popover-tether-target-wrapper">
                                                                <div className="product-info-variant-autocomplete-input-container product-info-variant-flex--column" data-testid="dropdown-input-container">
                                                                    <input readonly="" type="text" className="product-info-variant-select product-info-variant-dropdown-input" spellcheck="false" placeholder="Choose a variant attribute" value={key} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="product-info-variant-g-col product-info-variant-g-s-6 product-info-variant-g-m-8 product-info-variant-mb2">
                                                    <div className="cn-attribute-values-row">
                                                        <div className="cn-attribute-values" data-cy="variant-value">
                                                            <div className="product-info-variant-lozenge-group" data-testid="tag-input-lozenges-container">
                                                                {
                                                                    variantValues[key].map((val, valIndex) => (
                                                                        <span
                                                                            key={`${index}-${valIndex}`}
                                                                            className="product-info-variant-lozenge product-info-variant-lozenge--interactive"
                                                                        >
                                                                            <span className="product-info-variant-lozenge-value">{val}</span>
                                                                        </span>
                                                                    ))
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                    <div class="product-info-variant-g-row product-info-variant-mt10"></div>
                                </div>
                            </div>
                            <div className="product-info-variant-mb1">
                                <h3 className="product-info-variant-text-sub-heading product-info-variant-mb1" role="heading" aria-level="3">This product has {_.size(productPims)} variant</h3>
                            </div>
                            <div data-cy="variants-table-content">
                                <table data-testid="table" className="product-info-variant-table-list">
                                    <thead>
                                        <tr data-testid="table-row" className="product-info-variant-table-list-row product-info-variant-table-list-row--header">
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell cn-variant-name-column" aria-sort="none">Variant name</th>
                                            <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell" aria-sort="none">
                                                <div>SKU Code</div>
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
                                        productPims?.map((item, index) => (
                                            <tbody>
                                                <tr key={index} data-testid="table-row" data-cy="variantSummary" className={`product-info-variant-table-list-row product-info-variant-table-list-row--expandable ${isRowExpanded(index) ? 'product-info-variant-table-list-row--expanded' : ''}`}>
                                                    <td onClick={() => handleToggle(index)} data-testid="table-body-cell" className="product-info-variant-table-list-cell product-info-variant-table-list-cell--compact product-info-variant-pt2 product-info-variant-pl0 product-info-variant-flex product-info-variant-flex--align-center">
                                                        <FontAwesomeIcon icon={faAngleRight} className={`i fa product-info-variant-icon product-info-variant-table-list-toggle-icon ${isRowExpanded(index) ? 'product-info-variant-table-list-toggle-icon--toggled' : ''}`} onClick={() => handleToggle(index)} />
                                                        <div className="product-info-variant-id-badge product-info-variant-id-badge--small">
                                                            <div key={index} className="product-info-variant-id-badge__image" data-cy="badgeImage" data-testid="badgeImage">
                                                                {item.imageUrl ? (
                                                                    <img src={item.imageUrl} alt="Uploaded Badge" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                                ) : null}
                                                            </div>
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
                                                            <input className="product-info-variant-input variant-sku-input" type="text" data-cy="variant-sku-input" value={item.variantSku} placeholder="Enter SKU" disabled />
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
                                                                                        <th data-testid="table-head-cell" className="product-info-variant-table-list-head-cell product-info-variant-align-right" aria-sort="none">Cost price</th>
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
                                                                        <div key={index}>
                                                                            <div className="cn-variant-image-container">
                                                                                <Dropzone
                                                                                    onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index)}
                                                                                    openRef={openRef}
                                                                                >
                                                                                    {!item.imageUrl ? (
                                                                                        <>
                                                                                            <IconUpload size={50} />
                                                                                            <Text size="md">Drag images here or click to select files</Text>
                                                                                        </>
                                                                                    ) : null}

                                                                                    {item.imageUrl && (
                                                                                        <img src={item.imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: 100 }} />
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
            </section>
        </div>
    )
}

export default EnrichmentProductVariant;