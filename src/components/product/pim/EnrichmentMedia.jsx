
import { Button, FileButton, Group } from '@mantine/core';
import React, { useContext, useState } from 'react';
import { BASE_URL } from '../../../api/EndPoints';
import notify from '../../../utils/Notification';
import { EnrichProductContext } from './EnrichProduct';

const EnrichmentMedia = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { product, setProduct, setMultimedia } = useContext(EnrichProductContext);
  const [variants,setVariants]= useState({})
  const [media, setMedia] = useState({})

  const fileChange = (file, sku, type, variant) => {
    const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB size limit

    if (file) {
      if (file.size > MAX_SIZE_BYTES) {
        setErrorMessage(`File size exceeds the 3MB limit for ${type}.`);
        setProduct((prevProduct) => ({
          ...prevProduct,
          productVariants: prevProduct.productVariants.map((variant) =>
            variant.variantSku === sku
              ? { ...variant, [type]: '' }
              : variant
          ),
        }));
      } else {
        const fileName = `${sku}_${file.name}`;
        const reader = new FileReader();
        reader.onloadend = () => {
          // setMultimedia((prev) => [...prev, med])
          setProduct((prevProduct) => ({
            ...prevProduct,
            productVariants: prevProduct.productVariants.map((variant) =>
              variant.variantSku === sku
                ? { ...variant, [type]: reader.result, name: fileName,file: file }
                : variant
            ),
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setErrorMessage('');
      setProduct((prevProduct) => ({
        ...prevProduct,
        productVariants: prevProduct.productVariants.map((variant) =>
          variant.variantSku === sku ? { ...variant, [type]: '' } : variant
        ),
      }));
    }
  };

  const clearFile = (sku, type) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productVariants: prevProduct.productVariants.map((variant) =>
        variant.variantSku === sku ? { ...variant, [type]: '' } : variant
      ),
    }));
  };

  console.log(product, "prod");

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
      <thead>
        <tr>
          <th style={{ border: '1px solid #ccc', padding: '10px' }}>Variant Colour</th>
          <th style={{ border: '1px solid #ccc', padding: '10px' }}>Image</th>
          <th style={{ border: '1px solid #ccc', padding: '10px' }}>Image Actions</th>
          {/* <th style={{ border: '1px solid #ccc', padding: '10px' }}>Video</th>
          <th style={{ border: '1px solid #ccc', padding: '10px' }}>Video Actions</th> */}
        </tr>
      </thead>
      <tbody>
        {product?.productVariants?.map((variant) => (
          <tr key={variant.id}>
            <td style={{ border: '1px solid #ccc', padding: '10px',textAlign:'center' }}>
              {variant.variants.map((variantDetail) => (
                <div key={variantDetail.value}>
                  <h4>{variantDetail.value}</h4>
                </div>
              ))}
            </td>

            <td style={{ border: '1px solid #ccc', padding: '10px', textAlign:'center'}}>
              {variant.image ? (
                <img
                  src={variant.image.includes('/resources')?`${BASE_URL}${variant.image}?time=${Date.now()}`: variant.image}
                  alt="Uploaded"
                  style={{ maxWidth: '50%', maxHeight: '70px'}}
                />
              ) :(
                <p style={{ color: '#888' }}>No image uploaded</p>
              )}
            </td>

            <td style={{ border: '1px solid #ccc', padding: '10px',alignItems:'center' }}>
              <Group justify="flex-start">
                <FileButton onChange={(file) => fileChange(file, variant.variantSku, 'image', variant)} multiple={false}>
                  {(props) => <Button {...props}>Upload Image</Button>}
                </FileButton>
                <Button disabled={!variant.image} color="red" onClick={() => clearFile(variant.variantSku, 'image')}>
                  Reset
                </Button>
              </Group>
            </td>
          </tr>
        ))}
        {errorMessage && notify({
          title: 'Error!!',
          message: errorMessage,
          error: true,
          success: false,
        })}
      </tbody>
    </table>
  );
};

export default EnrichmentMedia;



