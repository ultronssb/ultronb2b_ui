import React, { useContext, useEffect, useState } from 'react';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';
import { createB2BAPI } from '../../../api/Interceptor';

const ProductTaxSelect = () => {
    const { product, handleChange, inputError } = useContext(ProductContext);
    const [tax, setTax] = useState([]);
    const B2B_API = createB2BAPI();


    useEffect(() => {
        getAllTax();
    }, []);

    const getAllTax = async () => {
        try {
            const res = await B2B_API.get('gst').json();
            setTax(res.response);
        } catch (err) {
            console.error("Failed to fetch GST rates", err);
        }
    };

    return (
        <div className="vd-g-col vd-g-s-12">
            <label>
                <span className="vd-text-label vd-util-text-overflow-break-word vd-label">
                    Product Tax
                </span>
                <span className="error-message"> *</span>
            </label>
            <div className="vd-popover-tether-target-wrapper vd-popover-tether-target vd-popover-tether-abutted vd-popover-tether-abutted-left vd-popover-tether-element-attached-left vd-popover-tether-target-attached-left vd-popover-tether-pinned vd-popover-tether-pinned-top">
                <div>
                    <B2BSelect
                        styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
                        value={product?.gstId || ''}
                        data={tax.map(t => ({ value: t.gstId, label: `${t.gstRate} %` }))}
                        leftSectionPointerEvents="none"
                        leftSection={<span style={{ fontSize: '14px', fontWeight: '500' }}>Gst </span>}
                        required
                        clearable
                        onChange={(event) => handleChange(event, 'gstId')}
                        error={inputError?.gstError ? inputError.gstErrorMessage : ""}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductTaxSelect;
