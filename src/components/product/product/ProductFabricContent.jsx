import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NumberInput } from '@mantine/core';
import { IconPercentage } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';
import './ProductFabricContent.css';

const FabricContent = () => {
    const { product, setProduct, handleChange, inputError, setInputError } = useContext(ProductContext);
    const [totalPercent, setTotalpercent] = useState(product?.totalProductPercent || 0)
    const [fabricContent, setFabricContent] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [], value: null }]);
    const [lastChild, setLastChild] = useState([]);
    const [fCCValue, setFCCValue] = useState('');
    const [fabricValue, setFabricValue] = useState([]);

    useEffect(() => {
        fetchVariant();
        setFCCValue(product?.fabricContent?.value)
        getfabricValues();
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
                    value: formattedFCC
                }
            }));
            setFCCValue(formattedFCC);
        } catch (error) {
            console.error("Error fetching category data: ", error);
        }
    };
    const handleSelectChange = (index, selectedValue) => {
        const newPairs = [...selectedPairs];
        const oldKey = newPairs[index].key;
        const oldvalue = parseInt(newPairs[index].value, 10) || 0;
        newPairs[index].key = selectedValue || '';
        newPairs[index].value = selectedValue ? newPairs[index].value : '';
        const newValue = parseInt(newPairs[index].value, 10) || 0;
        const updatedTotal = totalPercent - oldvalue + newValue;
        setTotalpercent(updatedTotal)
        setSelectedPairs(newPairs);
        setProduct(prevState => {
            const updatedComposition = { ...prevState.fabricContent.composition };
            if (oldKey && oldKey !== selectedValue) {
                delete updatedComposition[oldKey];
            }


            if (selectedValue) {
                updatedComposition[selectedValue] = newPairs[index].value || 0;
            }

            return {
                ...prevState, totalProductPercent: updatedTotal,
                fabricContent: {
                    ...prevState.fabricContent,
                    composition: updatedComposition
                }
            };
        });

        const pairsObject = newPairs.reduce((acc, pair) => {
            if (pair.key && pair.value) {
                acc[pair.key] = pair.value;
            }
            return acc;
        }, {});

        if (Object.keys(pairsObject).length > 0) {
            fabricContentCode(pairsObject);
            setFCCValue(prev => {
                const existingValues = prev ? prev.split(' ') : [];
                const newValues = Object.entries(pairsObject).map(([key, value]) => {
                    const fcc = keyToNameMap[key]?.substring(0, 3).toUpperCase() || '';
                    return `${fcc}-${value}%`;
                });
                const updatedValues = [...new Set([...existingValues, ...newValues])].join(' ');
                return updatedValues;
            });
        } else {
            setFCCValue('');
            setProduct(prevState => ({
                ...prevState,
                fabricContent: {
                    ...prevState.fabricContent,
                    value: ''
                }
            }));
        }
        setInputError(prev => ({
            ...prev,
            fabricCompositionError: false,
            fabricContentError: false,
            fabricContentErrorMessage: '',
        }));
    };
    const handleMultiSelectChange = (index, value) => {
        const newPairs = [...selectedPairs];
        const key = newPairs[index].key;
        const previousValue = parseInt(newPairs[index].value, 10) || 0;
        const updatedTotal = totalPercent - previousValue + value;


        if (key) {
            newPairs[index].value = value;
            setSelectedPairs(newPairs);
            setTotalpercent(updatedTotal);
            setProduct(prevState => ({
                ...prevState, totalProductPercent: updatedTotal,
                fabricContent: {
                    ...prevState.fabricContent,
                    composition: {
                        ...prevState.fabricContent.composition,
                        [key]: value
                    }
                }
            }));
            const pairsObject = newPairs.reduce((acc, pair) => {
                if (pair.key && pair.value) {
                    acc[pair.key] = pair.value;
                }
                return acc;
            }, {});
            fabricContentCode(pairsObject);
        }
        setInputError(prev => ({
            ...prev,
            fabricCompositionError: false,
            fabricContentError: false,
            fabricContentErrorMessage: '',
        }));
    };





    const addNewPair = () => {
        const totalSum = _.sumBy(selectedPairs, (item) => parseInt(item.value));
        if (totalSum < 100) {
            setSelectedPairs([...selectedPairs, { key: '', value: '' }]);
            setInputError(prev => ({
                ...prev,
                fabricCompositionError: false,
                fabricContentError: false,
                fabricContentErrorMessage: '',
            }));
        }
    };


    const removePair = (index, value) => {
        const newPairs = [...selectedPairs];
        const removedKey = newPairs[index].key;
        const updatedTotal = totalPercent - value;
        setTotalpercent(updatedTotal);
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
        const pairsObject = newPairs.reduce((acc, pair) => {
            if (pair.key && pair.value) {
                acc[pair.key] = pair.value;
            }
            return acc;
        }, {});
        fabricContentCode(pairsObject);
        setProduct(prevState => {
            const { [removedKey]: _, ...newComposition } = prevState.fabricContent.composition;
            return {
                ...prevState, totalProductPercent: updatedTotal,
                fabricContent: {
                    ...prevState.fabricContent,
                    composition: newComposition,
                    value: fCCValue
                }
            };
        });
    };


    const getfabricValues = async () => {
        try {
            const res = await B2B_API.get(`fabric`).json();
            setFabricValue(res?.response);
        } catch (error) {
            console.error("Error fetching fabric values: ", error);
        }
    };

    const Changehandler = (selectedValue) => {

        const selectedFabric = fabricValue.find(fabric => fabric.value === selectedValue);
        const selectedPairs = selectedFabric ? Object.entries(selectedFabric.composition) : [];

        setSelectedPairs(selectedPairs.map(([key, value]) => ({ key, value })));
        const totalSum = _.sumBy(selectedPairs, (item) => parseInt(item[1], 10) || 0);
        setTotalpercent(totalSum)
        const pairsObject = Object.fromEntries(selectedPairs);

        if (Object.keys(pairsObject).length > 0) {
            setProduct(prevState => ({
                ...prevState, totalProductPercent: totalSum,
                fabricContent: {
                    ...prevState.fabricContent,
                    composition: pairsObject
                }
            }));

            fabricContentCode(pairsObject);
        }
        if (Object.keys(pairsObject).length > 0) {
            fabricContentCode(pairsObject)

        } else {
            setFCCValue('');
            setSelectedPairs([{ key: '', values: [], value: null }])
            setProduct(prevState => ({
                ...prevState, totalProductPercent: 0,
                fabricContent: {
                    ...prevState.fabricContent,
                    composition: {},
                    value: ''
                }
            }));


        }
        setInputError(prev => ({
            ...prev,
            fabricCompositionError: false,
            fabricContentError: false,
            fabricContentErrorMessage: '',
        }));
    };

    return (
        <section className="fabric-content-section">
            <div className='fabric-content-inner-top'>
                <div>
                    <label className='fabric-label'>Fabric Content Code</label>
                    <B2BInput value={fCCValue} type='text' disabled='true' />
                </div>
                <div style={{ display: 'flex', alignItems: 'end' }}>
                    <label className='fabric-label'></label>
                    <B2BSelect
                        value={product?.fabricValue}
                        data={[...new Set(fabricValue.map(v => v?.value))]}
                        onChange={(e) => Changehandler(e)}
                        clearable={true}
                        placeholder={"Select FCC Combination"}
                    />

                </div>
            </div>
            <div className='fabric-content-inner-bottom'>
                <div className="fabric-content-g-row">
                    <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-4">
                        <label>
                            <span className="fabric-content-text-label">Fabric</span>
                            <span className="error-message"> *</span>
                        </label>
                    </div>
                    <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-8">
                        <label>
                            <span className="fabric-content-text-label">Composition(%)</span>
                            <span className="error-message"> *</span>
                        </label>
                    </div>
                </div>
                {selectedPairs.map((pair, index) => (
                    <div key={index} className="fabric-content-g-row">
                        <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-4">
                            <B2BSelect
                                value={selectedPairs[index]?.key || ''}
                                data={getAvailableKeys(index).map(key => ({ value: key, label: keyToNameMap[key] }))}
                                clearable={true}
                                onChange={(e) => handleSelectChange(index, e)}
                                error={inputError?.fabricContentError ? inputError?.fabricContentError : null}
                            />
                        </div>
                        <div className="fabric-content-g-col fabric-content-g-s-6 fabric-content-g-m-8 fabric-content-mb2" style={{ display: 'flex' }}>
                            <NumberInput
                                value={pair.value || 0}
                                required={true}
                                disabled={!pair.key}
                                clearable={true}
                                className='input-textField'
                                max={100}
                                styles={{ input: { fontSize: '14px' } }}
                                onChange={(e) => handleMultiSelectChange(index, e)}
                                rightSection={<IconPercentage size={20} />}
                                error={inputError?.fabricContentErrorMessage}
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="fabric-content-btn fabric-content-btn--icon-no fabric-content-ml2"
                                    onClick={() => removePair(index, pair.value)}
                                >
                                    <FontAwesomeIcon className="fa fabric-content-icon" icon={faTrash} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <div className="fabric-content-g-row">
                    {totalPercent < 100 && (
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
                <div>
                    <p className='fabric-label'>Overal Composition Percentage:  {totalPercent}</p>
                    {inputError?.fabricCompositionError && (
                        <p className='error-message'>
                            {inputError.fabricCompositionErrorMessage}
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};

export default FabricContent;