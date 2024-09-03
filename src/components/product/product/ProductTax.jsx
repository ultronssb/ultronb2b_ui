import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import { ProductContext } from './CreateProduct';

const ProductTaxSelect = () => {
    const { product, handleChange } = useContext(ProductContext);
    const [tax, setTax] = useState([]);

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
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductTaxSelect;








// import React, { useContext, useEffect, useState } from 'react';
// import { B2B_API } from '../../../api/Interceptor';
// import B2BSelect from '../../../common/B2BSelect';
// import { ProductContext } from './CreateProduct';

// const ProductTaxSelect = () => {

//     const { product: product, handleChange: handleChange } = useContext(ProductContext)
//     const [tax, setTax] = useState([]);
//     // To display the gstRate values in the select field, convert the integer values to string format since the select field requires string values to be shown
//     const [gstRate, setGstRate] = useState([]);


//     useEffect(() => {
//         getAllTax()
//     }, []);

//     const getAllTax = async () => {
//         try {
//             const res = await B2B_API.get(`gst`).json();
//             setTax(res.response);
//             const extractedRates = res.response?.map(item => item.gstRate.toString() + ' %');
//             setGstRate(extractedRates);
//         } catch (err) {
//             console.error("Failed to fetch Gst", err);
//         }
//     };

//     const concatPercent = (tax) => {
//         const taxValue = tax.toString() + ' %'
//         return taxValue;
//     }

//     return (
//         <div className="vd-g-col vd-g-s-12">
//             <label>
//                 <span className="vd-text-label vd-util-text-overflow-break-word vd-label">
//                     Product Tax
//                 </span>
//             </label>
//             <div className="vd-popover-tether-target-wrapper vd-popover-tether-target vd-popover-tether-abutted vd-popover-tether-abutted-left vd-popover-tether-element-attached-left vd-popover-tether-target-attached-left vd-popover-tether-pinned vd-popover-tether-pinned-top">
//                 <div>
//                     <B2BSelect
//                         styles={{ option: { fontSize: '13px' }, input: { fontSize: '13px' } }}
//                         value={Number.isInteger(product?.gstId) ? concatPercent(product?.gstId) : product?.gstId}
//                         data={gstRate}
//                         leftSectionPointerEvents="none"
//                         leftSection={<span style={{ fontSize: '14px', fontWeight: '500' }}>GST </span>}
//                         required={true}
//                         placeholder={"%"}
//                         clearable={true}
//                         onChange={(event) => handleChange(event, "gstId")}
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ProductTaxSelect;
