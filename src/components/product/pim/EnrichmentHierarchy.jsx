
import { Accordion } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import React, { useState, useEffect, ProductContext, useContext } from 'react';
import B2BButton from '../../../common/B2BButton';
import B2BSelect from '../../../common/B2BSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { B2B_API } from '../../../api/Interceptor';
import _ from 'lodash';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentHierarchy = () => {
  const { handleChange, product, setProduct } = useContext(EnrichProductContext);
  const [fields, setFields] = useState([
    {
      id: 1,
      description: '',
      categorys: [],
    },
  ]);
  const initialState = { key: '', value: {}, heirarchyLabel: "", options: [], openModal: false, count: 2 };
  const [openItem, setOpenItem] = useState('item-1');
  const [selectedPairs, setSelectedPairs] = useState([{ ...initialState }]);
  const [categoryName, setCategoryName] = useState([]);
  const [categorys, setCategorys] = useState([]);

  useEffect(() => {
    fetchVariant();
  }, []);

  useEffect(() => {
    if (product?.productCategories) {
      setCategorysAndselectedPairs();
    }
  }, [product]);

  const fetchVariant = async () => {
    try {
      const res = await B2B_API.get('product-category').json();
      const categories = res?.response?.filter(cat => cat.name?.toLowerCase() !== 'fabric content');
      const categoryName = categories.map(res => res.name);
      setCategoryName(categoryName);
      setCategorys(categories);
    } catch (error) {
      console.error('Error fetching variants:', error);
    }
  };

  const setCategorysAndselectedPairs = () => {
    const { productCategories } = product;
    if (_.size(productCategories) > 0) {
      const formattedCategories = productCategories.map(category => ({
        ...category,
        options: getParentChild(category.key)
      }));
      setSelectedPairs(formattedCategories);
    }
  };

  const handleSelectChange = (index, selectedKey) => {
    const newPairs = [...selectedPairs];
    newPairs[index] = { ...initialState, key: selectedKey };
    const childCategory = categorys.find(cat => cat.name === selectedKey)?.child || [];
    newPairs[index].options = childCategory;

    newPairs[index].heirarchyLabel = "";
    setSelectedPairs(newPairs);
    setProduct(prev => ({ ...prev, productCategories: newPairs }));
  };

  const openModals = (index, value) => {
    const newPairs = [...selectedPairs];
    newPairs[index].openModal = value;
    setSelectedPairs(newPairs);
  };

  const selectcategory = (index, cat) => {
    const newPairs = [...selectedPairs];
    const label = newPairs[index]?.heirarchyLabel;
    newPairs[index].value = cat || {};
    const hasNoChild = _.size(cat?.child) === 0;
    if (cat) {
      if (hasNoChild) {
        const splitLabel = label.split(" / ");
        if (splitLabel.length === (newPairs[index].count - 1)) {
          splitLabel[splitLabel.length - 1] = cat.name;
          newPairs[index].heirarchyLabel = _.join(splitLabel, " / ");
        } else {
          newPairs[index].heirarchyLabel = label.concat(label ? " / " : "").concat(cat.name);
        }
        newPairs[index].openModal = false;
        newPairs[index].lastChildName = cat.name;
      } else {
        newPairs[index].heirarchyLabel = label.concat(label ? " / " : "").concat(cat.name);
        let count = newPairs[index].count;
        newPairs[index].count = ++count;
        newPairs[index].options = cat.child;
      }
    } else {
      newPairs[index].heirarchyLabel = "";
      newPairs[index].count = 2;
      newPairs[index].options = getParentChild(newPairs[index].key);
    }
    setSelectedPairs(newPairs);
  };

  const getParentChild = (key) => {
    const childCategory = categorys.find(cat => cat.name === key)?.child || [];
    return childCategory;
  };

  const getAvailableKeys = (currentIndex) => {
    const selectedKeys = selectedPairs.map(pair => pair.key);
    return categoryName.filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
  };

  // const handleAddField = () => {
  //   const newId = fields.length + 1;
  //   setFields(prevFields => [
  //     ...prevFields,
  //     {
  //       id: newId,
  //       description: '',
  //       categorys: []
  //     },
  //   ]);
  //   setOpenItem(`item-${newId}`);
  // };

  const handleAddField = () => {
    const newId = fields.length + 1;

    // Reset selectedPairs with a new initial state for the new category
    const newPair = {
      ...initialState, // Reset to initial state
      key: '', // Empty key for new selection
      heirarchyLabel: '', // Empty label
      value: {}, // Reset value
      options: [] // Reset options
    };

    setFields(prevFields => [
      ...prevFields,
      {
        id: newId,
        description: '',
        categorys: []
      },
    ]);
    setOpenItem(`item-${newId}`);
  };

  const handleRemoveField = (index) => {
    setFields(prevFields => {
      const newFields = prevFields.filter((_, i) => i !== index);
      if (openItem === `item-${fields[index].id}`) {
        setOpenItem(newFields.length > 0 ? `item-${newFields[0].id}` : '');
      }
      return newFields;
    });
  };

  return (
    <div className='EnrichmentContext.Provider '>
      <B2BButton
        name="Add Category"
        onClick={handleAddField}
        style={{ marginTop: '10px' }}
        onChange={(e) => handleSelectChange(e)}
      />
      <Accordion
        transitionDuration={300}
        chevron={<IconPlus size={14} />}
        value={openItem}
        onChange={setOpenItem}
        style={{ marginTop: '10px' }}
      >
        {fields.map((field, index) => (
          <Accordion.Item key={field.id} value={`item-${field.id}`}>
            <Accordion.Control>
              Category {field.id}
            </Accordion.Control>
            <Accordion.Panel>
              <div>
                <div style={{ display: 'flex', flexFlow: 'row wrap', width: "100%" }}>
                  <div style={{ display: 'flex', width: '25%' }}>
                    <label>Category</label>
                  </div>
                  <div style={{ display: 'flex', flex: '1 1' }}>
                    <label>Level</label>
                  </div>
                  <div style={{ display: 'flex', flex: '1 1' }}>
                    <label>Description</label>
                  </div>
                </div>

                {selectedPairs.map((pair, pairIndex) => (
                  <div key={pairIndex} style={{ display: 'flex', width: '100%' }}>
                    <div style={{ display: 'flex', width: '25%' }}>
                      <B2BSelect
                        value={pair.key}
                        data={getAvailableKeys(pairIndex)}
                        onChange={(e) => handleSelectChange(pairIndex, e)}
                      />
                    </div>
                    <div style={{ display: 'flex', flex: '1 1' }}>
                      <div style={{ width: '90%' }}>
                        <div>
                          <input
                            placeholder="Select a category"
                            disabled={pair?.key === null}
                            style={{ width: '100%', cursor: pair.key === null ? 'not-allowed' : 'pointer' }}
                            readOnly
                            className="product-variant-select vd-dropdown-input"
                            type="text"
                            value={pair.heirarchyLabel}
                            onClick={() => openModals(pairIndex, true)}
                          />
                        </div>
                        {pair.openModal && (
                          <div className="vd-popover-tether-element-wrapper">
                            <div className="vd-popover-content">
                              <div className="vd-mt6 vd-ml6 vd-mr6 vd-mb3">
                                <label htmlFor="search-input" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                  <span className="vd-text-label vd-util-text-overflow-break-word vd-label">Search all categories</span>
                                  <span><FontAwesomeIcon icon={faClose} onClick={() => openModals(pairIndex, false)} style={{ cursor: 'pointer' }} /></span>
                                </label>
                              </div>
                              {(!pair.value || pair.options.length > 0) && (
                                <div className="vd-mt6 vd-ml6 vd-mr6 vd-mb3">
                                  <input className="vd-input" type="text" id="search-input" placeholder="Enter a category name" />
                                </div>
                              )}
                              {(!pair.value || pair.options.length > 0) && (
                                <div role="list">
                                  <div className="vd-ml6 vd-mr6">
                                    <span className="vd-text-signpost vd-util-text-overflow-break-word">Level {pair.count}</span>
                                    <hr className="vd-hr vd-mt6" />
                                  </div>
                                  {pair.options.map((cat, catIndex) => (
                                    <div key={catIndex} className="vd-list-item" role="listitem" onClick={() => selectcategory(pairIndex, cat)}>
                                      {cat.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flex: '1 1' }}>
                      <textarea
                        value={field.description}
                        className="form-input-textarea"
                        onChange={(e) => {
                          const newFields = [...fields];
                          newFields[index].description = e.target.value;
                          setFields(newFields);
                        }}
                        placeholder="Enter Description"
                      />
                    </div>
                    {fields.length > 1 && (
                      <B2BButton
                        name="Remove"
                        onClick={() => handleRemoveField(index)}
                        style={{ marginTop: '10px', marginLeft: '3rem' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
};

export default EnrichmentHierarchy;




