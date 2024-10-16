import { faArrowTurnUp, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ActiveTabContext } from '../../../layout/Layout';
import notify from '../../../utils/Notification';
import './Category.css';

const CategoryInput = ({ level, name, onChange, onAdd, onRemove, children, disable }) => {
  return (
    <div style={{ marginLeft: level === 1 ? '0px' : `${level + 130}px`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <label style={{ width: '9rem' }}>Level {level}</label>
        {level < 4 && level > 1 && (<FontAwesomeIcon icon={faArrowTurnUp} style={{ transform: 'rotate(90deg)', marginRight: '20px' }} />)}
        <B2BInput
          type="text"
          value={name}
          onChange={(e) => onChange(e.target.value)} // Prevent change when disabled
          placeholder={`Level ${level} Category`}
          required
          style={{ padding: '12px', outline: 'none', width: '250px', border: '1px solid silver', borderRadius: '4px' }}
          disabled={disable}
        />
        {level > 1 && (<FontAwesomeIcon icon={faTrashCan} onClick={onRemove} style={{ cursor: 'pointer', marginLeft: '1rem', fontSize: '18px', color: '#FF6E61' }} />)}
      </div>
      {children}
      {level < 4 && (<button onClick={onAdd} className='cat-Btn' style={{ marginLeft: level === 1 ? '0px' : `${level + 130}px` }}> + Add Level {level + 1} </button>)}
    </div>
  );
};

const CategoryTree = ({ level = 1, categories, onCategoryChange, disable }) => {
  const handleCategoryChange = (index, newValue) => {
    const newCategories = [...categories];
    newCategories[index].name = newValue;
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
            disable={disable}
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
            <span style={{ width: '800px', height: '1px', border: '1px solid silver' }}></span>
          )}
        </div>
      ))}
    </>
  );
};

