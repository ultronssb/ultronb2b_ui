import { isEmpty } from 'lodash';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { BASE_URL } from '../../../api/EndPoints';
import { createB2BAPI } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTabs from '../../../common/B2BTabs';
import notify from '../../../utils/Notification';
import { validateProductDescription, validateProductName } from '../../../utils/Validation';
import ProductFabricContent from './ProductFabricContent';
import ProductCategorys from './ProductCategorys';
import ProductDimension from './ProductDimension';
import ProductPrice from './ProductPrice';
import ProductType from './ProductType';
import ProductVariant from './ProductVariant';
import { useLocation, useNavigate } from 'react-router-dom';
import { IconArrowLeft } from '@tabler/icons-react';
import { ActiveTabContext } from '../../../layout/Layout';
export const ProductContext = createContext(null);

const CreateProduct = () => {
  const { stateData } = useContext(ActiveTabContext);
  const initialTabs = [
    { id: "1", name: "Product Type", disabled: false },
    { id: "2", name: "Category Type", disabled: true },
    { id: "3", name: "Fabric Content", disabled: true },
    { id: "4", name: "Dimensions", disabled: true },
    { id: "5", name: "Price", disabled: true },
    { id: "6", name: "Variant", disabled: true },

  ];

  const [tabs, setTabs] = useState(initialTabs)
  const navigate = useNavigate()
  const query_param = new URLSearchParams(location.search);
  const to = query_param.get('toUrl');
  const from = query_param.get('from')
  const page = query_param.get('page');
  const size = query_param.get('size');
  const search = query_param.get('search');

  const initialState = {
    productId: '',
    articleName: '',
    articleCode: '',
    description: '',
    supplier: '',
    isCreateBarcode: true,
    tags: [],
    metrics: {
      weight: 0,
      thickness: 0,
      length: 0,
      width: 0,
    },
    otherInformation: {
      skuPrefix: '',
      unitOfMeasures:
      {
        type: 'UOM',
        isRoll: false,
        isKg: false,
      }
    },
    prodVariants: {

    },
    productVariants: [

    ],
    productCategories: {

    },
    newProductVariants: [],
    fabricContent: {
      value: "",
      composition: {}
    },
    totalProductPercent: 0,
    priceSetting: {
      isMarkUp: false,
      isMarkDown: false,
      costPrice: 0,
      markUpPercent: 0,
      markDownPercent: 0,
      sellingPrice: 0,
      mrp: 0,
      margin: 0,
    },
    categoryId: '',
    gstId: '',
    brandId: '',
    taxonomyNode: {},
    status: 'ACTIVE'
  }
  const [product, setProduct] = useState(initialState);
  const [imageFile, setImageFile] = useState(null)
  const [activeTab, setActiveTab] = useState("1");
  const [isFormValid, setIsFormValid] = useState(false);
  const B2B_API = createB2BAPI();
  const [status,setStatus]=useState('ACTION')

  const [inputError, setInputError] = useState({
    articleNameError: false,
    articleNameErrorMessage: '',
    descError: false,
    descErrorMessage: '',
    uomError: false,
    uomErrorMessage: '',
    brandIdError: false,
    brandIdErrorMessage: '',
    barcodeError: false,
    barcodeErrorMessage: '',
    categoryError: false,
    categoryErrorMessage: '',
    categorysErrorMessage: '',
    fabricContentError: false,
    fabricContentErrorMessage: '',
    fabricCompositionError: false,
    fabricCompositionErrorMessage: '',
    metricError: false,
    metricErrorMessage: '',
    priceSettingsError: false,
    priceSettingsErrorMessage: '',
    variantError: false,
    variantErrorMessage: '',
    gstError: false,
    gstErrorMessage: '',
    markUpPercentError: false,
    markUpPercentErrorMessage: '',
    markDownPercentError: false,
    markDownPercentErrorMessage: '',
    mrpError: false,
    mrpErrorMessage: '',
    costPriceError: false,
    costPriceErrorMessage: '',
    taxonomyError: false,
    taxonomyErrorMessage: '',
    imageError: false,
    imageErrorMessage: ''
  })

  useEffect(() => {
    setIsFormValid(validateProductVariants());
  }, [product?.prodVariants,status]);

  const checkDirectValue = (key) => {
    if (key === 'brandId') return true
    if (key === 'taxonomyNode') return true
  }
  useEffect(() => {
    const query_param = new URLSearchParams(location.search);
    const id = query_param.get('id');
    if (id) {
      fetchProduct(id);
    }
  }, [location.search])

  const validateProductVariants = () => {
    return !(
      isEmpty(product?.prodVariants) ||
      !Object.values(product.prodVariants).some(variant => variant.length > 0)
    );
  };


  const handleChange = (event, fieldType) => {
    const value = event?.target?.type === 'checkbox' ? event?.target?.checked : event?.target?.value;
    setInputError("")
    if (fieldType === "articleName") {
      const { value } = event.target
    }
    if (fieldType === "UOM") {
      const { value, checked } = event.target;
      const { otherInformation } = product;
      otherInformation.unitOfMeasures[value] = checked;
      setProduct(prevState => ({ ...prevState, otherInformation: otherInformation }));
    } else if (fieldType === 'gstId') {
      setProduct(prev => ({ ...prev, gstId: event }));
    } else if (fieldType.includes('.')) {
      const [parent, child] = fieldType.split('.');
      setProduct((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else if (fieldType === 'isCreateBarcode') {
      setProduct(prev => ({
        ...prev,
        isCreateBarcode: 'true' === event?.target?.value
      }));
    } else if (['sampleMOQ', 'wholesaleMOQ', 'minMargin', 'allowLoyalty', 'isStopGRN', 'isStopPurchaseReturn', 'isStopSale',
      'isAllowRefund', 'isAllowNegative', 'isAllowCostEditInGRN', 'isEnableSerialNumber', 'isNonTrading', 'metaDescription', 'productSlug', 'url'].includes(fieldType)) {
      setProduct((prev) => {
        const updatedState = {
          ...prev,
          otherInformation: {
            ...prev.otherInformation,
            [fieldType]: value,
          },
        };
        return updatedState;
      });
    } else if (fieldType.startsWith('variantImage')) {
      const variantIndex = fieldType.split('-')[1]; // Assuming fieldType is like 'variantImage-0', 'variantImage-1', etc.

      setProduct(prev => ({
        ...prev,
        variants: prev.variants.map((variantGroup, idx) => {
          if (idx === parseInt(variantIndex)) {
            // Update the image for the specific variant
            return variantGroup.map(variant => ({
              ...variant,
              image: file // Set the new image file
            }));
          }
          return variantGroup;
        })
      }));
    }
    else {
      setProduct(prev => ({
        ...prev,
        [fieldType]: checkDirectValue(fieldType) ? event : event?.target?.value,
      }));
    }
  };

  const addProduct = async (prod) => {
    try {
      const res = await B2B_API.post(`product`, {
        body: prod,
      }).json();
      if (to && from) {
        return navigate(`${to}&from=${encodeURIComponent(from)}`)
      }
      setProduct(initialState);
      setImageFile(null);
      setActiveTab("1");
      notify({
        id: product?.id ? "Updated Successfully" : "Added Successfully",
        title: 'Success!!',
        message: product?.id ? "Updated Successfully" : res?.message,
        error: false,
        success: true,
      })
    } catch (err) {
      notify({
        title: 'Error!!',
        message: err?.message || 'Failed to add product.',
        error: true,
        success: false,
      })
    }
  };


  const renderActiveComponent = () => {
    switch (activeTab) {
      case "1":
        return <ProductType />;
      case "2":
        return <ProductCategorys />;
      case "3":
        return <ProductFabricContent />;
      case "4":
        return <ProductDimension />;
      case "5":
        return <ProductPrice />;
      case "6":
        return <ProductVariant />;
      default:
        return <ProductType />;
    }
  };

  const handleTabClick = (index) => {
    handleNextTab(false)
    if (product.productId || !index.disabled) {
      setActiveTab(index.id);
    }
  };


  const handleBackTab = () => {
    const prevTabIndex = tabs.findIndex(tab => tab.id === activeTab) - 1;
    if (prevTabIndex >= 0) {
      setActiveTab(tabs[prevTabIndex].id);
    }
  };

  const enableNextTab = (isDisabled) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.map((tab, index) => {
        if (tab.id === activeTab) {
          const nextIndex = index + 1;
          if (nextIndex < prevTabs.length) {
            prevTabs[nextIndex].disabled = isDisabled;
          }
        }
        return tab;
      });

      return [...updatedTabs];
    });
  };

  const handleNextTab = async (fromNext = true) => {
    let isValid = true;
    const errors = {};

    switch (activeTab) {
      case "1": // Product Type Tab
        // Validate article name
        if (isEmpty(product?.articleName)) {
          errors.articleNameError = true;
          errors.articleNameErrorMessage = "Product Name is Required!";
          isValid = false;
        } else if (!validateProductName(product?.articleName)) {
          errors.articleNameError = true;
          errors.articleNameErrorMessage = "Special characters are not allowed!";
          isValid = false;
        } else {
          try {
            const result = await B2B_API.get(`product/productname/${product?.articleName}`).json();

            // Check if product ID exists and validate product name
            if (product?.id) {
              isValid = true;
            } else {
              if (result?.response) {
                errors.articleNameError = true;
                errors.articleNameErrorMessage = "Product Name already exists";
                isValid = false;
              }
            }
          } catch (error) {
            console.error("Error fetching product name:", error);
            errors.articleNameError = true;
            errors.articleNameErrorMessage = "An error occurred while validating the product name.";
            isValid = false;
          }
        }
        // Validate product description
        if (!validateProductDescription(product?.description)) {
          errors.descError = true;
          errors.descErrorMessage = "Please use only letters, numbers, spaces, $ , ₹ , . and ,";
          isValid = false;
        }
        if (!product?.otherInformation?.unitOfMeasures?.isKg && !product?.otherInformation?.unitOfMeasures?.isRoll) {
          errors.uomError = true,
            errors.uomErrorMessage = "UOM Is Required !!"
          isValid = false
        }
        if (product?.isCreateBarcode === undefined || product?.isCreateBarcode === null) {
          errors.barcodeError = true;
          errors.barcodeErrorMessage = "Barcode Is Required!!";
          isValid = false;
        } else {
          errors.barcodeError = false;
        }

        if (isEmpty(product?.taxonomyNode)) {
          errors.taxonomyError = true;
          errors.taxonomyErrorMessage = "Taxonomy is Required!!";
          isValid = false;
        } else {
          errors.taxonomyError = false;
        }
        if (isValid) {
          enableNextTab(false)
        } else {
          enableNextTab(true)
        }

        break;

      case "2": // Validate for category
        if (isEmpty(product.productCategories)) {
          errors.categoryError = true;
          errors.categoryErrorMessage = 'Category cannot be null!';
          isValid = false;
        } else {
          for (const pair of product.productCategories) {
            if (!pair.heirarchyLabel) {
              errors.categoryError = true;
              errors.categorysErrorMessage = 'Child fields are Required !!!';
              isValid = false;
              break;
            }
          }
        }
        if (isValid) {
          enableNextTab(false)
        } else {
          enableNextTab(true)
        }
        break;
      case "3": // Validate Fabric Content (FCC)
        const isFabricContentValid = product?.fabricContent?.composition &&
          Object.keys(product.fabricContent.composition).length > 0 &&
          Object.values(product.fabricContent.composition).every(value => value);
        if (product?.totalProductPercent > 100 || product?.totalProductPercent < 100) {
          errors.fabricCompositionError = true;
          errors.fabricCompositionErrorMessage = "Overal composition Percentage must be 100";
          isValid = false;
        }
        if (!isFabricContentValid) {
          errors.fabricContentError = true;
          errors.fabricContentErrorMessage = "FCC must be selected !!";
          isValid = false;
        }
        if (isValid) {
          enableNextTab(false)
        } else {
          enableNextTab(true)
        }
        break;

      case "4": // Dimensions Tab
        const { metrics } = product;
        if (!metrics?.weight || metrics.weight <= 0) {
          errors.weightErrorMessage = 'Weight must be greater than zero!';
          isValid = false;
        }
        if (!metrics?.thickness || metrics.thickness <= 0) {
          errors.thicknessErrorMessage = 'Thickness must be greater than zero!';
          isValid = false;
        }
        if (!metrics?.width || metrics.width <= 0) {
          errors.widthErrorMessage = 'Width must be greater than zero!';
          isValid = false;
        }
        if (isValid) {
          enableNextTab(false)
        } else {
          enableNextTab(true)
        }
        break;

      case "5": // Product Price Tab
        if (!product?.priceSetting?.isMarkUp && !product?.priceSetting?.isMarkDown) {
          errors.priceSettingsError = true;
          errors.priceSettingsErrorMessage = "Please select either Mark Up or Mark Down.";
          isValid = false;
        } else {
          // Step 2: Validate fields based on selection
          if (product?.priceSetting?.isMarkUp) {
            // If Mark Up is selected, validate costPrice and markUpPercent
            if (!product?.priceSetting?.costPrice || product?.priceSetting?.costPrice <= 0) {
              errors.costPriceError = true;
              errors.costPriceErrorMessage = "Cost Price is required!";
              isValid = false;
            } else {
              // Clear the error if costPrice is valid
              errors.costPriceError = false;
              errors.costPriceErrorMessage = "";
            }

            if (!product?.priceSetting?.markUpPercent || product?.priceSetting?.markUpPercent <= 0) {
              errors.markUpPercentError = true;
              errors.markUpPercentErrorMessage = "Mark Up Percent is required!";
              isValid = false;
            } else {
              // Clear the error if markUpPercent is valid
              errors.markUpPercentError = false;
              errors.markUpPercentErrorMessage = "";
            }
          }

          if (product?.priceSetting?.isMarkDown) {
            // If Mark Down is selected, validate mrp and markDownPercent
            if (!product?.priceSetting?.mrp || product?.priceSetting?.mrp <= 0) {
              errors.mrpError = true;
              errors.mrpErrorMessage = "MRP is required!";
              isValid = false;
            } else {
              // Clear the error if mrp is valid
              errors.mrpError = false;
              errors.mrpErrorMessage = "";
            }

            if (!product?.priceSetting?.markDownPercent || product?.priceSetting?.markDownPercent <= 0) {
              errors.markDownPercentError = true;
              errors.markDownPercentErrorMessage = "Mark Down Percent is required!";
              isValid = false;
            } else {
              // Clear the error if markDownPercent is valid
              errors.markDownPercentError = false;
              errors.markDownPercentErrorMessage = "";
            }
          }
        }

        // Validate GST Selection
        if (isEmpty(product?.gstId)) {
          errors.gstError = true;
          errors.gstErrorMessage = "GST must be selected!";
          isValid = false;
        }
        if (isValid) {
          enableNextTab(false)
        } else {
          enableNextTab(true)
        }
        break;
    }

    // Update error state
    setInputError(prev => ({ ...prev, ...errors }));

    // Only proceed to the next tab if there are no errors
    if (fromNext) {
      if (isValid) {
        const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
        const nextTabIndex = currentTabIndex + 1;
        if (nextTabIndex < tabs.length) {
          setActiveTab(tabs[nextTabIndex].id);
          // Enable the next tab
          setTabs((prevTabs) =>
            prevTabs.map((tab, index) =>
              index === nextTabIndex ? { ...tab, disabled: false } : tab
            )
          );
        }
      } else {
        // Disable all subsequent tabs if validation fails
        const currentTabIndex = tabs.findIndex((tab) => tab.id === activeTab);
        setTabs((prevTabs) =>
          prevTabs.map((tab, index) => ({
            ...tab,
            disabled: index > currentTabIndex,
          }))
        );

        setActiveTab(activeTab);
      }
    }
  }

  const handleProductSave = async () => {
    const formData = new FormData();
    let updatedProduct = {
      ...product,
      productCategories: [...product.productCategories]
    };
    updatedProduct.productVariants = product.newProductVariants;
    updatedProduct.productCategories = updatedProduct.productCategories
      ? updatedProduct.productCategories.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {})
      : {};
    delete updatedProduct.prodVariants
    formData.append("product", JSON.stringify(updatedProduct))
    formData.append("image", imageFile)
    addProduct(formData);

  };
  const enableAllTabs = () => {
    const updatedTabs = tabs.map((tab) => ({ ...tab, disabled: false }));
    setTabs(updatedTabs);
  };

  const fetchProduct = async (id) => {
    try {
      const response = await B2B_API.get(`product/${id}`).json();
      const product = response.response;
      const barcodeString = product?.isCreateBarcode ? "true" : "false";
      enableAllTabs()
      const transformData = () => {
        const result = {};
        product?.productVariants.forEach(variant => {
          variant.variants.forEach(v => {
            if (!result[v.name]) {
              result[v.name] = new Set(); // Use a Set to ensure uniqueness
            }
            result[v.name].add(v.id); // Add id to the Set
          });
        });

        // Convert Set back to array before returning the result
        for (const key in result) {
          result[key] = Array.from(result[key]);
        }

        return result;
      };

      const calculateTotalPercent = (composition) => {
        return Object.values(composition).reduce((sum, value) => sum + parseInt(value, 10), 0);
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

      setProduct({
        ...product,
        tags: product?.productTags?.split(",").map(tag => tag.trim()),
        brandId: product?.brand?.brandId,
        taxonomy: product?.taxonomy?.name,
        barcode: barcodeString,
        gstId: product?.gst?.gstId,
        image: `${BASE_URL.replace("/api", "")}${product?.image}`,
        productCategories: await transformCategories(),
        prodVariants: transformData(),
        newProductVariants: product?.productVariants,
        priceSetting: adjustPriceSetting(product?.priceSetting),
        totalProductPercent: calculateTotalPercent(product?.fabricContent.composition)
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


  const handleCancel = () => {
    if (to && from) {
      return navigate(`${to}&from=${encodeURIComponent(from)}`)
    }
    let url = '/product/product/articles'
    if (page && size) {
      url = `${url}?page=${page}&size=${size}&search=${search}`
    }
    navigate(url, { state: { ...stateData, tabs: stateData.childTabs } })
  }

  return (
    <ProductContext.Provider value={{ product, handleChange, addProduct, setProduct, imageFile, setImageFile, inputError, setInputError }}>
      <B2BTabs
        tabsData={tabs}
        justify={"flex-start"}
        onClick={handleTabClick}
        activeId={activeTab}
        variant='default'
        margin='10px'
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
        {product.productId && activeTab < "6" ?
          <B2BButton
            name={"Update"}
            id={"Save"}
            onClick={handleProductSave}
            style={{ backgroundColor: 'green' }}
            disabled={!isFormValid} // Disable Save button if the form is not valid
          /> : ''}
        <B2BButton style={{ color: '#000' }} name="Back" onClick={() => handleCancel()} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />

      </div>
      <div style={{ minHeight: '50vh' }}>
        {renderActiveComponent()} {/* Render the component based on the active tab */}
      </div>
      <div className='productType-btn' style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
        {activeTab > "1" && <B2BButton name={'Back'} onClick={handleBackTab} />}
        {activeTab < "6" && <B2BButton name={'Next'} onClick={handleNextTab} />}
        {activeTab === "6" &&
          <B2BButton
            name={product?.productId ? "Update" : "Save"}
            id={product?.productId ? "Update" : "Save"}
            onClick={handleProductSave}
            style={{ backgroundColor: 'green' }}
            disabled={!isFormValid} // Disable Save button if the form is not valid
          />
        }
      </div>
    </ProductContext.Provider>
  );
};
export default CreateProduct;



