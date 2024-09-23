import React, { createContext, useEffect, useRef, useState } from 'react'
import B2BButton from '../../../common/B2BButton'
import B2BInput from '../../../common/B2BInput'
import B2BSelect from '../../../common/B2BSelect'
import { B2B_API } from '../../../api/Interceptor'
import { every } from 'lodash'
import { Button, FileButton, Group } from '@mantine/core'
import EnrichmentTabs from './EnrichmentTabs'
import notify from '../../../utils/Notification'

export const EnrichProductContext = createContext(null);

const EnrichProduct = () => {

  const [product, setProduct] = useState({
    status: '',
  });
  const resetRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    const query_param = new URLSearchParams(location.search);
    const id = query_param.get('id');
    if (id) {
      fetchProduct(id)
    }
  }, [location.search])
  
  const fetchProduct = async (id) => {
    try {
      const response = await B2B_API.get(`pim/product/${id}`).json();
      const product = response.response.product;
      const barcodeString = product?.isCreateBarcode ? "true" : "false";
      const transformData = () => {
        const result = {};
        product?.productVariants.forEach(variant => {
          variant.variants.forEach(v => {
            if (!result[v.name]) {
              result[v.name] = [];
            }
            result[v.name].push(v.id);
          });
        });

        return result;
      };

      const fetchHeirarchy = async (parentId) => {
        let heirarchy = [];
        let currentId = parentId;
        while (currentId) {
          try {
            const res = await B2B_API.get(`product-category/category/${currentId}`).json();
            const category = res.response;
            if (category) {
              heirarchy.push(category.name);
              currentId = category.parentId;
            } else {
              currentId = null;
            }
          } catch (error) {
            console.error('Error category : ', error);
            currentId = null;
          }
        }
        return heirarchy.reverse();
      }

      const transformCategories = async () => {
        const result = [];

        for (const [key, value] of Object.entries(product?.productCategories || {})) {
          const heirarchy = await fetchHeirarchy(value.categoryId);
          const heirarchyLabel = heirarchy?.slice(1).join('/');
          result.push({
            key: key,
            value: value,
            heirarchyLabel: heirarchyLabel,
            options: value.options || [],
            openModal: false
          });
        }
        return result;
      };

      const adjustPriceSetting = (priceSetting) => {
        return {
          ...priceSetting,
          isMarkDown: priceSetting.markDownPercent > 0 ? true : false,
          isMarkUp: priceSetting.markUpPercent > 0 ? true : false,
        };
      };

      // setProduct({
      //   ...product,
      //   tags: product?.productTags.split(",").map(tag => tag.trim()),
      //   brandId: product?.brand?.brandId,
      //   taxonomy: product?.taxonomy?.name,
      //   barcode: barcodeString,
      //   gstId: product?.gst?.gstId,
      //   image: `http://192.168.1.13:8080${product?.image}`,
      //   productCategories: await transformCategories(),
      //   prodVariants: transformData(),
      //   priceSetting: adjustPriceSetting(product?.priceSetting),
      // });

      setProduct({
        ...product,
        tags: product?.productTags.split(",").map(tag => tag.trim()),
        brandId: product?.brand?.brandId,
        barcode: barcodeString,
        gstId: product?.gst?.gstId,
        image: `http://192.168.1.13:8080${product?.image}`,
        productCategories: await transformCategories(),
        prodVariants: transformData(),
        priceSetting: adjustPriceSetting(product?.priceSetting),
        status: product.status === "ACTIVE" ? "true" : "false",

        productVariants: product?.productVariants?.map(variant => ({
          ...variant,
          variants: variant?.variants.map(v => ({
            ...v,
            variantId: v.variantId
          }))
        })),
        otherInformation: {
          ...product.otherInformation,
        }
      });

      const initializeImage = async () => {
        try {
          const imageFile = await fetchImageAsBlob();
          setImageFile(imageFile);
        } catch (error) {
          console.error("Failed to fetch and set image file:", error);
        }
      };
      const fetchImageAsBlob = async () => {
        try {
          const response = await fetch(`http://192.168.1.13:8080${product?.image}`);
          const contentType = response.headers.get('Content-Type');
          if (!contentType || !contentType.startsWith('image/')) {
            throw new Error('Expected an image, but received: ' + contentType);
          }
          const blob = await response.blob();
          const file = new File([blob], 'image.jpeg', { type: blob.type });
          return file;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      };
      initializeImage()
    } catch (err) {
      notify({
        title: 'Error!',
        message: err?.message || 'Failed to fetch product.',
        error: true,
        success: false,
      });
    }
  };

  // const handleChange = (event, field, index) => {
  //   const { value } = event.target;
  //   // if (field?.includes('.')) {
  //   //   const [parent, child] = field.split('.');
  //   //   setProduct((prev) => ({
  //   //     ...prev,
  //   //     [parent]: {
  //   //       ...prev[parent],
  //   //       [child]: value
  //   //     }
  //   //   }));
  //   // }
  //   setProduct(prevProduct => {
  //     if (field === 'categoryName' && index !== undefined) {
  //       const updatedCategories = [...prevProduct.productCategories];
  //       updatedCategories[index] = {
  //         ...updatedCategories[index],
  //         categoryName: value
  //       };
  //       return {
  //         ...prevProduct,
  //         productCategories: updatedCategories
  //       };
  //     } 
  //     else if (field === 'status') {
  //       return {
  //         ...prevProduct,
  //         status: value
  //       };
  //     } 
  //     else {
  //       return {
  //         ...prevProduct,
  //         [field]: value
  //       };
  //     }
  //   });
  // };

  const handleChange = (event, fieldType) => {
    const value = event?.target?.type === 'checkbox' ? event?.target?.checked : event?.target?.value;
    if (fieldType.includes('.')) {
      const [parent, child] = fieldType.split('.');
      setProduct((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (fieldType === 'status') {
      setProduct(prevProduct => {
        return {
          ...prevProduct,
          status: value
        };
      })
    }
    else {
      setProduct(prev => ({
        ...prev,
        [fieldType]: event?.target?.value,
      }));
    }
  };







  console.log(product);


  const json = [
    {
      label: "Article Sku Id",
      value: product?.articleCode,
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter SKU Id",
      onChange: (event) => handleChange(event, "articleCode"),
      edit: true
    },
    {
      label: "Product Name",
      value: product?.articleName,
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter Product Name",  
      onChange: (event) => handleChange(event, "articleName"),
      edit: true
    },
    {
      label: "PIM Id",
      value: product.pimId,
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter PIM Id",
      onChange: (event) => handleChange(event, "pimId")
    },
    {
      label: "Variant Id",
      value: product?.productVariants?.[0]?.variants?.[0]?.variantId || '',
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter Variant Id",
      onChange: (event) => handleChange(event, "variantId", 0),
      edit: true
    },
    {
      label: "Status",
      type: 'radio',
      value: product?.status,
      fieldType: 'radioField',
      options: [
        { label: "ACTIVE", value: "true" },
        { label: "INACTIVE", value: "false" }
      ],
      onChange: (event) => handleChange(event, "status"),
      name: "status",
    },
  ]

  const fileChange = (file) => {
    const MAX_SIZE_BYTES = 3 * 1024 * 1024;

    if (file) {
      if (file.size > MAX_SIZE_BYTES) {
        setErrorMessage(`File size exceeds the 3MB limit for the Image!! `);
        if (file.size > MAX_SIZE_BYTES) {
          setImageFile(null);
          setProduct((prevProduct) => ({
            ...prevProduct,
            image: '',
          }));
        }
      } else {
        setErrorMessage('')
        setImageFile(file);
        const reader = new FileReader()
        reader.onloadend = () => {
          setProduct((prevProduct) => ({
            ...prevProduct,
            image: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setErrorMessage('');
      setImageFile(null);
      setProduct((prevProduct) => ({
        ...prevProduct,
        image: '',
      }));
    }
  };

  const clearFile = () => {
    setProduct((prevProduct) => ({
      ...prevProduct, image: ''
    }));
    if (resetRef.current) {
      resetRef.current();
    }
    setImageFile(null)
    setCurrentImage(null)
  };

  return (
    <EnrichProductContext.Provider value={{ handleChange, product, setProduct }}>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div className='form-group' style={{ display: 'flex', flexDirection: 'column', maxWidth: '49%', alignItems: 'center' }}>
          {/* Image Display Section */}
          <div style={{ textAlign: 'center', marginBottom: '1rem', border: '1px solid #ccc', padding: '10px', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Uploaded"
                style={{ maxWidth: '100%', maxHeight: '100%' }}
              />
            ) : (
              <p style={{ color: '#888' }}>No image uploaded</p>
            )}
          </div>
          <Group justify="flex-start">
            <FileButton resetRef={resetRef} onChange={(file) => fileChange(file)} accept="image/png,image/jpeg">
              {(props) => <Button {...props}>Upload image</Button>}
            </FileButton>
            <Button disabled={!imageFile} color="red" onClick={clearFile}>
              Reset
            </Button>
          </Group>
        </div>

        <form className='form-container' style={{ display: 'flex', flexDirection: 'row', maxWidth: '49%' }}>

          {json?.map((field, index) => (
            <div key={index} className={field.className ? field.className : "form-group"}>
              <label className='form-label'>{field.label}</label>
              {
                field.fieldType === 'textField' && (
                  <B2BInput
                    value={field.value}
                    className='form-input'
                    // onChange={field.onChange}
                    type={field.type}
                    placeholder={field.placeholder}
                    edit={field.edit}
                  />
                )
              }
              {
                field.fieldType === "selectField" && (
                  <B2BSelect
                    data={field.data}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={"Select Status"}
                    clearable={true}
                    error={field.error}
                  />
                )
              }
              {field.fieldType === "radioField" && (
                <div className="radio-group">
                  {field.options.map((option, idx) => (
                    <div key={idx} className="radio-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <input
                        type="radio"
                        value={option.value}
                        name={field.name}
                        onChange={field.onChange}
                        checked={field.value === option.value}
                      />
                      <label className='radio-label'>{option.label}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
          {errorMessage && notify({
            title: 'Error!!',
            message: errorMessage || 'Failed to add Image.',
            error: true,
            success: false,
          })}
        </form>
      </div>
      <EnrichmentTabs />
    </EnrichProductContext.Provider>

  )
}

export default EnrichProduct