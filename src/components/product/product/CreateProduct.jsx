import React, { createContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTabs from '../../../common/B2BTabs';
import FabricContent from './FabricContent';
import ProductCategorys from './ProductCategorys';
import ProductPrice from './ProductPrice';
import ProductType from './ProductType'
import ProductTax from './ProductTax';
import ProductVariant from './ProductVariant';
import notify from '../../../utils/Notification';
import ProductDimension from './ProductDimension';
import _, { isEmpty, isNull } from 'lodash';

export const ProductContext = createContext(null);

const CreateProduct = () => {
  const [error, setError] = useState('');
  const tabs = [
    { id: "1", name: "Product Type" },
    { id: "2", name: "Category Type" },
    { id: "3", name: "Fabric Content" },
    { id: "4", name: "Dimensions" },
    { id: "5", name: "Price" },
    { id: "6", name: "Variant" },

  ];

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
    productCategories: {

    },
    fabricContent: {
      fccCode: "",
      composition: {}
    },

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
  }
  const [canChangeTab, setCanChangeTab] = useState(false);
  const [product, setProduct] = useState(initialState);
  const [imageFile, setImageFile] = useState(null)
  const [activeTab, setActiveTab] = useState("1");
  const [isFormValid, setIsFormValid] = useState(false);
  const [inputError, setInputError] = useState({
    articleNameError: false,
    articleNameErrorMessage: '',
    brandIdError: false,
    brandIdErrorMessage: '',
    barcodeError: false,
    barcodeErrorMessage: '',
    categoryError: false,
    categoryErrorMessage: '',
    fabricContentError: false,
    fabricContentErrorMessage: '',
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

  })

  useEffect(() => {
    setIsFormValid(validateProductVariants());
  }, [product?.prodVariants]);

  const checkDirectValue = (key) => {
    if (key === 'brandId') return true
  }

  const validateProductVariants = () => {
    return !(
      isEmpty(product?.prodVariants) ||
      !Object.values(product.prodVariants).some(variant => variant.length > 0)
    );
  };


  const handleChange = (event, fieldType) => {
    const value = event?.target?.type === 'checkbox' ? event?.target?.checked : event?.target?.value;
    // if (value) {
    // setInputError((prev) => ({ ...prev, [fieldType + 'Error']: false, [fieldType + 'ErrorMessage']: '' }))
    // }
      setInputError("")

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
    } else {
      setProduct(prev => ({
        ...prev,
        [fieldType]: checkDirectValue(fieldType) ? event : event.target?.value,
      }));
    }
    setInputError(prev => ({
      ...prev,
      [`${fieldType}ErrorMessage`]: ''
    }));
  };

  // const handleChange = (event, fieldType) => {
  //   const value = event?.target?.type === 'checkbox' ? event?.target?.checked : event?.target?.value;

  //   if (fieldType === "UOM") {
  //     const { value, checked } = event.target;
  //     setProduct(prevState => ({
  //       ...prevState,
  //       otherInformation: {
  //         ...prevState.otherInformation,
  //         unitOfMeasures: {
  //           ...prevState.otherInformation.unitOfMeasures,
  //           [value]: checked
  //         }
  //       }
  //     }));
  //   } else if (fieldType === 'gstId') {
  //     setProduct(prev => ({ ...prev, gstId: value }));
  //   } else if (fieldType.includes('.')) {
  //     const [parent, child] = fieldType.split('.');
  //     setProduct(prev => ({
  //       ...prev,
  //       [parent]: {
  //         ...prev[parent],
  //         [child]: value
  //       }
  //     }));
  //   } else {
  //     setProduct(prev => ({
  //       ...prev,
  //       [fieldType]: checkDirectValue(fieldType) ? value : event.target?.value,
  //     }));
  //   }

  //   // Clear specific errors related to the field being changed
  //   if (fieldType === 'productCategories') {
  //     setInputError(prev => ({
  //       ...prev,
  //       categoryError: false,
  //       categoryErrorMessage: ''
  //     }));
  //   } else {
  //     setInputError(prev => {
  //       const newErrors = { ...prev };
  //       delete newErrors[`${fieldType}Error`];
  //       delete newErrors[`${fieldType}ErrorMessage`];
  //       return newErrors;
  //     });
  //   }
  // };




  // const handleChange = (event, fieldType) => {
  //   const { name, value, checked, type } = event.target;

  //   // Determine the new value
  //   const newValue = type === 'checkbox' ? checked : value;

  //   // Update product state based on fieldType
  //   if (fieldType === "UOM") {
  //     // Handle unit of measure changes
  //     const { value, checked } = event.target;
  //     const { otherInformation } = product;
  //     otherInformation.unitOfMeasures[value] = checked;
  //     setProduct(prevState => ({ ...prevState, otherInformation }));
  //   } else if (fieldType === 'gstId') {
  //     // Handle GST ID change
  //     setProduct(prev => ({ ...prev, gstId: newValue }));
  //   } else if (fieldType.includes('.')) {
  //     // Handle nested field changes (e.g., metrics.weight)
  //     const [parent, child] = fieldType.split('.');
  //     setProduct(prev => ({
  //       ...prev,
  //       [parent]: {
  //         ...prev[parent],
  //         [child]: newValue
  //       }
  //     }));
  //   } else {
  //     // Handle direct field changes
  //     setProduct(prev => ({
  //       ...prev,
  //       [fieldType]: newValue
  //     }));
  //   }

  //   // Clear the error message for the field if value is valid
  //   setInputError(prev => ({
  //     ...prev,
  //     [`${fieldType}ErrorMessage`]: '',
  //   }));
  // }

  const addProduct = async (prod) => {
    try {
      const res = await B2B_API.post(`product`, {
        body: prod,
        // headers: {
        //   "Content-Type": "multipart/form-data" // Set Content-Type for this specific request
        // }
      }).json();
      setProduct(initialState);
      setImageFile(null);
      setActiveTab("1");
      notify({
        title: 'Success!!',
        message: res?.message || 'Product Save Successfully.',
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

  const handleTabClick = () => {
  };
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "1":
        return <ProductType />;
      case "2":
        return <ProductCategorys />;
      case "3":
        return <FabricContent />;
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
  console.log(product, "pro");


  const handleBackTab = () => {
    const prevTabIndex = tabs.findIndex(tab => tab.id === activeTab) - 1;
    if (prevTabIndex >= 0) {
      setActiveTab(tabs[prevTabIndex].id);
    }
  };

  const handleNextTab = () => {
    let isValid = true;
    const errors = {};

    switch (activeTab) {
      case "1": // Product Type Tab
        if (isEmpty(product?.articleName)) {
          errors.articleNameError = true;
          errors.articleNameErrorMessage = "Product Name is Required!";
          isValid = false;
        }
        if (isEmpty(product?.brandId)) {
          errors.brandIdError = true;
          errors.brandIdErrorMessage = "Brand Name is Required!";
          isValid = false;
        }
        break;

      case "2": // validate for category
        if (isEmpty(product.productCategories)) {
          errors.categoryError = true,
            errors.categoryErrorMessage = 'Category not be null !!'
          isValid = false;
        }

        break;

      // case "2": // Validate for Category
      //   if (isEmpty(product.productCategories)) {
      //     errors.categoryError = true;
      //     errors.categoryErrorMessage = 'Categories cannot be null!';
      //     isValid = false;
      //   } else {
      //     const categoryErrors = product.productCategories.map((category, index) => {
      //       if (!category.key) {
      //         return `Category ${index + 1} must be selected.`;
      //       }

      //       if (!category.value || isEmpty(category.value.child) || category.value.child.length === 0) {
      //         return `Category ${category.key || index + 1} must have at least one sub-category selected.`;
      //       }

      //       return '';
      //     });

      //     const filteredCategoryErrors = categoryErrors.filter(error => error !== '');

      //     if (filteredCategoryErrors.length > 0) {
      //       errors.categoryError = true;
      //       errors.categoryErrorMessage = filteredCategoryErrors.join(' ');
      //       isValid = false;
      //     }
      //   }
      // break;


      case "3": // Validate Fabric Content (FCC)
        const isFabricContentValid = product?.fabricContent?.composition &&
          Object.keys(product.fabricContent.composition).length > 0 &&
          Object.values(product.fabricContent.composition).every(value => value);

        if (!isFabricContentValid) {
          errors.fabricContentError = true;
          errors.fabricContentErrorMessage = "FCC must be selected !!";
          isValid = false;
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
        break;
      case "6": // Validate Variants
        // const hasSelectedVariants = product?.prodVariants &&
        //   Object.keys(product.prodVariants).some(key => product.prodVariants[key].length > 0);

        if (isEmpty(product.prodVariants)) {
          errors.variantError = true;
          errors.variantErrorMessage = 'At least one variant must be selected!';
          isValid = false;
        }
        break;
    }

    // Update error state
    setInputError(prev => ({ ...prev, ...errors }));

    // Only proceed to the next tab if there are no errors
    if (isValid) {
      const nextTabIndex = tabs.findIndex(tab => tab.id === activeTab) + 1;
      if (nextTabIndex < tabs.length) {
        setActiveTab(tabs[nextTabIndex].id);
      }
    }
    // if (isEmpty(product?.articleName)) {
    //   setInputError((prev) => ({
    //     ...prev,
    //     articleNameError: true,
    //     articleNameErrorMessage: "Product Name is Required!",
    //   }));
    //   return;
    // }
    // if (isEmpty(product?.brandId) || isNull(product.brandId)) {
    //   setInputError((prev) => ({
    //     ...prev,
    //     brandIdError: true,
    //     brandIdErrorMessage: "Brand is Required!",
    //   }));
    //   return;
    // }
    // if (isEmpty(product?.categoryId)) {
    //   setInputError((prev) => ({
    //     ...prev,
    //     categoryError: true,
    //     categoryErrorMessage: "Category Name is Required"
    //   }))
    //   return;
    // }
  }





  const handleProductSave = async () => {
    const formData = new FormData();
    let updatedProduct = {
      ...product,
      prodVariants: { ...product.prodVariants },
      productCategories: [...product.productCategories]
    };

    updatedProduct.prodVariants = Object.values(updatedProduct.prodVariants);

    updatedProduct.productCategories = updatedProduct.productCategories
      ? updatedProduct.productCategories.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {})
      : {};
    formData.append("product", JSON.stringify(updatedProduct))
    formData.append("image", imageFile)
    addProduct(formData);

  };

  console.log(product);

  return (
    <ProductContext.Provider value={{ product, handleChange, addProduct, setProduct, imageFile, setImageFile, inputError, setInputError }}>
      {error && <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>}
      <B2BTabs
        tabsData={tabs}
        justify={"flex-start"}
        onClick={handleTabClick}
        activeId={activeTab}
        variant='default'
        margin='10px'
      />
      <div style={{ minHeight: '50vh' }}>
        {renderActiveComponent()} {/* Render the component based on the active tab */}
      </div>
      <div className='productType-btn' style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
        {activeTab > "1" && <B2BButton name={'Back'} onClick={handleBackTab} />}
        {activeTab < "6" && <B2BButton name={'Next'} onClick={handleNextTab} />}
        {activeTab === "6" &&
          <B2BButton
            name={'Save'}
            onClick={handleProductSave}
            disabled={!isFormValid} // Disable Save button if the form is not valid
          />
        }
      </div>
    </ProductContext.Provider>
  );
};
export default CreateProduct;



