
import { Button, FileButton, Group } from '@mantine/core';
import React, { useContext, useState } from 'react';
import { EnrichProductContext } from './EnrichProduct';
import notify from '../../../utils/Notification';

const EnrichmentMedia = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const { product, setProduct } = useContext(EnrichProductContext);

  const fileChange = (file, sku, type) => {
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
        const fileName = `${sku}_${file.name}`
        const reader = new FileReader();
        reader.onloadend = () => {
          setProduct((prevProduct) => ({
            ...prevProduct,
            productVariants: prevProduct.productVariants.map((variant) =>
              variant.variantSku === sku
                ? { ...variant, [type]: reader.result ,name:fileName}
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

  // const fileChange = (file, sku, type) => {
  //   const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB size limit
  
  //   if (file) {
  //     if (file.size > MAX_SIZE_BYTES) {
  //       setErrorMessage(`File size exceeds the 3MB limit for ${type}.`);
  //       setProduct((prevProduct) => ({
  //         ...prevProduct,
  //         productVariants: prevProduct.productVariants.map((variant) =>
  //           variant.variantSku === sku ? { ...variant, [type]: '' } : variant
  //         ),
  //       }));
  //     } else {
  //       const fileName = `${file.name}`;
  
  //       const reader = new FileReader();
  //       reader.onloadend = () => {
  //         setProduct((prevProduct) => ({
  //           ...prevProduct,
  //           productVariants: prevProduct.productVariants.map((variant) =>
  //             variant.variantSku === sku
  //               ? { ...variant, [type]: { dataUrl: reader.result, name: fileName } }
  //               : variant
  //           ),
  //         }));
  //       };
  
  //       reader.readAsDataURL(file);
  //     }
  //   } else {
  //     setErrorMessage('');
  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       productVariants: prevProduct.productVariants.map((variant) =>
  //         variant.variantSku === sku ? { ...variant, [type]: '' } : variant
  //       ),
  //     }));
  //   }
  // };
  
  const clearFile = (sku, type) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      productVariants: prevProduct.productVariants.map((variant) =>
        variant.variantSku === sku ? { ...variant, [type]: '' } : variant
      ),
    }));
  }
  console.log(product,"prod");
  
  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {product?.productVariants?.map((variant) => (
        <div key={variant.id} className="form-group" style={{ display: 'flex', flexDirection: 'column', maxWidth: '49%', alignItems: 'center', marginBottom: '2rem' }}>
          {variant.variants.map((variantDetail, idx) => (
            <div key={idx}>
              <h4>Variant Colour: {variantDetail.value}</h4>
            </div>
          ))}

          {/* Image Upload Section */}
          <div style={{ textAlign: 'center', marginBottom: '1rem', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            <div style={{ border: '1px solid #ccc', padding: '10px', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
              {variant.image ? (
                <img
                  src={variant.image}
                  alt="Uploaded"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              ) : (
                <p style={{ color: '#888' }}>No image uploaded</p>
              )}
            </div>
          </div>

          <Group justify="flex-start">
            <FileButton onChange={(file) => fileChange(file, variant.variantSku, 'image')} multiple={false}>
              {(props) => <Button {...props}>Upload Image</Button>}
            </FileButton>
            <Button disabled={!variant.image} color="red" onClick={() => clearFile(variant.variantSku, 'image')}>
              Reset
            </Button>
          </Group>

          {/* Video Upload Section */}
          <div style={{ marginTop: '20px', textAlign: 'center', marginBottom: '1rem', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
            <div style={{ border: '1px solid #ccc', padding: '10px', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
              {variant.video ? (
                <video controls width="200" height="200">
                  <source src={variant.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p style={{ color: '#888' }}>No video uploaded</p>
              )}
            </div>
          </div>

          <Group justify="flex-start">
            <FileButton onChange={(file) => fileChange(file, variant.variantSku, 'video')} multiple={false}>
              {(props) => <Button {...props}>Upload Video</Button>}
            </FileButton>
            <Button disabled={!variant.video} color="red" onClick={() => clearFile(variant.variantSku, 'video')}>
              Reset
            </Button>
          </Group>

          {errorMessage && notify({
            title: 'Error!!',
            message: errorMessage || 'Failed to add Image.',
            error: true,
            success: false,
          })}
        </div>
      ))}
    </div>
  );
};

export default EnrichmentMedia;


