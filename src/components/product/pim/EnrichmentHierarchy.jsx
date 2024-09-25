import { faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
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

const EnrichmentHierarchy = () => {
  const { product, setProduct,pim } = useContext(EnrichProductContext);

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
      setSelectedPairs(product.productCategories.length > 0 ? product.productCategories : [{ ...initialState }]);
    }
  }, [loading, product?.productCategories]);


  const fetchCategory = async () => {
    try {
      const res = await B2B_API.get('product-category').json();
      const categories = res?.response?.filter(cat => cat.name?.toLowerCase() !== 'fabric content');
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
    if (_.size(productCategories) > 0) {
      const formattedCategories = productCategories.map(category => ({
        ...category,
        options: getParentChild(category.key)
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

  console.log(product, "pro");


  return (
    <Accordion
      value={expanded} 
      onChange={setExpanded}
      chevron={<IconPlus />}
    >
      {selectedPairs.map((pair, index) => (
        <Accordion.Item key={`category-${index}`} value={`category-${index}`}>
          <Accordion.Control>
            {`Category ${index + 1}:${pair?.key}`}
          </Accordion.Control>
          <Accordion.Panel>
            <div style={{ display: 'flex', flexFlow: 'row wrap', width: '100%' }}>
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
            <div style={{ display: 'flex', width: '100%' }}>
              <div style={{ display: 'flex', width: '25%' }}>
                <B2BSelect
                  value={pair.key}
                  data={getAvailableKeys(index)}
                  onChange={(e) => handleSelectChange(index, e)}
                />
              </div>
              <div style={{ display: 'flex', flex: '1 1', flexDirection: 'column' }}>
                <div style={{ width: '90%' }}>
                  <input
                    placeholder="Select a category"
                    disabled={!pair.key}
                    readOnly
                    value={pair.heirarchyLabel}
                    onClick={() => openModals(index, true)}
                    className="product-variant-select"
                    style={{ width: '100%', cursor: !pair.key ? 'not-allowed' : 'pointer' }}
                  />
                </div>
                {pair.openModal && (
                  <div style={{ width: '90%', boxShadow: '1px 1px 1px 2px rgba(0,0,0,0.5)', borderRadius: '10px', padding: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', marginBottom: '20px', }}>
                      <span style={{ fontSize: '18px', fontWeight: '700' }}>Search all categories</span>
                      <span><FontAwesomeIcon icon={faClose} onClick={() => openModals(index, false)} style={{ cursor: 'pointer', fontSize: '18px' }} /></span>
                    </div>
                    {!pair.value || pair.options.length > 0 ? <div style={{ padding: '0 20px', }}><input type="text" id="search-input" placeholder="Enter a category name" style={{ width: '100%', fontSize: '15px', fontWeight: '400', margin: '0', outline: 'none', padding: '11px 36px 11px 14px', border: '2px solid #e7e5e8' }} /></div> : ''}
                    {
                      !pair.value || pair.options.length > 0 ?
                        <div role="list">
                          <div style={{ padding: '10px 20px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '800' }}>Level {pair.count}</span>
                            <hr />
                          </div>
                          <div style={{ padding: '10px 20px' }}>
                            {pair.options.map((cat) => (
                              <ul key={cat.id} style={{ listStyle: 'none', padding: '0' }}>
                                <li tabIndex="0" onClick={() => selectcategory(index, cat)} style={{ padding: '10px 0px', cursor: 'pointer' }}>
                                  <span>{cat.name}</span>
                                </li>
                              </ul>
                            ))}
                          </div>
                        </div> : ''
                    }
                    {pair.heirarchyLabel && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', alignItems: 'center', borderTop: '2px solid silver' }}>
                        <span>{pair.heirarchyLabel}</span>
                        <button aria-label="Remove selected category" type="button" onClick={() => removeCategory(index)} style={{ padding: '10px 20px', background: 'none', cursor: 'pointer', border: 'none' }}>
                          <FontAwesomeIcon className='fa' icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flex: '1 1', }}>
                <Textarea
                  style={{ width: '75%', }}
                  value={pair.description}
                  placeholder="Enter Description"
                  onChange={(e) => {
                    const newPairs = [...selectedPairs];
                    newPairs[index].description = e.target.value;
                    setSelectedPairs(newPairs);
                  }}
                />
              </div>
            </div>
          </Accordion.Panel>
          {index > 0 && (
            <B2BButton
              leftIcon={<IconTrash />}
              color="red"
              name="Remove"
              onClick={() => removePair(index)}
            />
          )}
        </Accordion.Item>
      ))}

      {_.size(categorys) > _.size(selectedPairs) && (
        <B2BButton
          leftIcon={<IconPlus />}
          name="Add Category"
          onClick={addNewPair}
        />
      )}

    </Accordion>
  );
};

export default EnrichmentHierarchy;