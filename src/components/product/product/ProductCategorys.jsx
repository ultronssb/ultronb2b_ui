import React, { useEffect, useState } from 'react';
import './ProductVariant.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Modal, MultiSelect } from '@mantine/core';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import _ from 'lodash';

const ProductCategorys = () => {
    const [category, setCategory] = useState('');
    const [categorys, setCategorys] = useState([]);
    const [childCategories, setChildcategories] = useState([])
    const [categoryName, setCategoryName] = useState([]);
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [] }]);
    const [openModal, setOpenModal] = useState(false);
    const [filterCategories, setFilterCategories] = useState([])
    const [selecetedCategory, setSelectedCategory] = useState(null);
    const [countLevel, setCountLevel] = useState(2)

    useEffect(() => {
        fetchVariant();
    }, []);

    useEffect(() => {
        if (selecetedCategory) {
            if (_.size(selecetedCategory.child) == 0) {
                setOpenModal(false)
            } else {
                setCountLevel(prev => prev + 1)
                setFilterCategories(selecetedCategory.child)
            }
        }
    }, [selecetedCategory])


    const fetchVariant = async () => {
        try {
            const res = await B2B_API.get('product-category').json();
            const categoryName = res.response.map(res => (res.name));
            setCategoryName(categoryName)
            setCategorys(res?.response)
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const handleSelectChange = (index, selectedKey) => {
        const newPairs = [...selectedPairs];
        newPairs[index] = { key: selectedKey, values: [] };
        setSelectedPairs(newPairs);

        const keyToCheck = newPairs[0]?.key;
        const isKeyPresent = categoryName.some(category => category === keyToCheck);
        if (isKeyPresent) {
            const childCategory = categorys.find(cat => cat.name === keyToCheck)?.child || [];
            setChildcategories(childCategory)
            setFilterCategories(childCategory);
        } else {
            setFilterCategories([]);
        }
    };

    const addNewPair = () => {
        setSelectedPairs([...selectedPairs, { key: '', values: [] }]);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
    };

    const handleChange = (event, key) => {
        setCategory((prev) => ({ ...prev, [key]: event?.target?.value }))

    }

    const selectcategory = (cat) => {
        setCategory(prev => prev.concat(prev ? " / " : "").concat(cat.name))
        setSelectedCategory(cat);
    }

    const removeCategory = () => {
        setOpenModal(false)
        setCategory("")
        setSelectedCategory(null)
        setFilterCategories(childCategories)
        setCountLevel(2)
    }

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
                                        <span className="product-variant-text-label">Value</span>
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
                                                            data={categoryName}
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
                                                                <input placeholder="Select a category"  style={{width:'100%'}} readOnly="" className="product-variant-select vd-dropdown-input " type="text" value={category} onChange={(e) => handleChange(e)} onClick={() => setOpenModal(true)} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {
                                                        openModal && (
                                                            <div className="vd-popover-tether-element-wrapper">
                                                                <div className="vd-popover vd-category-select-popover vd-popover--with-list" style={{ width: '500px' }}>
                                                                    <div className="vd-popover-content">
                                                                        <div className="vd-mt6 vd-ml6 vd-mr6 vd-mb3">
                                                                            <label htmlFor="search-input" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                                                                <span className="vd-text-label vd-util-text-overflow-break-word vd-label">Search all categories</span>
                                                                                <span><FontAwesomeIcon icon={faClose} onClick={() => setOpenModal(false)} style={{ cursor: 'pointer' }} /></span>
                                                                            </label>
                                                                            <input className="vd-input" type="text" id="search-input" placeholder="Enter a category name" />
                                                                        </div>
                                                                        <div role="list">
                                                                            <div role="listitem" className="vd-mt4">
                                                                                <div className="vd-ml6 vd-mr6">
                                                                                    <span className="vd-text-signpost vd-util-text-overflow-break-word">Level {countLevel}</span>
                                                                                    <hr className="vd-hr vd-mt2" />
                                                                                </div>
                                                                                <div className='child-values'>
                                                                                    {filterCategories.map((cat) => (
                                                                                        <ul className="vd-popover-list" key={cat.id}>
                                                                                            <li
                                                                                                tabIndex="0"
                                                                                                className="vd-popover-list-item"
                                                                                                onClick={() => selectcategory(cat)}
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
                                                                    {filterCategories && (
                                                                        <div className="vd-popover-actions">
                                                                            <div className="vd-action-bar vd-action-bar--inline category-list-footer vd-suggestion--footer">
                                                                                <div className="helios-c-PJLV helios-c-PJLV-idMyiqo-css">
                                                                                    <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                                                                        <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                                                            <span className="vd-text-body vd-util-text-overflow-break-word">{filterCategories.name}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                                                                        <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                                                            <button
                                                                                                aria-label="Remove selected category"
                                                                                                type="button"
                                                                                                className="vd-btn vd-btn--icon-supplementary"
                                                                                                onClick={() => removeCategory()}
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
                                {_.size(categoryName) >= _.size(selectedPairs) && (
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
