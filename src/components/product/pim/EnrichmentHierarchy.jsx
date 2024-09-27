import { faClose, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Accordion, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BSelect from '../../../common/B2BSelect';
import { EnrichProductContext } from './EnrichProduct';
import B2BInput from '../../../common/B2BInput';

const EnrichmentHierarchy = () => {
  const { product, setProduct,pim ,setPim } = useContext(EnrichProductContext);

  const initialState = { key: '', value: {}, heirarchyLabel: "", options: [], openModal: false, count: 2 };
  const [categorys, setCategorys] = useState([]);
  const [categoryName, setCategoryName] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([{ ...initialState }]);
  const [expanded, setExpanded] = useState('category-0');
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    fetchCategory();
  }, []);


  useEffect(() => {
    if (!loading && product?.productCategories) {
        const categories = product.productCategories.length > 0 ? product.productCategories : [{ ...initialState }];

        const attributes = pim?.attributes.length > 0 ? pim?.attributes : [];
        
        setSelectedPairs([...categories,...attributes]);
    }
}, [loading, product?.productCategories, pim?.attributes]);

  const fetchCategory = async () => {
    try {
      const res = await B2B_API.get('product-category').json();
      const categories = res?.response?.filter(cat => cat.name?.toLowerCase());
      const categoryName = categories.map(res => (res.name));
      setCategoryName(categoryName)
      setCategorys(categories)
      setLoading(false)
      setCategorysAndselectedPairs()
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const setCategorysAndselectedPairs = () => {
    const { productCategories } = product;
    const { attributes } = pim;

    const formattedCategories = [];
    if (_.size(productCategories) > 0) {
        const productFormatted = productCategories.map(category => ({
            ...category,
            options: getParentChild(category.key)
        }));
        formattedCategories.push(...productFormatted);
    }

    if (_.size(attributes) > 0) {
        const attributeFormatted = attributes.map(attribute => ({
            ...attribute,
            options: getParentChild(attribute.key)
        }));
        formattedCategories.push(...attributeFormatted);
    }
    console.log(formattedCategories,"formcat")
    setSelectedPairs(formattedCategories.length > 0 ? formattedCategories : [{ ...initialState }]);
};

  const handleSelectChange = (index, selectedKey) => {
    const newPairs = [...selectedPairs];
    newPairs[index] = { ...initialState, key: selectedKey };
    const childCategory = categorys.find(cat => cat.name === selectedKey)?.child || [];
    newPairs[index].options = childCategory;
    setSelectedPairs(newPairs);
    setPim(prev => ({ ...prev, attributes: newPairs.slice(_.size(product.productCategories)) }));
  };

  const openModals = (index, value) => {
    const newPairs = [...selectedPairs];
    newPairs[index].openModal = value;
    setSelectedPairs(newPairs);
  };

  const addNewPair = () => {
    const newIndex = selectedPairs.length;
    setSelectedPairs([...selectedPairs, { ...initialState }]);
    setExpanded(`category-${newIndex}`);
    setIsAddingNew(true); // Set to true when adding a new pair
  };

  const removePair = (index) => {
    const newPairs = [...selectedPairs];
    newPairs.splice(index, 1);
    setSelectedPairs(newPairs);
    setPim(prev => ({ ...prev, attributes: newPairs.splice(_.size(product.productCategories)) }));
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

  console.log(product, "pro");


  return (<div>
   
    <div className="" style={{ display: 'flex', flexDirection: 'row' }}>
        
        <div className='input-field-container'>
            <div style={{ display: 'flex', flexDirection: 'column', rowGap: '1rem' }}>
                {selectedPairs.map((pair, index) => (
                 <div>
                  {index===0?<> <h2 className="product-category-sub-heading">Category</h2>
                    <div className="product-category-g-row">
                    <div className="product-category-g-col" >
                        <span className="product-category-text-label">Category</span>
                    </div>
                    <div className="product-category-g-col" >
                        <span className="product-category-text-label">Level</span>
                    </div>
                  
                </div></>:''}
                {index===_.size(product.productCategories)?<> <h2 className="product-category-sub-heading">Attributes</h2>
                    <div className="product-category-g-row">
                    <div className="product-category-g-col" >
                        <span className="product-category-text-label">Attribute</span>
                    </div>
                    <div className="product-category-g-col" >
                        <span className="product-category-text-label">Level</span>
                    </div>
                    <div className="product-category-g-col" >
                        <span className="product-category-text-label">Description</span>
                    </div>
                </div></>:''}
                    <div key={index} className="product-category-g-row">
                       
                        <div className="product-category-g-col">
                        {index <_.size(product.productCategories)  ? (
      <B2BInput
        value={pair.key}
        disabled={index}
       
      />
    ) : (
      <B2BSelect
        value={pair.key}
        data={getAvailableKeys(index)}
        onChange={(e) => handleSelectChange(index, e)}
       
      />
    )}
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
                                
                        </div>
                        {index >=(_.size(product.productCategories))  ?<div className="product-category-g-col" style={{ flexDirection: 'column' ,marginLeft:'1rem'}}>
                        <div className='product-category-inputField'>
                                <input placeholder="Description"  />
                            </div>
                            </div>:""}
                        <div className="product-category-g-col" style={{ width: '5rem', flex: 'none', justifyContent: 'center' }}>
                            {!pair.openModal && index >= _.size(product.productCategories) && (
                                <button type="button" className="product-category-btn" onClick={() => removePair(+index)}>
                                    <FontAwesomeIcon className="fa product-category-icon" icon={faTrash} />
                                </button>
                            )}
                        </div>
                    </div>
                    </div>
                ))}
            </div>
            <div>
                {_.size(categorys) > _.size(selectedPairs) && (
                    <button type="button" className="product-category-btn product-category-btn--text-go" onClick={addNewPair} >
                        <FontAwesomeIcon className="fa" icon={faPlus} />
                        Add Attributes
                    </button>
                )}
            </div>
        </div>
    </div>
    </div>)
};

export default EnrichmentHierarchy;