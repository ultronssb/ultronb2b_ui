import { faClose, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import './ProductVariant.css';
import { ProductContext } from './CreateProduct';
import './ProductCategory.css'

const ProductCategorys = () => {
    const { product, setProduct, handleChange } = useContext(ProductContext);

    const initialState = { key: '', value: {}, heirarchyLabel: "", options: [], openModal: false, count: 2 }
    const [categorys, setCategorys] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [selectedPairs, setSelectedPairs] = useState([{ ...initialState }]);

    useEffect(() => {
        fetchVariant();
    }, []);


    const fetchVariant = async () => {
        try {
            const res = await B2B_API.get('product-category').json();
            const categories = res?.response?.filter(cat => cat.name?.toLowerCase() !== 'fabric content');
            const categoryName = categories.map(res => (res.name));
            setCategoryName(categoryName)
            setCategorys(categories)
            setCategorysAndselectedPairs()
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const setCategorysAndselectedPairs = () => {
        const { productCategories } = product
        if (_.size(productCategories) > 0) {
            setSelectedPairs(productCategories)
        }
    }

    const handleSelectChange = (index, selectedKey) => {
        const newPairs = [...selectedPairs];
        newPairs[index] = { ...initialState, key: selectedKey };
        const childCategory = categorys.find(cat => cat.name === selectedKey)?.child || [];
        newPairs[index].options = childCategory;
        setSelectedPairs(newPairs);
        setProduct(prev => ({ ...prev, productCategories: newPairs }));
    };

    const openModals = (index, value) => {
        const newPairs = [...selectedPairs];
        newPairs[index].openModal = value
        setSelectedPairs(newPairs);
    }

    const addNewPair = () => {
        setSelectedPairs([...selectedPairs, { ...initialState }]);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
        setProduct(prev => ({ ...prev, productCategories: newPairs }));
    };

    const selectcategory = (index, cat) => {
        const newPairs = [...selectedPairs];
        const label = newPairs[index]?.heirarchyLabel
        newPairs[index].value = cat || {};
        const hasNoChild = _.size(cat?.child) == 0;
        if (cat) {
            if (hasNoChild) {
                const splitLabel = label.split(" / ");
                if (splitLabel.length === (newPairs[index].count - 1)) {
                    splitLabel[splitLabel.length - 1] = cat.name
                    newPairs[index].heirarchyLabel = _.join(splitLabel, " / ")
                } else {
                    newPairs[index].heirarchyLabel = label.concat(label ? " / " : "").concat(cat.name)
                }
                newPairs[index].openModal = false
                newPairs[index].lastChildName = cat.name
            } else {
                newPairs[index].heirarchyLabel = label.concat(label ? " / " : "").concat(cat.name)
                let count = newPairs[index].count
                newPairs[index].count = ++count;
                newPairs[index].options = cat.child
            }
        } else {
            newPairs[index].heirarchyLabel = ""
            newPairs[index].count = 2;
            newPairs[index].options = getParentChild(newPairs[index].key)
        }
        setSelectedPairs(newPairs);
    }

    const removeCategory = (index) => {
        openModals(index, false)
        selectcategory(index, null)
    }

    const getParentChild = (key) => {
        const childCategory = categorys.find(cat => cat.name === key)?.child || [];
        return childCategory;
    }

    const getAvailableKeys = (currentIndex) => {
        const selectedKeys = selectedPairs.map(pair => pair.key);
        return categoryName.filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
    };

    return (
        <section className="product-variant-section">
            <div className="product-variant-section-wrap">
                <h2 className="product-variant-text-sub-heading">Category</h2>
                <div className="product-variant-g-row">
                    <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-3 product-variant-grid-settings-item">
                        Choose the category attributes for this product to create and manage SKUs and their inventory levels.
                    </div>
                    <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-9">
                        <div>
                            <div className="product-variant-g-row">
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                    <label>
                                        <span className="product-variant-text-label">Category</span>
                                    </label>
                                </div>
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8">
                                    <label>
                                        <span className="product-variant-text-label">Level</span>
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
                                                            scroll={false}
                                                            styles={{ dropdown: { maxHeight: 250, overflowY: 'auto' } }}
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
                                                    <div className="vd-g-col vd-g-s-12">
                                                        <div className="vd-popover-tether-target-wrapper vd-popover-tether-target vd-popover-tether-abutted vd-popover-tether-abutted-left vd-popover-tether-element-attached-left vd-popover-tether-target-attached-left vd-popover-tether-pinned vd-popover-tether-pinned-top">
                                                            <div>
                                                                <input placeholder="Select a category" disabled={pair.options.length === 0} style={{ width: '100%', cursor: pair.options.length === 0 ? 'not-allowed' : 'pointer' }} readOnly className="product-variant-select vd-dropdown-input " type="text" value={pair.heirarchyLabel} onClick={() => openModals(index, true)} onChange={() => { }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {
                                                        pair.openModal && (
                                                            <div className="vd-popover-tether-element-wrapper">
                                                                <div className="vd-popover vd-category-select-popover vd-popover--with-list" style={{ width: '500px' }}>
                                                                    <div className="vd-popover-content">
                                                                        <div className="vd-mt6 vd-ml6 vd-mr6 vd-mb3">
                                                                            <label htmlFor="search-input" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                                                                <span className="vd-text-label vd-util-text-overflow-break-word vd-label">Search all categories</span>
                                                                                <span><FontAwesomeIcon icon={faClose} onClick={() => openModals(index, false)} style={{ cursor: 'pointer' }} /></span>
                                                                            </label>
                                                                            <input className="vd-input" type="text" id="search-input" placeholder="Enter a category name" />
                                                                        </div>
                                                                        <div role="list">
                                                                            <div role="listitem" className="vd-mt4">
                                                                                <div className="vd-ml6 vd-mr6">
                                                                                    <span className="vd-text-signpost vd-util-text-overflow-break-word">Level {pair.count}</span>
                                                                                    <hr className="vd-hr vd-mt2" />
                                                                                </div>
                                                                                <div className='child-values'>
                                                                                    {pair.options.map((cat) => (
                                                                                        <ul className="vd-popover-list" key={cat.id}>
                                                                                            <li
                                                                                                tabIndex="0"
                                                                                                className="vd-popover-list-item"
                                                                                                onClick={() => selectcategory(index, cat)}
                                                                                            >
                                                                                                <div className="helios-c-PJLV helios-c-PJLV-icepvqO-css">
                                                                                                    <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                                                                                        <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                                                                            <span>
                                                                                                                <span className="">{cat.name}</span>
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </li>
                                                                                        </ul>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {pair.heirarchyLabel && (
                                                                        <div className="vd-popover-actions">
                                                                            <div className="vd-action-bar vd-action-bar--inline category-list-footer vd-suggestion--footer">
                                                                                <div className="helios-c-PJLV helios-c-PJLV-idMyiqo-css">
                                                                                    <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                                                                        <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                                                            <span className="vd-text-body vd-util-text-overflow-break-word">{pair.heirarchyLabel}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                                                                        <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                                                            <button
                                                                                                aria-label="Remove selected category"
                                                                                                type="button"
                                                                                                className="vd-btn vd-btn--icon-supplementary"
                                                                                                onClick={() => removeCategory(index)}
                                                                                            >
                                                                                                <FontAwesomeIcon className='fa vd-icon' icon={faTrash} />
                                                                                            </button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </div>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    className="product-variant-btn product-variant-btn--icon-no product-variant-ml2"
                                                    onClick={() => removePair(+index)}
                                                >
                                                    <FontAwesomeIcon className="fa product-variant-icon" icon={faTrash} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="product-variant-g-row">
                                {_.size(categorys) > _.size(selectedPairs) && (
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                        <button
                                            type="button"
                                            className="product-variant-btn product-variant-btn--text-go"
                                            onClick={addNewPair}
                                        >
                                            <FontAwesomeIcon className="fa product-variant-icon product-variant-mr2" icon={faPlus} />
                                            Add another category
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductCategorys;
