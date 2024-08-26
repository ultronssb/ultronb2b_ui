import React, { useEffect, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect';
import './ProductCategory.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';

const ProductCategory = () => {
    const [category, setCategory] = useState('');
    const [categorys, setCategorys] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [filterCategories, setFilterCategories] = useState([])
    const [selecetedCategory, setSelectedCategory] = useState(null);
    const [countLevel, setCountLevel] = useState(1)

    console.log(filterCategories);
    


    useEffect(() => {
        getAllCategory();
    }, [])

    useEffect(() => {
        if (selecetedCategory) {
            if (_.size(selecetedCategory.child) == 0) {
                setOpenModal(false)
            } else {
                setCountLevel(prev => prev + 1)
                setFilterCategories(selecetedCategory.child)
            }
        }
    }, [selecetedCategory])

    const getAllCategory = async () => {
        try {
            const res = await B2B_API.get('product-category').json();
            setCategorys(res?.response);
            console.log(_.map(res.response, r => r.name))
            setFilterCategories(res?.response)

        } catch (err) {
            console.error("Failed to Fetch Category")
        }
    }

    const filterByParentId = (category, parentId) => {
        return _.filter(category, (c) => c.parentId === parentId);
    }

    const handleChange = (event, key) => {
        setCategory((prev) => ({ ...prev, [key]: event?.target?.value }))
    }

    const selectcategory = (cat) => {
        setCategory(prev => prev.concat(prev ? " / " : "").concat(cat.name))
        setSelectedCategory(cat);
    }
    const removeCategory = () => {
        setOpenModal(false)
        setCategory("")
        setSelectedCategory(null)
        setFilterCategories(categorys)
        setCountLevel(1)
    }
    return (
        // <div className='grid-container'>
        //     <form className='form-container'>
        <div>
            <div className="vd-g-col vd-g-s-12">
                <label>
                    <span className="vd-text-label vd-util-text-overflow-break-word vd-label">
                        Product categories
                        <span className="vd-text-supplementary vd-util-text-overflow-break-word vd-ml1">
                            Use category levels to filter your sales and inventory reports.
                        </span>
                    </span>
                </label>
                <div className="vd-popover-tether-target-wrapper vd-popover-tether-target vd-popover-tether-abutted vd-popover-tether-abutted-left vd-popover-tether-element-attached-left vd-popover-tether-target-attached-left vd-popover-tether-pinned vd-popover-tether-pinned-top">
                    <div>
                        <input placeholder="Select a category" readOnly="" className="vd-select vd-dropdown-input " type="text" value={category} onChange={(e) => handleChange(e)} onClick={() => setOpenModal(true)} />
                    </div>
                </div>
            </div>
            {
                openModal && (
                    <div className="vd-popover-tether-element-wrapper">
                        <div className="vd-popover vd-category-select-popover vd-popover--with-list" style={{ width: '500px' }}>
                            <div className="vd-popover-content">
                                <div className="vd-mt6 vd-ml6 vd-mr6 vd-mb3">
                                    <label htmlFor="search-input">
                                        <span className="vd-text-label vd-util-text-overflow-break-word vd-label">Search all categories</span>
                                    </label>
                                    <input className="vd-input" type="text" id="search-input" placeholder="Enter a category name" />
                                </div>
                                <div role="list">
                                    <div role="listitem" className="vd-mt4">
                                        <div className="vd-ml6 vd-mr6">
                                            <span className="vd-text-signpost vd-util-text-overflow-break-word">Level {countLevel}</span>
                                            <hr className="vd-hr vd-mt2" />
                                        </div>
                                        <div className='child-values'>
                                            {
                                                filterCategories.map((cat) => (
                                                    <ul className="vd-popover-list">
                                                        <li tabindex="0" className="vd-popover-list-item" onClick={() => selectcategory(cat)}>
                                                            <div className="helios-c-PJLV helios-c-PJLV-icepvqO-css">
                                                                <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                                                    <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                                        <span>
                                                                            <span className="">{cat.name}</span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {category && <div className="vd-popover-actions">
                                <div className="vd-action-bar vd-action-bar--inline category-list-footer vd-suggestion--footer">
                                    <div className="helios-c-PJLV helios-c-PJLV-idMyiqo-css">
                                        <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                            <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                <span className="vd-text-body vd-util-text-overflow-break-word">{category}</span>
                                            </div>
                                        </div>
                                        <div className="helios-c-PJLV helios-c-PJLV-iPJLV-css">
                                            <div className="helios-c-PJLV helios-c-PJLV-ilkBNdM-css">
                                                <button aria-label="Remove selected category" type="button" className="vd-btn vd-btn--icon-supplementary" onClick={() => removeCategory()}>
                                                    <FontAwesomeIcon className='fa vd-icon' icon={faTrash} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>}
                        </div>
                    </div>
                )
            }
        </div>
        //     </form>
        // </div>
    )
}

export default ProductCategory