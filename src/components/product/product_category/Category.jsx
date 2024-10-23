import { faArrowTurnUp, faCirclePlus, faFilter, faFilterCircleXmark, faTrashCan } from '@fortawesome/free-solid-svg-icons';
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
import { Text } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import B2BModal from '../../../common/B2BModal';
import AddBrand from './AddBrand';

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
      {categories?.map((category, index) => (
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
  const initialState = { name: '', parentId: null, productGroup: {}, child: [], status: "ACTIVE" };
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
  const [status, setStatus] = useState('ACTIVE')
  const [openStatus, setOpenStatus] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const categoryStatus = queryParams.get('status');
  const navigate = useNavigate();

  const initialData = {
    name: "",
    status: "ACTIVE"
  }
  const [open, setOpen] = useState(false);
  const [modalContent, setModalContent] = useState(initialData);
  const [activeComponent, setActiveComponent] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      const response = await B2B_API.get(`product-category/${id}?status=${categoryStatus}`).json();
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

  const addGroup = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`group/save`, { json: modalContent }).json();
      setOpen(false)
      fetchGroup();
      notify({ id: 'create_group', message: response.message, success: true, error: false })
    } catch (error) {
      notify({ id: "add_group_error", message: error.message, success: false, error: true });
    }
  }

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
  }, [status, pagination.pageIndex, pagination.pageSize]);


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

  const handleStatusChange = (status) => {
    setStatus(status)
    setOpenStatus(false)
  }

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
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div>Status ({status})</div>
          <FontAwesomeIcon icon={openStatus ? faFilterCircleXmark : faFilter} style={{ marginLeft: '1.5rem', cursor: 'pointer' }} onClick={() => setOpenStatus(!openStatus)} />
          {
            openStatus && (
              <div className='status-dropdown'>
                <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
                  <Text size="xs" fw={800}>ACTIVE</Text>
                </div>
                <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
                  <Text size="xs" fw={800}>INACTIVE</Text>
                </div>
              </div>
            )
          }
        </div>
      ),
      id: 'status',
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
      id: 'Edit',
      header: 'Edit',
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
    navigate(`/product/product-hierarchy?id=${categoryId}&status=${node.status}`, { state: { ...stateData, tabs: stateData.childTabs } });
  };

  const sortCategories = (categories) => {
    return _.sortBy(categories, 'categoryId').map(category => ({
      ...category, child: category.child ? sortCategories(category.child) : []
    }));
  }

  const fetchCategory = async () => {
    try {
      const response = await B2B_API.get(`product-category?status=${status}`).json();
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

  const handleChange = (event) => {
    setCategoryTree(prevState => [
      { ...prevState[0], status: event.target.value }
    ]);
  }

  const handleOpenModal = (key) => {
    setActiveComponent(key)
    setModalContent(prev => ({ ...prev, title: key }))
    setOpen(true);
  }

  const handleModalChange = (event, key) => {
    let val = event.target.value
    setModalContent((prev => ({ ...prev, [key]:val.toUpperCase()})))
  }

  const handleClose = () => {
    setOpen(false)
    setModalContent(initialData);
  }


  const renderModalChild = () => {
    return <AddBrand onClose={handleClose} modalContent={modalContent} handleModalChange={handleModalChange} saveData={addGroup} />
  }

  return (
    <div className='grid-container'>
      <div className='user--container'>
        <header>Category Details</header>
        <div className='right--section'>
          {
            isCreateCategory === false ?
              <B2BButton style={{ color: '#000' }} name="Create Category" onClick={() => { setIsCreateCategory(true); setIsLevelOneDisabled(true) }} leftSection={<IconPlus size={15} />} color={"rgb(207, 239, 253)"} />
              :
              <B2BButton style={{ color: '#000' }} name="Back" onClick={() => handleCancel()} leftSection={<IconArrowLeft size={15} />} color={"rgb(207, 239, 253)"} />
          }
        </div>
      </div>
      {
        isCreateCategory ? (
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
              {(<FontAwesomeIcon icon={faCirclePlus} title={"masterNew"} onClick={() => handleOpenModal("Groupname")} />)}
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
            <div className="form-group status-container">
              <label className='form-label'>Status</label>
              <div className='radio-group'>
                <div className='status-block'>
                  <input
                    type="radio"
                    value="ACTIVE"
                    onChange={(event) => handleChange(event, 'status')}
                    checked={categoryTree[0]?.status === "ACTIVE"}
                    name="status"
                    id="status-active"
                  />
                  <label className='form-span radio' htmlFor="status-active">ACTIVE</label>
                </div>
                <div className='status-block'>
                  <input
                    type="radio"
                    value="INACTIVE"
                    onChange={(event) => handleChange(event, 'status')}
                    checked={categoryTree[0]?.status === "INACTIVE"}
                    name="status"
                    id="status-inactive"
                  />
                  <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                </div>
              </div>
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
        ) : (
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
      <B2BModal opened={open} size={'lg'} close={() => {
        setModalContent(initialData);
        setOpen(false)
      }}
      >
        {renderModalChild()}
      </B2BModal>
    </div>
  );
};

export default Category;
