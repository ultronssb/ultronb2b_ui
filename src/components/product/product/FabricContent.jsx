import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import B2BInput from '../../../common/B2BInput';
import { ProductContext } from './CreateProduct';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

const FabricContent = () => {
    const { product, setProduct, handleChange } = useContext(ProductContext);

    console.log(product);


    const [fabricContent, setFabricContent] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [], value: null }]);
    const [lastChild, setLastChild] = useState([]);
    const [value, setValue] = useState();
    const [fCCValue, setFCCValue] = useState('')

    console.log(selectedPairs);


    useEffect(() => {
        fetchVariant();
    }, []);

    useEffect(() => {
        if (fabricContent) {
            const emptyNodes = findEmptyChildNodes(fabricContent);
            setLastChild(emptyNodes);
        }
    }, [fabricContent]);

    const fetchVariant = async () => {
        try {
            const res = await B2B_API.get('product-category').json();
            const categories = res.response;
            const category = categories.find(cat => cat.name === 'Fabric Content');
            setFabricContent(category);
            setSelectedPairsFromProduct()
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const setSelectedPairsFromProduct = () => {
        const { fabricContent } = product
        const keys = Object.keys(fabricContent.composition)
        if (_.size(keys) > 0) {
            setSelectedPairs(_.map(keys, key => {
                return {
                    "key": key,
                    "value": fabricContent.composition[key]
                }
            }))
        }
    }

    function findEmptyChildNodes(node) {
        const result = [];
        function traverse(node) {
            if (node && node.child && node.child.length === 0) {
                result.push(node);
            }
            if (node && node.child) {
                node.child.forEach(traverse);
            }
        }
        traverse(node);
        return result;
    }

    const keyToNameMap = lastChild.reduce((map, item) => {
        map[item.categoryId] = item.name;
        return map;
    }, {});

    const getAvailableKeys = (currentIndex) => {
        const selectedKeys = selectedPairs.map(pair => pair.key);
        return Object.keys(keyToNameMap).filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
    };

    const handleSelectChange = (index, e) => {
        const newPairs = [...selectedPairs];
        newPairs[index].key = e;
        setSelectedPairs(newPairs);
    };

    const handleMultiSelectChange = (index, e) => {
        const newPairs = [...selectedPairs];
        const value = e.target.value
        newPairs[index].value = value;
        const key = newPairs[index].key;
        setSelectedPairs(newPairs)
        setProduct(prevState => ({
            ...prevState,
            fabricContent: {
                ...prevState.fabricContent,
                composition: {
                    ...prevState.fabricContent.composition,
                    [key]: value  // Replace with your key-value pair
                }
            }
        }));
    };

    const addNewPair = () => {
        setSelectedPairs([...selectedPairs, { key: '', values: [] }]);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        const key = newPairs[index].key
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
        setProduct(prevState => {
            const { [key]: _, ...newComposition } = prevState.fabricContent.composition;

            return {
                ...prevState,
                fabricContent: {
                    ...prevState.fabricContent,
                    composition: newComposition
                }
            };
        });
    };

    return (
        <section className="product-variant-section" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <B2BInput
                    value={fCCValue}
                    type='text'
                    disabled='true'
                />
            </div>
            <div>
                {selectedPairs.map((pair, index) => (
                    <div key={index} className="product-variant-g-row" style={{ marginLeft: '0px' }}>
                        <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                            <B2BSelect
                                value={selectedPairs[index].key}
                                data={getAvailableKeys(index).map(key => ({ value: key, label: keyToNameMap[key] }))}
                                clearable={true}
                                onChange={(e) => handleSelectChange(index, e)}
                            />
                        </div>
                        <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8 product-variant-mb2" style={{ display: 'flex' }}>
                            <B2BInput
                                value={pair.value}
                                required="true"
                                type="number"
                                disabled={!pair.key}
                                onChange={(e) => handleMultiSelectChange(index, e)}
                            />
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
                ))}
                <div className="product-variant-g-row">
                    {_.size(lastChild) > _.size(selectedPairs) && (
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
        </section>
    );
};

export default FabricContent;
