import React, { useState, useEffect, useContext } from 'react';
import './ProductPrice.css';
import _ from 'lodash';
import { ProductContext } from './CreateProduct';

const ProductPrice = () => {
    const { product, handleChange, setProduct } = useContext(ProductContext);
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

        if (markUpData.isMarkUp && field !== 'mrp' && field !== 'markDownPercent') {
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
        <section className="helios-c-PJLV vd-section">
            <div className="helios-c-PJLV vd-section-wrap">
                <h2 className="vd-text-sub-heading vd-mb4" role="heading" aria-level="2">Price</h2>
                <div className="vd-g-row">
                    {/* Mark Up Section */}
                    <div className="vd-g-col vd-g-s-12 vd-g-m-9">
                        <div className='input-check'>
                            <input type="checkbox" id="enableInputsCheckbox" checked={markUpData.isMarkUp} onChange={() => handleCheckboxChange('markUp')} />
                            <div className="vd-text-signpost vd-util-text-overflow-break-word vd-mb6">Mark Up</div>
                        </div>
                        <div className='table-container'>
                            <table className="vd-table-list">
                                <thead>
                                    <tr className="vd-table-list-row vd-table-list-row--header">
                                        <th className="vd-table-list-head-cell">Cost Price</th>
                                        <th className="vd-table-list-head-cell">Markup %</th>
                                        <th className="vd-table-list-head-cell">Selling Price</th>
                                        <th className="vd-table-list-head-cell">MRP</th>
                                        <th className="vd-table-list-head-cell">Margin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="vd-table-list-cell">
                                            <input className={!markUpData.isMarkUp ? "input-disable" : "vd-input vd-align-right"} disabled={!markUpData.isMarkUp} type="number" value={markUpData.costPrice || ''} onChange={(e) => handleInputChange(e, 'costPrice')} placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className={!markUpData.isMarkUp ? "input-disable" : "vd-input vd-align-right"} disabled={!markUpData.isMarkUp} type="number" value={markUpData.markUpPercent || ''} onChange={(e) => handleInputChange(e, 'markUpPercent')} placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className="input-disable" disabled={true} type="number" value={markUpData.sellingPrice || ''} readOnly placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className="input-disable" disabled={true} type="number" value={markUpData.mrp || ''} readOnly placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className="input-disable" disabled={true} type="number" value={markUpData.margin || ''} readOnly placeholder="0.00" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mark Down Section */}
                    <div className="vd-g-col vd-g-s-12 vd-g-m-9">
                        <div className='input-check'>
                            <input type="checkbox" id="enableInputsCheckbox2" checked={markDownData.isMarkDown} onChange={() => handleCheckboxChange('markDown')} />
                            <div className="vd-text-signpost vd-util-text-overflow-break-word vd-mb6">Mark Down</div>
                        </div>
                        <div className='table-container'>
                            <table className="vd-table-list">
                                <thead>
                                    <tr className="vd-table-list-row vd-table-list-row--header">
                                        <th className="vd-table-list-head-cell">MRP</th>
                                        <th className="vd-table-list-head-cell">Markdown %</th>
                                        <th className="vd-table-list-head-cell">Cost Price</th>
                                        <th className="vd-table-list-head-cell">Selling Price</th>
                                        <th className="vd-table-list-head-cell">Margin</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="vd-table-list-cell">
                                            <input className={!markDownData.isMarkDown ? "input-disable" : "vd-input vd-align-right"} disabled={!markDownData.isMarkDown} type="number" value={markDownData.mrp || ''} onChange={(e) => handleInputChange(e, 'mrp')} placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className={!markDownData.isMarkDown ? "input-disable" : "vd-input vd-align-right"} disabled={!markDownData.isMarkDown} type="number" value={markDownData.markDownPercent || ''} onChange={(e) => handleInputChange(e, 'markDownPercent')} placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className="input-disable" disabled={true} type="number" value={markDownData.costPrice || ''} readOnly placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className="input-disable" disabled={true} type="number" value={markDownData.sellingPrice || ''} readOnly placeholder="0.00" />
                                        </td>
                                        <td className="vd-table-list-cell">
                                            <input className="input-disable" disabled={true} type="number" value={markDownData.margin || ''} readOnly placeholder="0.00" />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductPrice;
