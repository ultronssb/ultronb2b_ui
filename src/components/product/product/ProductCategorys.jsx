import { faClose, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';
import './ProductCategory.css';
import { createB2BAPI } from '../../../api/Interceptor';

const ProductCategorys = () => {
    const { product, setProduct, inputError, setInputError } = useContext(ProductContext);

    const initialState = { key: '', value: {}, heirarchyLabel: "", options: [], openModal: false, count: 2 }
    const [categorys, setCategorys] = useState([]);
    const [categoryName, setCategoryName] = useState([]);
    const [selectedPairs, setSelectedPairs] = useState([{ ...initialState }]);
    const B2B_API = createB2BAPI();

    useEffect(() => {
        fetchcategory();
    }, []);

    const fetchcategory = async () => {
        try {
            const res = await B2B_API.get('product-category').json();
            const categories = res?.response?.filter(cat => cat.name?.toLowerCase() !== 'fabric content');
            const categoryName = categories.map(res => (res.name));
            setCategoryName(categoryName)
            setCategorys(categories)
            setCategorysAndselectedPairs()
        } catch (error) {
            console.error('Error fetching categorys:', error);
        }
    };

    const setCategorysAndselectedPairs = () => {
        const { productCategories } = product;
        if (_.size(productCategories) > 0) {
            const formattedCategories = productCategories.map(category => ({
                ...category,
                options: getParentChild(category.key) // Dynamically load child options
            }));
            setSelectedPairs(formattedCategories);
        }
    }


    const handleSelectChange = (index, selectedKey) => {
        const newPairs = [...selectedPairs];
        newPairs[index] = { ...initialState, key: selectedKey };
        const childCategory = categorys.find(cat => cat.name === selectedKey)?.child || [];
        newPairs[index].options = childCategory;
        setSelectedPairs(newPairs);
        setProduct(prev => ({ ...prev, productCategories: newPairs }));
        setInputError("");
    };


    const openModals = (index, value) => {
        const newPairs = [...selectedPairs];
        newPairs[index].openModal = value;
        setSelectedPairs(newPairs);
    };

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
        setInputError("");
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
        <section className="product-category-section">
            <h2 className="product-category-sub-heading">Category</h2>
            <div className="" style={{ display: 'flex', flexDirection: 'row' }}>
                <div className='input-field-container'>
                    <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
                        <div className="product-category-g-row">
                            <div className="product-category-g-col" >
                                <span className="product-category-text-label">Category</span>
                                <span className="error-message"> *</span>
                            </div>
                            <div className="product-category-g-col" >
                                <span className="product-category-text-label">Level</span>
                                <span className="error-message"> *</span>
                            </div>
                            <div className="product-category-g-col" style={{ width: '5rem', flex: 'none' }}></div>
                        </div>
                        {selectedPairs.map((pair, index) => (
                            <div key={index} className="product-category-g-row">
                                <div className="product-category-g-col">
                                    <B2BSelect
                                        value={pair.key}
                                        data={getAvailableKeys(index)}
                                        onChange={(e) => handleSelectChange(index, e)}
                                        error={inputError?.categoryErrorMessage}
                                    />
                                </div>
                                <div className="product-category-g-col" style={{ flexDirection: 'column' }}>
                                    <div className='product-category-inputField'>
                                        <input placeholder="Select a category" disabled={pair?.key === null} style={{ cursor: pair.key === null ? 'not-allowed' : 'pointer' }} readOnly type="text" value={pair.heirarchyLabel} onClick={() => openModals(index, true)} onChange={() => { }} />
                                    </div>
                                    {
                                        pair.openModal && (
                                            <div className="product-category-modal-popup">
                                                <div className="product-category-modal-popup-heading" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                                    <span className="product-category-modal-popup-label">Search all categories</span>
                                                    <span><FontAwesomeIcon icon={faClose} onClick={() => openModals(index, false)} style={{ cursor: 'pointer', fontSize: '18px' }} /></span>
                                                </div>
                                                {!pair.value || pair.options.length > 0 ? <div style={{ padding: '0 20px', }}> <input type="text" id="product-category-search-input" placeholder="Enter a category name" /> </div> : ''}
                                                {
                                                    !pair.value || pair.options.length > 0 ?
                                                        <div role="list">
                                                            <div className='product-category-child'>
                                                                <span className='product-category-child-level'>Level {pair.count}</span>
                                                                <hr />
                                                            </div>
                                                            <div className='product-category-child'>
                                                                {pair.options.map((cat) => (
                                                                    <ul className="product-category-child-list" key={cat.id}>
                                                                        <li tabIndex="0" onClick={() => selectcategory(index, cat)}>
                                                                            <span className="">{cat.name}</span>
                                                                        </li>
                                                                    </ul>
                                                                ))}
                                                            </div>
                                                        </div> : ''
                                                }
                                                {pair.heirarchyLabel && (
                                                    <div className="product-category-heirarchyLevel">
                                                        <span className="vd-text-body vd-util-text-overflow-break-word">{pair.heirarchyLabel}</span>
                                                        <button aria-label="Remove selected category" type="button" className="vd-btn vd-btn--icon-supplementary" onClick={() => removeCategory(index)} >
                                                            <FontAwesomeIcon className='fa' icon={faTrash} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    }
                                    <span className='error-message'>
                                        {inputError?.categorysErrorMessage}
                                    </span>
                                </div>
                                <div className="product-category-g-col" style={{ width: '5rem', flex: 'none', justifyContent: 'center' }}>
                                    {!pair.openModal && index > 0 && (
                                        <button type="button" className="product-category-btn" onClick={() => removePair(+index)}>
                                            <FontAwesomeIcon className="fa product-category-icon" icon={faTrash} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        {_.size(categorys) > _.size(selectedPairs) && (
                            <button type="button" className="product-category-btn product-category-btn--text-go" onClick={addNewPair} >
                                <FontAwesomeIcon className="fa" icon={faPlus} />
                                Add another category
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductCategorys;