// import React, { useContext, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { ActiveTabContext } from '../../../layout/Layout';
// import { ProductContext } from './CreateProduct';

// const ProductDimension = () => {
//     const { stateData, inputError } = useContext(ActiveTabContext);

//     const { product, handleChange, setProduct, setImageFile, imageFile } = useContext(ProductContext);
//     const resetRef = useRef(null);
//     const navigate = useNavigate();


//     const json = [
//         {
//             label: "Thickness",
//             type: "number",
//             placeholder: "In mm",
//             value: product.metrics?.thickness || '',
//             onChange: (event) => handleChange(event, "metrics.thickness"),
//         },
//         {
//             label: "Width",
//             type: "number",
//             placeholder: "In Inches",
//             value: product.metrics?.width || '',
//             onChange: (event) => handleChange(event, "metrics.width"),
//         },
//         {
//             label: "Weight",
//             type: "number",
//             placeholder: "In gsm",
//             value: product.metrics?.weight || '',
//             onChange: (event) => handleChange(event, "metrics.weight"),
//         }
//     ];

//     return (
//         // <form className='form-container' style={{ display: 'flex', gap: '5rem', justifyContent: 'center' }}>
//         //     {json.map((field, index) => (
//         //         <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
//         //             <label style={{ fontSize: '16px', fontWeight: '800' }}>{field.label}</label>
//         //             {
//         //                 field.type === 'number' && (
//         //                     <input
//         //                         value={field.value}
//         //                         className='form-input'
//         //                         style={field.style}
//         //                         onChange={field.onChange}
//         //                         type={field.type}
//         //                         required={field.required}
//         //                         placeholder={field.placeholder}
//         //                     />

//         //                 )
//         //             }
//         //             {inputError?.matricError && (
//         //                 <div className="error-message">{inputError?.metricErrorMessage}</div>
//         //             )}
//         //         </div>
//         //     ))}
//         // </form>
//         <ProductContext.Provider value={{ product, handleChange, setProduct, setImageFile, imageFile }}>
//             <form className='form-container' style={{ display: 'flex', gap: '5rem', justifyContent: 'center' }}>
//                 {json.map((field, index) => (
//                     <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
//                         <label style={{ fontSize: '16px', fontWeight: '800' }}>{field.label}</label>
//                         <input
//                             value={field.value}
//                             className={`form-input ${inputError?.matricError ? 'error' : ''}`}
//                             onChange={field.onChange}
//                             type={field.type}
//                             required
//                             placeholder={field.placeholder}
//                         />
//                         {inputError?.matricError && (
//                             <div className="error-message">{inputError?.metricErrorMessage}</div>
//                         )}
//                     </div>
//                 ))}

//             </form>
//         </ProductContext.Provider>
//     );
// };

// export default ProductDimension;
// import React, { useContext } from 'react';
// import { ProductContext } from './CreateProduct';
// import B2BInput from '../../../common/B2BInput';

// const ProductDimension = () => {
//     const { product, handleChange, inputError } = useContext(ProductContext);

//     const json = [
//         {
//             label: "Thickness",
//             type: "number",
//             placeholder: "In mm",
//             value: product.metrics?.thickness || '',
//             onChange: (event) => handleChange(event, "metrics.thickness"),
//             error: inputError?.thicknessErrorMessage || ''
//         },
//         {
//             label: "Width",
//             type: "number",
//             placeholder: "In Inches",
//             value: product.metrics?.width || '',
//             onChange: (event) => handleChange(event, "metrics.width"),
//             error: inputError?.widthErrorMessage || ''
//         },
//         {
//             label: "Weight",
//             type: "number",
//             placeholder: "In gsm",
//             value: product.metrics?.weight || '',
//             onChange: (event) => handleChange(event, "metrics.weight"),
//             error: inputError?.weightErrorMessage || ''
//         }
//     ];

//     return (
//         <form className='form-container' style={{ display: 'flex', gap: '5rem', justifyContent: 'center' }}>
//             {json.map((field, index) => (
//                 <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
//                     <label style={{ fontSize: '16px', fontWeight: '800' }}>{field.label}</label>
//                     <B2BInput
//                         value={field.value}
//                         type={field.type}
//                         required
//                         placeholder={field.placeholder}
//                         onChange={field.onChange}
//                         error={field.error} // Pass error
//                     />
//                     {field.error && (
//                         <div className="error-message">{field.error}</div>
//                     )}
//                 </div>
//             ))}
//         </form>
//     );
// };

// export default ProductDimension;


// import React, { useContext } from 'react';
import { ProductContext } from './CreateProduct';
import B2BInput from '../../../common/B2BInput';
import { useContext } from 'react';

const ProductDimension = () => {
    const { product, handleChange, inputError } = useContext(ProductContext);

    const json = [
        {
            label: "Thickness",
            type: "number",
            placeholder: "In mm",
            value: product.metrics?.thickness || '',
            onChange: (event) => handleChange(event, "metrics.thickness"),
            error: inputError?.thicknessErrorMessage || ''
        },
        {
            label: "Width",
            type: "number",
            placeholder: "In Inches",
            value: product.metrics?.width || '',
            onChange: (event) => handleChange(event, "metrics.width"),
            error: inputError?.widthErrorMessage || ''
        },
        {
            label: "Weight",
            type: "number",
            placeholder: "In gsm",
            value: product.metrics?.weight || '',
            onChange: (event) => handleChange(event, "metrics.weight"),
            error: inputError?.weightErrorMessage || ''
        }
    ];

    return (
        <form className='form-container' style={{ display: 'flex', gap: '5rem', justifyContent: 'center' }}>
            {json.map((field, index) => (
                <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '16px', fontWeight: '800' }}>{field.label}</label>
                    <B2BInput
                        value={field.value}
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        onChange={field.onChange}
                        error={field.error} // Pass error
                    />
                </div>
            ))}
        </form>
    );
};
export default ProductDimension;



