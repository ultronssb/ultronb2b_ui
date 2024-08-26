import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MultiSelect } from '@mantine/core';
import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import './ProductVariant.css';
import { ProductContext } from './CreateProduct';

const ProductVariant = () => {

    const {product: product, setProduct: setProduct, handleChange: handleChange} = useContext(ProductContext)

    const [attributes, setAttributes] = useState({});
    const [selectedPairs, setSelectedPairs] = useState([{ key: '', values: [] }]);

    useEffect(() => {
        fetchVariant();
    }, []);

    const fetchVariant = async () => {
        try {
            const response = await B2B_API.get('variant').json();
            const groupedVariants = _.groupBy(response.response, 'name');
            setAttributes(groupedVariants);
        } catch (error) {
            console.error('Error fetching variants:', error);
        }
    };

    const handleSelectChange = (index, selectedKey) => {
        const newPairs = [...selectedPairs];
        newPairs[index].key = selectedKey;
        newPairs[index].values = [];
        setSelectedPairs(newPairs);
    };

    const handleMultiSelectChange = (index, selectedValues) => {
        const newPairs = [...selectedPairs];
        newPairs[index].values = selectedValues;
        setSelectedPairs(newPairs);
        getListOfVaraints(newPairs)
        setProduct((prev => ({...prev, prodVariants : getListOfVaraints(selectedPairs)})))
    };

    // This method will return the List<List<String>> productVariants for all the selected variant group
    const getListOfVaraints = (obj) => {
      const prodVariants = obj.map(value => value.values)
      return prodVariants;
    }

    const addNewPair = () => {
        setSelectedPairs([...selectedPairs, { key: '', values: [] }]);
    };

    const removePair = (index) => {
        const newPairs = [...selectedPairs];
        newPairs.splice(index, 1);
        setSelectedPairs(newPairs);
    };

    const getAvailableKeys = (currentIndex) => {
        const selectedKeys = selectedPairs.map(pair => pair.key);
        return Object.keys(attributes).filter(key => !selectedKeys.includes(key) || selectedPairs[currentIndex].key === key);
    };
    

    return (
        <section className="product-variant-section">
            <div className="product-variant-section-wrap">
                <h2 className="product-variant-text-sub-heading">Variants</h2>
                <div className="product-variant-g-row">
                    <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-3 product-variant-grid-settings-item">
                        Choose up to three variable attributes for this product to create and manage SKUs and their inventory levels.
                    </div>
                    <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-9">
                        <div>
                            <div className="product-variant-g-row">
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                    <label>
                                        <span className="product-variant-text-label">Attribute (e.g. colour)</span>
                                    </label>
                                </div>
                                <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8">
                                    <label>
                                        <span className="product-variant-text-label">Value (e.g. Green)</span>
                                    </label>
                                </div>
                            </div>
                            {selectedPairs.map((pair, index) => (
                                <div key={index} className="product-variant-g-row">
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                        <div className="product-variant-flex">
                                            <div className="product-variant-flex-grow-1 product-variant-mr2">
                                                <div className="product-variant-popover-tether-target-wrapper">
                                                    <div className="product-variant-autocomplete-input-container">
                                                        <B2BSelect
                                                        value={pair.key}
                                                        data={getAvailableKeys(index)}
                                                        clearable={true}
                                                        onChange={(e)=>handleSelectChange(index,e)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8 product-variant-mb2">
                                        <div className="cn-attribute-values-row">
                                            <div className="cn-attribute-values">
                                                <div className="product-variant-lozenge-group">
                                                    <MultiSelect 
                                                    // value={attributes.name}
                                                    style={{width:'100%'}}
                                                    data={attributes[pair.key]?.filter(item => item.status === 'ACTIVE').map(item => item.value)}
                                                    // onChange={()=>handleSelectChange(attributes)}
                                                    onChange={(values) => handleMultiSelectChange(index, values)}
                                                    />
                                                </div>
                                            </div>
                                            {index > 0 && (
                                                <button
                                                    type="button"
                                                    className="product-variant-btn product-variant-btn--icon-no product-variant-ml2"
                                                    onClick={() => removePair(+index)}
                                                >
                                                    <FontAwesomeIcon className="fa product-variant-icon" icon={faTrash} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="product-variant-g-row">
                                {_.size(attributes) >=  _.size(selectedPairs) && (
                                    <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
                                        <button
                                            type="button"
                                            className="product-variant-btn product-variant-btn--text-go"
                                            onClick={addNewPair}
                                        >
                                            <FontAwesomeIcon className="fa product-variant-icon product-variant-mr2" icon={faPlus} />
                                            Add another attribute
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductVariant;




// import React, { useEffect, useState } from 'react';
// import './ProductVariant.css';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
// import { Modal } from '@mantine/core';
// import { B2B_API } from '../../../api/Interceptor';

// const ProductVariant = () => {
//     const initialValue = {
//         name: '',
//         value: '',
//     };

//     const [openModal, setOpenModal] = useState(false);
//     const [activeIndex, setActiveIndex] = useState(null);
//     const [attributes, setAttributes] = useState([{ ...initialValue }]);
//     const [variantLists, setVariantLists] = useState([]);
//     const [searchValue, setSearchValue] = useState('');

//     const selectVariant = (variantName) => {
//         const newAttributes = [...attributes];
//         newAttributes[activeIndex] = { ...newAttributes[activeIndex], name: variantName };
//         setAttributes(newAttributes);
//         setOpenModal(false);
//     };

//     useEffect(() => {
//         fetchVariant();
//     }, []);

//     const fetchVariant = async () => {
//         try {
//             const response = await B2B_API.get('variant');
//             const variants = await response.json();
//             setVariantLists(variants);
//         } catch (error) {
//             console.error('Error fetching variants:', error);
//         }
//     };

//     console.log(variantLists);
    

//     const addAttribute = () => {
//         setAttributes([...attributes, { ...initialValue }]);
//     };

//     const removeAttribute = (index) => {
//         setAttributes(attributes.filter((_, i) => i !== index));
//     };

//     const handleChange = (index, field, value) => {
//         const newAttributes = [...attributes];
//         newAttributes[index] = { ...newAttributes[index], [field]: value };
//         setAttributes(newAttributes);
//     };

//     const openAttributeModal = (index) => {
//         setActiveIndex(index);
//         setOpenModal(true);
//     };

//     return (
//         <section className="product-variant-section">
//             <div className="product-variant-section-wrap">
//                 <h2 className="product-variant-text-sub-heading">Variants</h2>
//                 <div className="product-variant-g-row">
//                     <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-3 product-variant-grid-settings-item">
//                         Choose up to three variable attributes for this product to create and manage SKUs and their inventory levels.
//                     </div>
//                     <div className="product-variant-g-col product-variant-g-s-12 product-variant-g-m-9">
//                         <div>
//                             <div className="product-variant-g-row">
//                                 <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
//                                     <label>
//                                         <span className="product-variant-text-label">Attribute (e.g. colour)</span>
//                                     </label>
//                                 </div>
//                                 <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8">
//                                     <label>
//                                         <span className="product-variant-text-label">Value (e.g. Green)</span>
//                                     </label>
//                                 </div>
//                             </div>
//                             {attributes.map((attribute, index) => (
//                                 <div key={index} className="product-variant-g-row">
//                                     <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
//                                         <div className="product-variant-flex">
//                                             <div className="product-variant-flex-grow-1 product-variant-mr2">
//                                                 <div className="product-variant-popover-tether-target-wrapper">
//                                                     <div className="product-variant-autocomplete-input-container">
//                                                         <input
//                                                             onClick={() => openAttributeModal(index)}
//                                                             readOnly
//                                                             value={attribute.name}
//                                                             type="text"
//                                                             className="product-variant-select product-variant-dropdown-input"
//                                                             spellCheck="false"
//                                                             placeholder="Choose a variant attribute"
//                                                         />
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-8 product-variant-mb2">
//                                         <div className="cn-attribute-values-row">
//                                             <div className="cn-attribute-values">
//                                                 <div className="product-variant-lozenge-group">
//                                                     <input
//                                                         className="product-variant-lozenge-group-input"
//                                                         value={attribute.value}
//                                                         onChange={(e) => handleChange(index, 'value', e.target.value)}
//                                                     />
//                                                 </div>
//                                             </div>
//                                             {index > 0 && (
//                                                 <button
//                                                     type="button"
//                                                     className="product-variant-btn product-variant-btn--icon-no product-variant-ml2"
//                                                     onClick={() => removeAttribute(index)}
//                                                 >
//                                                     <FontAwesomeIcon className="fa product-variant-icon" icon={faTrash} />
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             ))}
//                             <div className="product-variant-g-row">
//                                 {attributes.length < 3 && (
//                                     <div className="product-variant-g-col product-variant-g-s-6 product-variant-g-m-4">
//                                         <button
//                                             type="button"
//                                             className="product-variant-btn product-variant-btn--text-go"
//                                             onClick={addAttribute}
//                                         >
//                                             <FontAwesomeIcon className="fa product-variant-icon product-variant-mr2" icon={faPlus} />
//                                             Add another attribute
//                                         </button>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Modal opened={openModal} onClose={() => setOpenModal(false)}>
//                 <Modal.Overlay />
//                 <Modal.Content>
//                     <Modal.Header>
//                         <Modal.Title>Variant Attribute</Modal.Title>
//                         <Modal.CloseButton />
//                     </Modal.Header>
//                     <Modal.Body>
//                         <div className="product-variant-text-label product-variant-popover-search-label">
//                             <span>Search all variant attributes</span>
//                         </div>
//                         <input
//                             className="product-variant-input product-variant-autocomplete-input"
//                             type="text"
//                             placeholder="Enter a variant attribute name"
//                             value={searchValue}
//                             onChange={(e) => setSearchValue(e.target.value)}
//                         />
//                         {/* {variantLists
//                             .filter((variantName) =>
//                                 variantName.toLowerCase().includes(searchValue.toLowerCase())
//                             )
//                             .map((variantName, index) => (
//                                 <ol key={index} className="product-variant-popover-list">
//                                     <li
//                                         className="product-variant-popover-list-item"
//                                         onClick={() => selectVariant(variantName)}
//                                     >
//                                         <div className="product-variant-id-badge__header-title">
//                                             <span>{variantName}</span>
//                                         </div>
//                                     </li>
//                                 </ol>
//                             ))} */}
//                     </Modal.Body>
//                 </Modal.Content>
//             </Modal>
//         </section>
//     );
// };

// export default ProductVariant;
