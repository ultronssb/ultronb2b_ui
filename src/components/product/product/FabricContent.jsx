import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconPercentage } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';
import './FabricContent.css';

const FabricContent = () => {
    const { product, setProduct, handleChange, inputError, setInputError } = useContext(ProductContext);

    const [fabricContent, setFabricContent] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [], value: null }]);
    const [lastChild, setLastChild] = useState([]);
    const [fCCValue, setFCCValue] = useState('');

    useEffect(() => {
        fetchVariant();
        setFCCValue(product?.fabricContent?.value)
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
        const keys = Object.keys(fabricContent?.composition)
        if (_.size(keys) > 0) {
            setSelectedPairs(_.map(keys, key => {
                return {
                    "key": key,
                    "value": fabricContent?.composition[key]
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

        // clear FCC Error Message
        setInputError(prev => ({
            ...prev,
            fabricContentError: false,
            fabricContentErrorMessage: '',
        }));

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
                    [key]: value
                }
            }
        }));
        const pairsObject = newPairs.reduce((acc, pair) => {
            acc[pair.key] = pair.value;
            return acc;
        }, {});
        fabricContentCode(pairsObject);
        setInputError("")
    };
    const fabricContentCode = async (newPairs) => {
        try {
            const results = await Promise.all(
                Object.entries(newPairs).map(async ([key, value]) => {
                    const res = await B2B_API.get(`product-category/category/${key}`).json();
                    const name = res.response.name;
                    const fcc = name.substring(0, 3).toUpperCase();
                    return `${fcc}-${value}%`;
                })
            );
            const formattedFCC = results.join(' ');
            setProduct(prevState => ({
                ...prevState,
                fabricContent: {
                    ...prevState.fabricContent,
                   value:formattedFCC
                }
            }));
            setFCCValue(formattedFCC)
        } catch (error) {
            console.error("Error fetching category data: ", error);
        }
    };

    const addNewPair = () => {
        setSelectedPairs([...selectedPairs, { key: '', values: [] }]);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        const key = newPairs[index].key
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
        const pairsObject = newPairs.reduce((acc, pair) => {
            acc[pair.key] = pair.value;
            return acc;
        }, {});
        fabricContentCode(pairsObject)
        setProduct(prevState => {
            const { [key]: _, ...newComposition } = prevState.fabricContent.composition;

            return {
                ...prevState,
                fabricContent: {
                    ...prevState.fabricContent,
                    composition: newComposition,
                    value:fCCValue
                }
            };
        });
    };

    return (
        <section className="fabric-content-section">
            <div className='fabric-content-inner-top'>
                <label className='fabric-label'>Fabric Content Code</label>
                <B2BInput value={fCCValue} type='text' disabled='true' />
            </div>
            <div className='fabric-content-inner-bottom'>
                <div className="fabric-content-g-row">
                    <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-4">
                        <label>
                            <span className="fabric-content-text-label">Fabric</span>
                        </label>
                    </div>
                    <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-8">
                        <label>
                            <span className="fabric-content-text-label">Composition(%)</span>
                        </label>
                    </div>
                </div>
                {selectedPairs.map((pair, index) => (
                    <div key={index} className="fabric-content-g-row">
                        <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-4">
                            <B2BSelect
                                value={selectedPairs[index].key}
                                data={getAvailableKeys(index).map(key => ({ value: key, label: keyToNameMap[key] }))}
                                clearable={true}
                                onChange={(e) => handleSelectChange(index, e)}
                                error={inputError?.fabricContentError ? inputError?.fabricContentError : null}
                            />
                        </div>
                        <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-8 fabric-content-mb2" style={{ display: 'flex' }}>
                            <B2BInput
                                value={pair.value}
                                required={true}
                                type="number"
                                disabled={!pair.key}
                                onChange={(e) => handleMultiSelectChange(index, e)}
                                rightSection={<IconPercentage size={20} />}
                                error={inputError?.fabricContentErrorMessage}
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="fabric-content-btn fabric-content-btn--icon-no fabric-content-ml2"
                                    onClick={() => removePair(index)}
                                >
                                    <FontAwesomeIcon className="fa fabric-content-icon" icon={faTrash} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="fabric-content-g-row">
                    {_.size(lastChild) > _.size(selectedPairs) && (
                        <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-4">
                            <button
                                type="button"
                                className="fabric-content-btn fabric-content-btn--text-go"
                                onClick={addNewPair}
                            >
                                <FontAwesomeIcon className="fa fabric-content-icon fabric-content-mr2" icon={faPlus} />
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





