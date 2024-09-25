import { Button, FileButton, Group } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'
import React, { createContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from '../../../api/EndPoints'
import { B2B_API } from '../../../api/Interceptor'
import B2BButton from '../../../common/B2BButton'
import B2BInput from '../../../common/B2BInput'
import B2BSelect from '../../../common/B2BSelect'
import notify from '../../../utils/Notification'
import EnrichmentTabs from './EnrichmentTabs'

export const EnrichProductContext = createContext(null);

const EnrichProduct = () => {

  const [product, setProduct] = useState({
    status: '',
  });
  const resetRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [store, setStore] = useState('')
  const [channel, setChannel] = useState('')
  const navigate = useNavigate();
  const query_param = new URLSearchParams(location.search);
  const id = query_param.get('id');
  const from = query_param.get('from');
  const [users, setUsers] = useState('');
  const [pim, setPim] = useState({});
  const [multimedia, setMultimedia] = useState([])

  useEffect(() => {
    if (id) {
      fetchProduct(id)
    }
  }, [location.search])
  useEffect(() => {
    fetchStoreAndLocation()

  }, [])
  const fetchStoreAndLocation = async () => {
    const queryParams = new URLSearchParams(from.split('?')[1]);
    const channelId = queryParams.get('channel');
    const storeId = queryParams.get('store');
    const chan = await B2B_API.get(`channel/${channelId}`).json()
    const location = await B2B_API.get(`company-location/${storeId}`).json()
    setChannel(chan.response.name)
    setStore(location.response.name)
  }

  // const initializeVideo = async () => {
  //   try {
  //     const videoFile = await fetchVideoAsBlob(); // Changed function name
  //     setVideoFile(videoFile);
  //   } catch (error) {
  //     console.error("Failed to fetch and set video file:", error); // Updated error message
  //   }
  // };

  const fetchVideoAsBlob = async (url) => {
    try {
      const response = await fetch(`${BASE_URL.replace('/api', '')}${url}`);
      const contentType = response.headers.get('Content-Type');
      if (!contentType || !contentType.startsWith('video/')) {
        throw new Error('Expected a video, but received: ' + contentType);
      }
      const blob = await response.blob();
      const file = new File([blob], 'video.mp4', { type: blob.type }); // Changed to video.mp4
      return file;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  const fetchProduct = async (id) => {
    try {
      const response = await B2B_API.get(`pim/product/${id}`).json();
      const product = response.response.product;
      setPim(response.response);
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
      console.log(response.response.video)

      if (response.response.video) {
        const videoFile = await fetchVideoAsBlob(response.response.video);
        setVideoFile(videoFile);
      }
      getUserById(response.response.updatedBy);

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

      setProduct({
        ...product,
        tags: product?.productTags.split(",").map(tag => tag.trim()),
        brandId: product?.brand?.brandId,
        barcode: barcodeString,
        gstId: product?.gst?.gstId,
        image: `${BASE_URL}${product?.image}`,
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
          const response = await fetch(`${BASE_URL.replace('/api', '')}${product?.image}`);
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

  // const handleChange = (event, fieldType) => {
  //   const value = event?.target?.type === 'checkbox' ? event?.target?.checked : event?.target?.value;
  //   if (fieldType.includes('.')) {
  //     const [parent, child] = fieldType.split('.');
  //     setProduct((prev) => ({
  //       ...prev,
  //       [parent]: {
  //         ...prev[parent],
  //         [child]: value
  //       }
  //     }));
  //   } else if (fieldType === 'status') {
  //     setProduct(prevProduct => {
  //       return {
  //         ...prevProduct,
  //         status: value
  //       };
  //     })
  //   }
  //   else if (fieldType === 'performance') {
  //     setPim((pre => {
  //       return {
  //         ...pre,
  //         performance: value
  //       }
  //     }))
  //   }
  //   else if (fieldType === 'designNumber') {
  //     setPim((pre => {
  //       return {
  //         ...pre,
  //         designNumber: value
  //       }
  //     }))
  //   } else if (fieldType === 'channelPrice') {
  //     setPim((pre => {
  //       return {
  //         ...pre,
  //         channelPrice: value
  //       }
  //     }))
  //   }
  //   else if (fieldType === 'discount') {
  //     setPim((pre => {
  //       return {
  //         ...pre,
  //         discount: value,
  //       }
  //     }))
  //   }
  //   else if (fieldType === 'WSP') {
  //     setPim((pre => {
  //       return {
  //         ...pre,
  //         WSP: value,
  //       }
  //     }))
  //   }
  //   else {
  //     setProduct(prev => ({
  //       ...prev,
  //       [fieldType]: event?.target?.value,
  //     }));
  //   }
  // };

  const handleChange = (event, fieldType) => {
    const value = event?.target?.type === 'checkbox' ? event?.target?.checked : event?.target?.value;

    const updateState = (setter, field, newValue) => {
      setter((prev) => ({
        ...prev,
        [field]: newValue,
      }));
    };

    if (fieldType.includes('.')) {
      const [parent, child] = fieldType.split('.');
      setProduct((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (['status', 'performance', 'designNumber', 'channelPrice', 'discount', 'wsp', 'pageTitle'].includes(fieldType)) {
      updateState(setPim, fieldType, value, event);
    } else if (['sampleMOQ', 'wholesaleMOQ', 'minMargin', 'allowLoyalty', 'isStopGRN', 'isStopPurchaseReturn', 'isStopSale',
      'isAllowRefund', 'isAllowNegative', 'isAllowCostEditInGRN', 'isEnableSerialNumber', 'isNonTrading', 'metaDescription', 'productSlug', 'url'].includes(fieldType)) {
      setPim((prev) => ({
        ...prev,
        pimOtherInformation: {
          ...prev.pimOtherInformation,
          [fieldType]: event?.target?.value,
        },
      }));
    } else {
      updateState(setProduct, fieldType, value);
    }
  };



  console.log(pim);


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
      value: pim?.pimId,
      type: "text",
      fieldType: 'textField',
      placeholder: "Enter PIM Id",
      onChange: (event) => handleChange(event, "pimId"),
      edit: true
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

  // const fileChange = (file) => {
  //   const MAX_SIZE_BYTES = 3 * 1024 * 1024;

  //   if (file) {
  //     if (file.size > MAX_SIZE_BYTES) {
  //       setErrorMessage(`File size exceeds the 3MB limit for the Image!! `);
  //       if (file.size > MAX_SIZE_BYTES) {
  //         setImageFile(null);
  //         setProduct((prevProduct) => ({
  //           ...prevProduct,
  //           image: '',
  //         }));
  //       }
  //     } else {
  //       setErrorMessage('')
  //       setImageFile(file);
  //       const reader = new FileReader()
  //       reader.onloadend = () => {
  //         setProduct((prevProduct) => ({
  //           ...prevProduct,
  //           image: reader.result,
  //         }));
  //       };
  //       reader.readAsDataURL(file);
  //     }
  //   } else {
  //     setErrorMessage('');
  //     setImageFile(null);
  //     setProduct((prevProduct) => ({
  //       ...prevProduct,
  //       image: '',
  //     }));
  //   }
  // };

  const videoChange = (file, sku, type) => {
    const MAX_SIZE_BYTES = 3 * 1024 * 1024; // 3MB size limit for videos

    if (file) {
      if (file.size > MAX_SIZE_BYTES) {
        setErrorMessage(`Video size exceeds the 3MB limit for ${type}.`);
        setVideoFile(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setErrorMessage('');
        setVideoFile(file);
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('');
      setVideoFile(null);
    }
  };


  const clearFile = () => {
    setProduct((prevProduct) => ({
      ...prevProduct, video: ''
    }));
    if (resetRef.current) {
      resetRef.current();
    }
    setVideoFile(null)
    setCurrentImage(null)
  };
  const formatDate = (timestamp) => {
    const date = new Date(Number(timestamp));
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const updatedDate = product?.updatedDate ? formatDate(product.updatedDate) : null;
  const createdDate = product?.createdDate ? formatDate(product.createdDate) : null;

  const handleBack = () => {

    navigate(from)
  }

  const getUserById = async (userId) => {
    try {
      if (userId) {
        const res = await B2B_API.get(`user/${userId}`).json();
        setUsers(res.response.firstName);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <EnrichProductContext.Provider value={{ handleChange, product, setProduct, pim, setPim, videoFile, multimedia, setMultimedia }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <B2BButton style={{ color: '#000' }} name="Back" onClick={handleBack} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h3>Created Date: {users} - {createdDate ? createdDate : "No date available"}</h3>
          <h3>Updated Date: {users} - {updatedDate ? updatedDate : "No date available"}</h3>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <h3> Channel Name : {channel}</h3>
          <h3> Store : {store}</h3>
        </div>
      </div>

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
          {/* <Group justify="flex-start">
            <FileButton resetRef={resetRef} onChange={(file) => fileChange(file)} accept="image/png,image/jpeg">
              {(props) => <Button {...props}>Upload image</Button>}
            </FileButton>
            <Button disabled={!imageFile} color="red" onClick={clearFile}>
              Reset
            </Button>
          </Group> */}
        </div>
        <div className='form-group' style={{ display: 'flex', flexDirection: 'column', maxWidth: '49%', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', marginBottom: '1rem', border: '1px solid #ccc', padding: '10px', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
            {videoFile ? (
              <div style={{backgroundColor:'black', height:'100%', display:'flex',alignItems:'center'}}>
                <video
                  controls
                  // style={{width:'100%',height:'250px',marginBottom:'70px' }}
                  style={{ maxWidth: '100%', maxHeight: '100' }}
                >
                  <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <p style={{ color: '#888' }}>No video uploaded</p>
            )}
          </div>

          <Group justify="flex-start">
            <FileButton resetRef={resetRef} onChange={(file) => videoChange(file)} accept="video/mp4,video/x-m4v,video/*">
              {(props) => <Button {...props}>Upload video</Button>}
            </FileButton>
            <Button disabled={!videoFile} color="red" onClick={clearFile}>
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