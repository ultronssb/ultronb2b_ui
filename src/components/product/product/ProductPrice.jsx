import { Fieldset } from '@mantine/core';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { ProductContext } from './CreateProduct';
import './ProductPrice.css';
import ProductTaxSelect from './ProductTax';

const ProductPrice = () => {
    const { product, handleChange, setProduct, inputError, setInputError } = useContext(ProductContext);
    const [markUpData, setMarkUpData] = useState({
        costPrice: 0,
        markUpPercent: 0,
        sellingPrice: 0,
        mrp: 0,
        margin: 0,
        isMarkUp: false,
    });

    const [markDownData, setMarkDownData] = useState({
        mrp: 0,
        markDownPercent: 0,
        costPrice: 0,
        sellingPrice: 0,
        margin: 0,
        isMarkDown: false,
    });

    useEffect(() => {
        const { priceSetting } = product || {};

        if (priceSetting?.isMarkUp) {
            setMarkUpData({
                costPrice: priceSetting.costPrice || 0,
                markUpPercent: priceSetting.markUpPercent || 0,
                sellingPrice: priceSetting.sellingPrice || 0,
                mrp: priceSetting.mrp || 0,
                margin: priceSetting.margin || 0,
                isMarkUp: true,
            });
        }

        if (priceSetting?.isMarkDown) {
            setMarkDownData({
                mrp: priceSetting.mrp || 0,
                markDownPercent: priceSetting.markDownPercent || 0,
                costPrice: priceSetting.costPrice || 0,
                sellingPrice: priceSetting.sellingPrice || 0,
                margin: priceSetting.margin || 0,
                isMarkDown: true,
            });
        }
    }, [product]);

    useEffect(() => {
        if (markUpData.isMarkUp) {
            const margin = _.round((markUpData.costPrice * markUpData.markUpPercent) / 100);
            const sellingPrice = margin + Number(markUpData.costPrice);
            const updatedData = {
                ...markUpData,
                sellingPrice,
                mrp: sellingPrice,
                margin,
            };
            setMarkUpData(updatedData);
            setProduct(prev => ({
                ...prev,
                priceSetting: {
                    ...prev.priceSetting,
                    ...updatedData,
                },
            }));
        }
    }, [markUpData.costPrice, markUpData.markUpPercent, markUpData.isMarkUp]);

    useEffect(() => {
        if (markDownData.isMarkDown) {
            const margin = _.round((markDownData.mrp * markDownData.markDownPercent) / 100);
            const costPrice = Number(markDownData.mrp) - margin;
            const updatedData = {
                ...markDownData,
                costPrice,
                sellingPrice: markDownData.mrp,
                margin,
            };
            setMarkDownData(updatedData);
            setProduct(prev => ({
                ...prev,
                priceSetting: {
                    ...prev.priceSetting,
                    ...updatedData,
                },
            }));
        }
    }, [markDownData.mrp, markDownData.markDownPercent, markDownData.isMarkDown]);

    const handleCheckboxChange = (type) => {
        setInputError(""); // Clear any existing errors

        if (type === 'markUp') {
            const isMarkUpEnabled = !markUpData.isMarkUp;
            setMarkUpData(prev => ({
                ...prev,
                isMarkUp: isMarkUpEnabled,
            }));
            setMarkDownData({
                mrp: 0,
                markDownPercent: 0,
                costPrice: 0,
                sellingPrice: 0,
                margin: 0,
                isMarkDown: false,
            });
            setProduct(prev => ({
                ...prev,
                priceSetting: {
                    ...prev.priceSetting,
                    isMarkUp: isMarkUpEnabled,
                    isMarkDown: false,
                    costPrice: 0,
                    markUpPercent: 0,
                    sellingPrice: 0,
                    mrp: 0,
                    margin: 0,
                },
            }));
        } else if (type === 'markDown') {
            const isMarkDownEnabled = !markDownData.isMarkDown;
            setMarkDownData(prev => ({
                ...prev,
                isMarkDown: isMarkDownEnabled,
            }));
            setMarkUpData({
                costPrice: 0,
                markUpPercent: 0,
                sellingPrice: 0,
                mrp: 0,
                margin: 0,
                isMarkUp: false,
            });
            setProduct(prev => ({
                ...prev,
                priceSetting: {
                    ...prev.priceSetting,
                    isMarkDown: isMarkDownEnabled,
                    isMarkUp: false,
                    costPrice: 0,
                    markDownPercent: 0,
                    sellingPrice: 0,
                    mrp: 0,
                    margin: 0,
                },
            }));
        }
    };


    const handleInputChange = (e, field) => {
        const value = Number(e.target.value);

        // Clear previous errors when input changes
        setInputError("");

        if (markUpData.isMarkUp && field !== 'mrp' && field !== 'markDownPercent') {
            // Validate required fields
            if (field === 'markUpPercent' && !value) {
                setInputError({ priceSettingsError: true, priceSettingsErrorMessage: "Markup percentage is required." });
                return;
            }

            setMarkUpData(prev => ({
                ...prev,
                [field]: value,
            }));
            setProduct(prev => ({
                ...prev,
                priceSetting: {
                    ...prev.priceSetting,
                    [field]: value,
                },
            }));
        }

        if (markDownData.isMarkDown && field !== 'costPrice' && field !== 'markUpPercent') {
            // Validate required fields
            if (field === 'markDownPercent' && !value) {
                setInputError({ priceSettingsError: true, priceSettingsErrorMessage: "Discount percentage is required." });
                return;
            }

            setMarkDownData(prev => ({
                ...prev,
                [field]: value,
            }));
            setProduct(prev => ({
                ...prev,
                priceSetting: {
                    ...prev.priceSetting,
                    [field]: value,
                },
            }));
        }
    };

    return (
        <section className="helios-c-PJLV product-price-section">
            <div className="helios-c-PJLV product-price-section-wrap">
                <ProductTaxSelect />
                <Fieldset legend='Price'>
                    <div className="product-price-g-row">
                        {inputError?.priceSettingsError && (
                            <div className="error-message">
                                {inputError?.priceSettingsErrorMessage}
                            </div>
                        )}

                        {/* Mark Up Section */}
                        <div className="product-price-g-col product-price-g-s-12 product-price-g-m-9">
                            <div className='input-check'>
                                <input
                                    type="checkbox"
                                    id="enableInputsCheckbox"
                                    checked={markUpData.isMarkUp}
                                    onChange={() => handleCheckboxChange('markUp')}
                                />
                                <div className="product-price-text-signpost product-price-util-text-overflow-break-word product-price-mb6">
                                    Mark Up
                                    <span className="error-message"> *</span>
                                </div>
                            </div>
                            <div className='table-container'>
                                <table className="product-price-table-list">
                                    <thead>
                                        <tr className="product-price-table-list-row product-price-table-list-row--header">
                                            <th className="product-price-table-list-head-cell">Cost Price
                                                <span className="error-message"> *</span>
                                            </th>
                                            <th className="product-price-table-list-head-cell">Markup %
                                                <span className="error-message"> *</span>
                                            </th>
                                            <th className="product-price-table-list-head-cell">Selling Price</th>
                                            <th className="product-price-table-list-head-cell">MRP</th>
                                            <th className="product-price-table-list-head-cell">Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className={!markUpData.isMarkUp ? "input-disable" : "product-price-input product-price-align-right"}
                                                    disabled={!markUpData.isMarkUp}
                                                    type="number"
                                                    value={markUpData.costPrice || ''}
                                                    onChange={(e) => handleInputChange(e, 'costPrice')}
                                                    placeholder="0.00"
                                                />
                                                {inputError?.costPriceError && (
                                                    <div className="error-message">
                                                        {inputError?.costPriceErrorMessage}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className={!markUpData.isMarkUp ? "input-disable" : "product-price-input product-price-align-right"}
                                                    disabled={!markUpData.isMarkUp}
                                                    type="number"
                                                    value={markUpData.markUpPercent || ''}
                                                    onChange={(e) => handleInputChange(e, 'markUpPercent')}
                                                    placeholder="0.00"
                                                />
                                                {inputError?.markUpPercentError && (
                                                    <div className="error-message">
                                                        {inputError?.markUpPercentErrorMessage}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className="input-disable"
                                                    disabled
                                                    type="number"
                                                    value={markUpData.sellingPrice || ''}
                                                    readOnly
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className="input-disable"
                                                    disabled
                                                    type="number"
                                                    value={markUpData.mrp || ''}
                                                    readOnly
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className="input-disable"
                                                    disabled
                                                    type="number"
                                                    value={markUpData.margin || ''}
                                                    readOnly
                                                    placeholder="0.00"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mark Down Section */}
                        <div className="product-price-g-col product-price-g-s-12 product-price-g-m-9">
                            <div className='input-check'>
                                <input
                                    type="checkbox"
                                    id="enableInputsCheckbox"
                                    checked={markDownData.isMarkDown}
                                    onChange={() => handleCheckboxChange('markDown')}
                                />
                                <div className="product-price-text-signpost product-price-util-text-overflow-break-word product-price-mb6">
                                    Mark Down
                                </div>
                            </div>
                            <div className='table-container'>
                                <table className="product-price-table-list">
                                    <thead>
                                        <tr className="product-price-table-list-row product-price-table-list-row--header">
                                            <th className="product-price-table-list-head-cell">MRP
                                                <span className="error-message"> *</span>
                                            </th>
                                            <th className="product-price-table-list-head-cell">Discount %
                                                <span className="error-message"> *</span>
                                            </th>
                                            <th className="product-price-table-list-head-cell">Cost Price</th>
                                            <th className="product-price-table-list-head-cell">Selling Price</th>
                                            <th className="product-price-table-list-head-cell">Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className={!markDownData.isMarkDown ? "input-disable" : "product-price-input product-price-align-right"}
                                                    disabled={!markDownData.isMarkDown}
                                                    type="number"
                                                    value={markDownData.mrp || ''}
                                                    onChange={(e) => handleInputChange(e, 'mrp')}
                                                    placeholder="0.00"
                                                />
                                                {inputError?.mrpError && (
                                                    <div className="error-message">
                                                        {inputError?.mrpErrorMessage}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className={!markDownData.isMarkDown ? "input-disable" : "product-price-input product-price-align-right"}
                                                    disabled={!markDownData.isMarkDown}
                                                    type="number"
                                                    value={markDownData.markDownPercent || ''}
                                                    onChange={(e) => handleInputChange(e, 'markDownPercent')}
                                                    placeholder="0.00"
                                                />
                                                {inputError?.markDownPercentError && (
                                                    <div className="error-message">
                                                        {inputError?.markDownPercentErrorMessage}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className="input-disable"
                                                    disabled
                                                    type="number"
                                                    value={markDownData.costPrice || ''}
                                                    readOnly
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className="input-disable"
                                                    disabled
                                                    type="number"
                                                    value={markDownData.sellingPrice || ''}
                                                    readOnly
                                                    placeholder="0.00"
                                                />
                                            </td>
                                            <td className="product-price-table-list-cell">
                                                <input
                                                    className="input-disable"
                                                    disabled
                                                    type="number"
                                                    value={markDownData.margin || ''}
                                                    readOnly
                                                    placeholder="0.00"
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </Fieldset>
            </div>
        </section>
    );
};

export default ProductPrice;

