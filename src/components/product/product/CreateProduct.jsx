import React, { createContext, useEffect, useState } from 'react';
import B2BTabs from '../../../common/B2BTabs';
import ProductType from './ProductType';
import ProductCategory from './ProductCategory';
import ProductPrice from './ProductPrice';
import ProductTax from './ProductTax';
import B2BButton from '../../../common/B2BButton';
import ProductVariant from './ProductVariant';
import ProductCategorys from './ProductCategorys';
import ProductImage from './ProductImage';

export const ProductContext = createContext(null);

const CreateProduct = () => {
  const tabs = [
    { id: "1", name: "Product Type" },
    { id: "2", name: "Category Type" },
    { id: "3", name: "Tax" },
    { id: "4", name: "Variant" },
    { id: "5", name: "Price" },
    { id: "6", name: "Fabric Content" },
    { id: "7", name: "Image" },

  ];

  const initialState = {
    productId: '',
    articleName: '',
    articleCode: '',
    description: '',
    supplier: '',
    otherInformation: {
      skuPrefix: '',
      unitOfMeasures: [
        {
          type: 'SALES',
          isRoll: false,
          isKg: false,
        },
        {
          type: 'PURCHASE',
          isRoll: false,
          isKg: false,
        }
      ]
    },
    prodVariants: [],
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

    // commented codes are Not needed 

    // salesUOM: {
    //   type: '',
    //   isRoll: false,
    //   isKg: false,
    // },
    // purchaseUOM: {
    //   type: '',
    //   isRoll: false,
    //   isKg: false,
    // }
  }

  const [product, setProduct] = useState(initialState);
  const [activeTab, setActiveTab] = useState("1"); // Manage active tab as string

  useEffect(() => {
    // Any initialization logic if needed
  }, []);

  const checkDirectValue = (key) => {
    if (key === 'brandId') return true
  }

  // const handleChange = (event, fieldType) => {
  //   const { value, checked } = event.target;

  //   // if (fieldType === "salesUOM" || fieldType === "purchaseUOM") {
  //   //   setProduct((prev => ({
  //   //     ...prev, [fieldType]: {
  //   //       ...prev?.[fieldType],
  //   //       [value]: checked,
  //   //       type: fieldType
  //   //     }
  //   //   })))
  //   // }
  // };

  const handleChange = (event, fieldType) => {

    if (fieldType === "SALES" || fieldType === "PURCHASE") {
      const { value, checked } = event.target;
      setProduct(prevState => {
        const updatedUnitOfMeasures = prevState.otherInformation.unitOfMeasures.map(uom =>
          uom.type === fieldType ? { ...uom, [value]: checked } : uom
        );
        return {
          ...prevState, otherInformation: { ...prevState.otherInformation, unitOfMeasures: updatedUnitOfMeasures }
        };
      });
    } else if (fieldType === 'gst') {
      // Value will be directly available in event, so event.replace....
      const gstRateInt = parseInt(event?.replace('%', '')?.trim(), 10);
      setProduct((prev) => ({ ...prev, gst: gstRateInt }))
    } else {
      setProduct((prev => ({ ...prev, [fieldType]: checkDirectValue(fieldType) ? event : event.target.value })))
    }
  };



  const addProduct = async (prod) => {
    console.log(prod, "Add product API");
    // try {
    //   const res = await B2B_API.post(`product`, { json: prod }).json();
    //   console.log("Product added successfully:", res);
    // } catch (err) {
    //   console.error("Failed to Add Product", err);
    // }
  };

  const handleTabClick = (selectedTab) => {
    setActiveTab(selectedTab.id); // Set active tab based on selectedTab.id
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "1":
        return <ProductType />;
      case "2":
        return <ProductCategorys />;
      case "3":
        return <ProductTax />;
      case "4":
        return <ProductVariant />;
      case "5":
        return <ProductPrice />;
      case "6":
        return <div>Fabric Content</div>;
      case "7":
        return <ProductImage />; // Replace with actual Image component
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
      addProduct(product);
    }
  };

  // If product should be saved on next button click this function should be called into handleNextTab after setting Active Index
  const handleProductSave = () => {
    addProduct(product);
  };

  return (
    <ProductContext.Provider value={{ product, handleChange, addProduct, setProduct }}>
      <B2BTabs
        tabsData={tabs}
        justify={"flex-start"}
        onClick={handleTabClick}
        activeId={activeTab} // Set the active tab ID dynamically
        variant='default'
        margin='10px'
      />
      <div style={{ height: '50vh' }}>
        {renderActiveComponent()} {/* Render the component based on the active tab */}
      </div>

      <div className='productType-btn' style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem' }}>
        {activeTab > "1" && <B2BButton name={'Back'} onClick={handleBackTab} />}
        {activeTab < "7" && <B2BButton name={'Next'} onClick={handleNextTab} />}
        {activeTab === "7" && <B2BButton name={'Save'} onClick={handleProductSave} />}
      </div>
    </ProductContext.Provider>
  );
};

export default CreateProduct;
