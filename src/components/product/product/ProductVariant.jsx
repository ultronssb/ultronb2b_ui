import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MultiSelect } from '@mantine/core';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';
import './ProductVariant.css';

const ProductVariant = () => {
    const { product, setProduct, handleChange, inputError, setInputError } = useContext(ProductContext);

    const [attributes, setAttributes] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [] }]);
    useEffect(() => {
        fetchVariant();
    }, []);

    const fetchVariant = async () => {
        try {
            const response = await B2B_API.get('variant').json();
            const groupedVariants = _.groupBy(response.response, 'name');
            setAttributes(groupedVariants);
            setSelectedPairsFromProduct();
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const setSelectedPairsFromProduct = () => {
        const { prodVariants } = product;
        const keys = Object.keys(prodVariants);
        if (_.size(keys) > 0) {
            const pairs = keys.map(key => ({
                key,
                values: Array.from(new Set(prodVariants[key]))
            }));
            console.log(selectedPairs)
            setSelectedPairs(pairs);
        }
    };

    const handleSelectChange = (index, selectedValue) => {
        const newPairs = [...selectedPairs];
        const oldKey = newPairs[index].key;
        newPairs[index].key = selectedValue || '';
        if (!selectedValue) {
            newPairs[index].values = [];
        }

        setSelectedPairs(newPairs);

        setProduct(prevState => {
            const updatedProdVariants = { ...prevState.prodVariants };
            if (oldKey && oldKey !== selectedValue) {
                delete updatedProdVariants[oldKey];
            }


            if (selectedValue) {
                updatedProdVariants[selectedValue] = newPairs[index].values || 0;
            }

            return {
                ...prevState,
                prodVariants: updatedProdVariants
            };
        });
    };
    const handleMultiSelectChange = (index, selectedValues) => {
        const newPairs = [...selectedPairs];
        newPairs[index].values = selectedValues;
        setSelectedPairs(newPairs);

        const updatedVariants = { ...product.prodVariants };
        updatedVariants[newPairs[index].key] = selectedValues;
        setProduct(prev => ({ ...prev, prodVariants: updatedVariants }));
    };

    const addNewPair = () => {
        setSelectedPairs([...selectedPairs, { key: '', values: [] }]);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        const removedPairKey = newPairs[index].key;
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
        const updatedVariants = { ...product.prodVariants };
        delete updatedVariants[removedPairKey];

        setProduct(prev => ({ ...prev, prodVariants: updatedVariants }));
    };

    const getAvailableKeys = (currentIndex) => {
        const selectedKeys = selectedPairs.map(pair => pair.key);
        return Object.keys(attributes).filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
    };

    return (
        <section className="product-variant-section">
            <div className="product-variant-section-wrap">
                <div className="product-variant-g-row">
                    <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-9">
                        <div>
                            <div className="product-variant-g-row">
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                    <label>
                                        <span className="product-variant-text-label">Variant Name (e.g. colour)</span>
                                        <span className="error-message"> *</span>
                                    </label>
                                </div>
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8">
                                    <label>
                                        <span className="product-variant-text-label">Value (e.g. Green)</span>
                                        <span className="error-message"> *</span>
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
                                                            clearable={true}
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
                                                    <MultiSelect
                                                        style={{ width: '100%' }}
                                                        data={Array.isArray(attributes[pair.key])
                                                            ? attributes[pair.key].map(item => ({ value: item.id, label: item.value }))
                                                            : []}
                                                        onChange={(values) => handleMultiSelectChange(index, values)}
                                                        value={Array.isArray(pair.values) ? pair.values : []}
                                                        clearable={true}
                                                    />
                                                </div>
                                            </div>
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
                                </div>
                            ))}
                            <div className="product-variant-g-row">
                                {_.size(attributes) > _.size(selectedPairs) && (
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
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductVariant;


