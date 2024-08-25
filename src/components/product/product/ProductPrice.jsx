import React, { useState, useEffect } from 'react';
import './ProductPrice.css';
import _ from 'lodash';

const ProductPrice = () => {
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
        if (markUpData.isMarkUp) {
            const margin = _.round((markUpData.costPrice * markUpData.markUpPercent) / 100);
            const sellingPrice = margin + Number(markUpData.costPrice);
            setMarkUpData(prev => ({
                ...prev,
                sellingPrice,
                mrp: sellingPrice,
                margin,
            }));
        }
    }, [markUpData.costPrice, markUpData.markUpPercent, markUpData.isMarkUp]);

    useEffect(() => {
        if (markDownData?.isMarkDown) {
            const margin = _.round((markDownData.mrp * markDownData.markDownPercent) / 100);
            const costPrice = Number(markDownData.mrp) - margin;
            setMarkDownData(prev => ({
                ...prev,
                costPrice,
                sellingPrice: markDownData.mrp,
                margin,
            }));
        }
    }, [markDownData.mrp, markDownData.markDownPercent, markDownData.isMarkDown]);

    const handleCheckboxChange = (type) => {
        if (type === 'markUp') {
            setMarkUpData(prev => ({
                ...prev,
                isMarkUp: !prev.isMarkUp,
            }));
            setMarkDownData({
                mrp: 0,
                markDownPercent: 0,
                costPrice: 0,
                sellingPrice: 0,
                margin: 0,
                isMarkDown: false,
            })
        }
        else if (type === 'markDown') {
            setMarkDownData(prev => ({
                ...prev,
                isMarkDown: !prev.isMarkDown,
            }));
            setMarkUpData({
                mrp: 0,
                markUpPercent: 0,
                costPrice: 0,
                sellingPrice: 0,
                margin: 0,
                isMarkUp: false,
            })
        }
    };

    const handleInputChange = (e, field) => {
        const value = Number(e.target.value);

        if (markUpData.isMarkUp && field !== 'mrp' && field !== 'markDownPercent') {
            setMarkUpData(prev => ({
                ...prev,
                [field]: value,
            }));
        }

        if (markDownData.isMarkDown && field !== 'costPrice' && field !== 'markUpPercent') {
            setMarkDownData(prev => ({
                ...prev,
                [field]: value,
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
                            <input type="checkbox" id="enableInputsCheckbox" checked={markDownData.isMarkDown} onChange={() => handleCheckboxChange('markDown')} />
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
