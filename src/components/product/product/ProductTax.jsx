import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';

const ProductTaxSelect = () => {

    const { product: product, handleChange: handleChange } = useContext(ProductContext)
    const [tax, setTax] = useState([]);
    // To display the gstRate values in the select field, convert the integer values to string format since the select field requires string values to be shown
    const [gstRate, setGstRate] = useState([]);


    useEffect(() => {
        // getAllTas(); Spelling Mistake
        getAllTax()
    }, []);

    const getAllTax = async () => {
        try {
            const res = await B2B_API.get(`gst`).json();
            setTax(res.response);
            const extractedRates = res.response?.map(item => item.gstRate.toString() + ' %');
            setGstRate(extractedRates);
        } catch (err) {
            console.error("Failed to fetch Gst", err);
        }
    };

    const concatPercent = (tax) => {
        const taxValue = tax.toString() + ' %'
        return taxValue;
    }

    return (
        <div className="vd-g-col vd-g-s-12">
            <label>
                <span className="vd-text-label vd-util-text-overflow-break-word vd-label">
                    Product Tax
                </span>
            </label>
            <div className="vd-popover-tether-target-wrapper vd-popover-tether-target vd-popover-tether-abutted vd-popover-tether-abutted-left vd-popover-tether-element-attached-left vd-popover-tether-target-attached-left vd-popover-tether-pinned vd-popover-tether-pinned-top">
                <div>
                    <B2BSelect
                        styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
                        value={Number.isInteger(product?.gst) ? concatPercent(product?.gst) : product?.gst}
                        data={gstRate}
                        leftSectionPointerEvents="none"
                        leftSection={<span style={{ fontSize: '14px', fontWeight: '500' }}>GST </span>}
                        required={true}
                        placeholder={"%"}
                        clearable={true}
                        onChange={(value) => handleChange(value, "gst")}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductTaxSelect;
