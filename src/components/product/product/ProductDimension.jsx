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