const Category = () => {
  const initialState = { name: '', parentId: null, productGroup: {}, child: [] };
  const { stateData } = useContext(ActiveTabContext);
  const [productCategories, setProductCategories] = useState([]);
  const [isCreateCategory, setIsCreateCategory] = useState(false);
  const [categoryTree, setCategoryTree] = useState([{ ...initialState }]);
  const [groups, setGroups] = useState([]);
  const [categoryRowCount, setCategoryRowCount] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [productCount, setProductCount] = useState({})
  const [types, setTypes] = useState('')
  const [isLevelOneDisabled, setIsLevelOneDisabled] = useState(false);

  const typesOptions = ["Fabric Type", "Fabric Content", "Others"];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      const response = await B2B_API.get(`product-category/${id}`).json();
      setCategoryTree(response.response);
      setIsCreateCategory(true);
      setIsLevelOneDisabled(true)
      setTypes(response.response[0]?.type)
    };
    fetchCategory();
    fetchGroup();
    fetchProductCount()
  }, [id]);

  const fetchGroup = async () => {
    const response = await B2B_API.get(`group`).json();
    setGroups(response.response);
  };

  const fetchProductCount = async () => {
    const res = await B2B_API.get('product/count-by-category').json()
    const response = res.response
    response['Fabric Content'] = res.response['Fabric Type']
    setProductCount(response)
  }

  const handleSelectChange = (value) => {
    const group = _.find(groups, gr => gr.name === value);
    setCategoryTree(prevTree => [{ ...prevTree[0], productGroup: group }]);
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

  const handleTypeSelectChange = (value) => {
    const isFabricType = value === "Others";

    if (isFabricType) {
      setTypes(value);
      setCategoryTree(prevTree => {
        const newTree = [...prevTree];
        newTree[0].name = id ? prevTree[0].name : '';
        return newTree;
      });
      if (!id) {
        setIsLevelOneDisabled(false);
      }
    } else {
      setTypes(value);
      setCategoryTree(prevTree => {
        const newTree = [...prevTree];
        newTree[0].name = value;
        newTree[0].type = value
        return newTree;
      });
      setIsLevelOneDisabled(true);
    }
  };
  const handleSave = async () => {
    if (!validateCategories(categoryTree)) {
      notify({
        title: "Error!!",
        message: 'Please fill out all category names before saving.',
        error: true,
        success: false
      });
      return;
    }
    try {
      const response = await B2B_API.post('product-category', { json: categoryTree[0] }).json();
      notify({
        title: "Success!!",
        message: id ? 'Category updated successfully.' : 'Category saved successfully.',
        error: false,
        success: true
      });
      setTypes('')
      setIsCreateCategory(false);
      fetchCategory()
      navigate('/product/product-hierarchy', { state: { ...stateData, tabs: stateData.childTabs } });
    } catch (error) {
      notify({
        title: "Error!!",
        message: error.message,
        error: true,
        success: false
      });
    }
  };

  const handleCancel = () => {
    setIsCreateCategory(false);
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('id');
    setCategoryTree([{ ...initialState }]);
    setTypes('')
    navigate('/product/product-hierarchy', { state: { ...stateData, tabs: stateData.childTabs } });
  };

  useEffect(() => {
    fetchCategory();
  }, []);


  const countLeafNodes = (node) => {
    let count = 0;
    const traverse = (node) => {
      if (!node.child || node.child.length === 0) {
        count += 1;
        return;
      }
      node.child.forEach(traverse);
    };
    traverse(node);
    return count;
  };

  const counts = productCategories.map(node => ({
    name: node.name,
    count: countLeafNodes(node),
  }));

  const categoryColumns = useMemo(() => [
    {
      id: 'serialNumber',
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
    },
    {
      id: 'categoryName',
      header: 'Category Name',
      accessorKey: 'name'
    },
    {
      id: 'attributeCount',
      header: 'Attribute Count',
      accessorFn: (row) => {
        const category = counts.find(c => c.name === row.name);
        return category ? category.count : 0;
      },
      size: 150,
    },
    {
      id: 'productCount',
      header: 'Product Count',
      accessorFn: (row) => {
        return productCount[row.name] || 0;
      },
      size: 150,
    },
    {
      id: 'status',
      header: 'Status',
      accessorKey: 'status',
      Cell: ({ cell, row }) => {
        const status = row.original.status;
        return (
          <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
            {status}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
      size: 100,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <IconPencil onClick={() => categoryEdit(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ], [counts]);



  const categoryEdit = (node) => {
    const categoryId = node.categoryId;
    navigate(`/product/product-hierarchy?id=${categoryId}`, { state: { ...stateData, tabs: stateData.childTabs } });
  };

  const sortCategories = (categories) => {
    return _.sortBy(categories, 'categoryId').map(category => ({
      ...category, child: category.child ? sortCategories(category.child) : []
    }));
  }

  const fetchCategory = async () => {
    try {
      const response = await B2B_API.get('product-category').json();
      const sortedData = sortCategories(response?.response);
      setProductCategories(sortedData || []);
    } catch (error) {
      notify({
        title: "Error!!",
        message: error.message,
        error: true,
        success: false
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h3 style={{ margin: '1rem 0.3rem' }} key={"division"}>Category Details</h3>
      <div className='product-category-container'>
        <div className='create-product-btn'>
          {
            isCreateCategory === false ?
              <B2BButton style={{ color: '#000' }} name="Create Category" onClick={() => { setIsCreateCategory(true); setIsLevelOneDisabled(true) }} leftSection={<IconPlus size={15} />} color={"rgb(207, 239, 253)"} />
              :
              <B2BButton style={{ color: '#000' }} name="Back" onClick={() => handleCancel()} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />
          }
        </div>
        <div>
          {
            isCreateCategory === false && (
              <B2BTableGrid
                columns={categoryColumns}
                data={productCategories}
                enableTopToolbar={true}
                enableGlobalFilter={true}
                enableFullScreenToggle={true}
                pagination={pagination}
                rowCount={categoryRowCount}
                onPaginationChange={setPagination}
              />
            )
          }
          {
            isCreateCategory === true && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className='group-input'>
                  <label>Group Name</label>
                  <B2BSelect
                    value={categoryTree[0].productGroup?.name}
                    data={groups.map(group => group.name)}
                    required={true}
                    onChange={(event) => handleSelectChange(event)}
                    clearable={true}
                  />
                  <label>Types</label>
                  {id ? <B2BInput
                    value={types}
                    disabled={true} /> :
                    <B2BSelect
                      value={types}
                      data={typesOptions}
                      required
                      onChange={handleTypeSelectChange}
                      clearable
                    />}
                </div>
                <CategoryTree
                  level={1}
                  categories={categoryTree}
                  onCategoryChange={(newTree) => setCategoryTree(newTree)}
                  disable={isLevelOneDisabled}
                />
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                  <B2BButton onClick={() => handleCancel()} name='Cancel' color='#ff0000' />
                  <B2BButton onClick={() => handleSave()} name={id ? 'Update' : 'Save'} color='rgb(26, 160, 70)' />
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Category;
