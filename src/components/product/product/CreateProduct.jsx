import React, { createContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTabs from '../../../common/B2BTabs';
import FabricContent from './FabricContent';
import ProductCategorys from './ProductCategorys';
import ProductPrice from './ProductPrice';
import ProductTax from './ProductTax';
import ProductType from './ProductType';
import ProductVariant from './ProductVariant';
import notify from '../../../utils/Notification';

export const ProductContext = createContext(null);

const CreateProduct = () => {
  const [error, setError] = useState('');
  const tabs = [
    { id: "1", name: "Product Type" },
    { id: "2", name: "Category Type" },
    { id: "3", name: "Fabric Content" },
    { id: "4", name: "Tax" },
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
    gst: '',
    brandId: '',
  }

  const [product, setProduct] = useState(initialState);
  const [imageFile, setImageFile] = useState(null)
  const [activeTab, setActiveTab] = useState("1");

  useEffect(() => {
    // Any initialization logic if needed
  }, []);

  const checkDirectValue = (key) => {
    if (key === 'brandId') return true
  }

  const handleChange = (event, fieldType) => {
    if (fieldType === "UOM") {
      const { value, checked } = event.target;
      const { otherInformation } = product
      otherInformation.unitOfMeasures[value] = checked;
      setProduct(prevState => ({ ...prevState, otherInformation: otherInformation }))
    } else if (fieldType === 'gst') {
      const gstRateInt = parseInt(event?.replace('%', '')?.trim(), 10);
      setProduct((prev) => ({ ...prev, gst: gstRateInt }))
    } else {
      setProduct((prev => ({ ...prev, [fieldType]: checkDirectValue(fieldType) ? event : event.target?.value })))
    }
  };



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
        message: res.response.message || 'Product Save Successfully.',
        error: false,
        success: true,
      })
    } catch (err) {
      notify({
        title: 'Success!!',
        message: err || 'Failed to add product.',
        error: true,
        success: false,
      })
    }
  };

  const handleTabClick = (selectedTab) => {
    setActiveTab(selectedTab.id);
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
        return <ProductTax />;
      case "5":
        return <ProductPrice />;
      case "6":
        return <ProductVariant />;
      default:
        return <ProductType />;
    }
  };

  const handleBackTab = () => {
    const prevTabIndex = tabs.findIndex(tab => tab.id === activeTab) - 1;
    if (prevTabIndex >= 0) {
      setActiveTab(tabs[prevTabIndex].id);
    }
  };

  const handleNextTab = () => {
    const nextTabIndex = tabs.findIndex(tab => tab.id === activeTab) + 1;
    if (nextTabIndex < tabs.length) {
      setActiveTab(tabs[nextTabIndex].id);
    }
  };

  // If product should be saved on next button click this function should be called into handleNextTab after setting Active Index
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


  return (
    <ProductContext.Provider value={{ product, handleChange, addProduct, setProduct, imageFile, setImageFile }}>
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
        {activeTab === "6" && <B2BButton name={'Save'} onClick={handleProductSave} />}
      </div>
    </ProductContext.Provider>
  );
};

export default CreateProduct;
