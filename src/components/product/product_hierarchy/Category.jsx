import { faArrowTurnUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BSelect from '../../../common/B2BSelect';
import notify from '../../../utils/Notification';
import './Category.css';

const CategoryInput = ({ level, name, onChange, onAdd, onRemove, children }) => {
  return (
    <div style={{ marginLeft: level === 1 ? '0px' : `${level + 130}px`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <label style={{width:'110px'}}>Level {level}</label>
        {level < 4 && level > 1 && (<FontAwesomeIcon icon={faArrowTurnUp} style={{ transform: 'rotate(90deg)', marginRight: '20px' }} />)}
        <input type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Level ${level} Category`}
          required
          style={{ padding: '12px', outline: 'none', width: '250px', border: '1px solid silver', borderRadius: '4px' }}
        />
        {level > 1 && (<FontAwesomeIcon icon={faTrashCan} onClick={onRemove} style={{ cursor: 'pointer', marginLeft: '1rem', fontSize: '18px', color: '#FF6E61' }} />)}
      </div>
      {children}
      {level < 4 && (<button onClick={onAdd} className='cat-Btn' style={{ marginLeft: level === 1 ? '0px' : `${level + 130}px`, }}> + Add Level {level + 1} </button>)}
    </div>
  );
};


const CategoryTree = ({ level = 1, categories, onCategoryChange }) => {
  const handleCategoryChange = (index, newValue) => {
    const newCategories = [...categories];
    newCategories[index].name = newValue?.trim();
    onCategoryChange(newCategories);
  };

  const handleAddSubCategory = (index) => {
    const newCategories = [...categories];
    newCategories[index].child.push({ name: '', parentId: newCategories[index].name, child: [] });
    onCategoryChange(newCategories);
  };

  const handleRemoveCategory = (index) => {
    const newCategories = categories.filter((_, i) => i !== index);
    onCategoryChange(newCategories);
  };

  return (
    <>
      {categories.map((category, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column', marginTop: '2rem', gap: '1rem' }}>
          <CategoryInput
            level={level}
            name={category.name}
            onChange={(newValue) => handleCategoryChange(index, newValue)}
            onAdd={() => handleAddSubCategory(index)}
            onRemove={() => handleRemoveCategory(index)}
          >
            <CategoryTree
              level={level + 1}
              categories={category.child}
              onCategoryChange={(child) => {
                const newCategories = [...categories];
                newCategories[index].child = child;
                onCategoryChange(newCategories);
              }}
            />
          </CategoryInput>
          {level === 2 && (
            <>
              <span style={{ width: '800px', height: '1px', border: '1px solid silver', }}></span>
            </>
          )}
        </div>
      ))}
    </>
  );
};

const Category = () => {
  const [categoryTree, setCategoryTree] = useState([{ name: '', parentId: null, productGroup: {}, child: [] }]);
  const [groups, setGroups] = useState([]);
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return
      const response = await B2B_API.get(`product-category/${id}`).json();
      setCategoryTree(response.response);
    };

    fetchCategory();
    fetchGroup();
  }, [id]);

  const fetchGroup = async () => {
    const response = await B2B_API.get(`group`).json();
    setGroups(response.response);
  }

  const handleSelectChange = (value) => {
    console.log(groups, value);
    const group = _.find(groups, gr => gr.name === value)
    console.log(group)

    setCategoryTree(prevTree => [
      {
        ...prevTree[0],
        productGroup: group
      }
    ]);

  };


  const validateCategories = (categories) => {
    for (const category of categories) {
      if (category.name.trim() === '') {
        return false;
      }
      if (!validateCategories(category.child)) {
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateCategories(categoryTree)) {
      notify({
        title: "Error!!",
        message: 'Please fill out all category names before saving.',
        error: true,
        success: false
      })
      return;
    }
    try {
      const response = await B2B_API.post('product-category', { json: categoryTree[0] }).json();
      notify({
        title: "Success!!",
        message: 'Category save successfully.',
        error: false,
        success: true
      })
      navigate(`/product/product-hierarchy`);
    } catch (error) {
      notify({
        title: "Error!!",
        message: error.message,
        error: true,
        success: false
      })
    }
  };


  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '1rem' }}>
      <h3>Category Information</h3>
      <div className='group-input'>
        <label>Group Name</label>
        <B2BSelect
          value={categoryTree[0].productGroup?.name}
          data={groups.map(group => (group.name))}
          required={true}
          onChange={(event) => handleSelectChange(event)}
          clearable={true}
        />
      </div>
      <CategoryTree
        level={1}
        categories={categoryTree}
        onCategoryChange={(newTree) => setCategoryTree(newTree)}
      />
      <B2BButton onClick={() => handleSave()} name='Save' color='rgb(26, 160, 70)' />
      {/* <pre>{JSON.stringify(categoryTree, null, 2)}</pre> */}
    </div>
  )
}
export default Category;