import { Button, Checkbox, FileButton } from '@mantine/core';
import { IconArrowLeft } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../api/EndPoints';
import { B2B_API } from '../../api/Interceptor';
import B2BButton from '../../common/B2BButton';
import B2BInput from '../../common/B2BInput';
import B2BTableGrid from '../../common/B2BTableGrid';
import B2BTextarea from '../../common/B2BTextarea';
import { ActiveTabContext } from '../../layout/Layout';
import notify from '../../utils/Notification';
import './CollectionCreation.css';

const CollectionCreation = () => {
  const { stateData } = useContext(ActiveTabContext);
  const initialState = {
    name: '',
    description: '',
    image: '',
    product: [],
    status: 'ACTIVE',
  };

  const [collection, setCollection] = useState(initialState);
  const [products, setProducts] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');

  useEffect(() => {
    const fetchCollection = async () => {
      if (!id) return;
      const res = await B2B_API.get(`collections/get?id=${id}`).json();
      setCollection(res.response);
      const productIds = Array.from(new Set(res.response.product.map(pro => pro.productId)));
      setSelectedProductIds(productIds);
      setImageFile(res.response.image);
    };
    fetchCollection();
  }, [id]);

  useEffect(() => {
    fetchProducts();
  }, [pagination]);

  const fetchProducts = async () => {
    try {
      const res = await B2B_API.get(`product/view?page=${pagination.pageIndex}&size=${pagination.pageSize}`).json();
      const data = res?.response?.content || [];
      setRowCount(res?.response?.totalElements || 0);
      setProducts(data);
    } catch (error) {
      setIsError(true);
      notify({
        error: true,
        success: false,
        title: error?.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const collectionFields = [
    {
      id: 1,
      name: "Collection ID",
      fieldType: "textField",
      value: collection.collectionId,
      onChange: (event) => handleChange(event, 'collectionId'),
      disabled: true,
    },
    {
      name: "Collection Name",
      type: 'text',
      fieldType: "textField",
      value: collection.name,
      onChange: (event) => handleChange(event, 'name'),
      disabled: false,
    },
    {
      name: "Collection Image",
      fieldType: "image",
      value: collection.image,
      onChange: (event) => handleFileChange(event, 'image'),
      disabled: false,
    },
    {
      name: "Collection Description",
      type: "text",
      fieldType: 'textArea',
      value: collection.description,
      onChange: (event) => handleChange(event, 'description'),
      disabled: false,
    },
    {
      label: "Status",
      type: 'radio',
      value: collection?.status,
      fieldType: 'radioField',
      options: [
        { label: "ACTIVE", value: "ACTIVE" },
        { label: "INACTIVE", value: "INACTIVE" }
      ],
      onChange: (event) => handleChange(event, "status"),
      name: "status",
      checked: collection?.status
    },
  ];

  const handleChange = (event, key) => {
    const { value } = event.target;
    setCollection(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const fileChange = (file) => {
    const MAX_SIZE_BYTES = 3 * 1024 * 1024;
    if (file) {
      if (file.size > MAX_SIZE_BYTES) {
        notify({
          id: "file_size_error",
          title: "File Size Error",
          message: "File size exceeds the 3MB limit for the Image!",
          error: true,
          success: false,
        });
        setImageFile(null);
        setCollection(prev => ({
          ...prev,
          image: '',
        }));
      } else {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCollection(prev => ({
            ...prev,
            image: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImageFile(null);
      setCollection(prev => ({
        ...prev,
        image: '',
      }));
    }
  };

  const columns = useMemo(() => [
    {
      header: 'Action',
      mainTableHeaderCellProps: { align: 'center' },
      mainTableBodyCellProps: { align: 'center' },
      Cell: ({ row }) => {
        const isChecked = Array.isArray(selectedProductIds) && selectedProductIds.includes(row.original.productId);
        return (
          <Checkbox
            onChange={() => selectProduct(row.original)}
            checked={isChecked}
          />
        );
      },
    },
    {
      header: 'Product Id',
      accessorKey: 'productId',
    },
    {
      header: 'Product Name',
      accessorKey: 'articleName',
    },
    {
      header: 'SKU ID',
      accessorKey: 'articleCode',
    },
    {
      header: 'Product Category',
      accessorKey: 'productCategories.Fabric Type.name',
    },
    {
      header: 'Brand',
      accessorKey: 'brand.name',
    },
    {
      header: 'Image 1',
      accessorKey: 'image',
      Cell: ({ cell }) => {
        const imagePath = cell.row.original.image;
        const fullImageUrl = `${BASE_URL.replace("/api", "")}${imagePath}`;
        return (
          <img src={fullImageUrl} alt="Product" style={{ width: '50px', height: 'auto' }} />
        );
      },
    },
    {
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
  ], [selectedProductIds]);

  const sortedProducts = products.sort((a, b) => {
    return a.productId.localeCompare(b.productId);
  });

  const selectProduct = (product) => {
    const productId = product.productId;
    const isSelected = Array.isArray(selectedProductIds) && selectedProductIds.includes(productId);
    setSelectedProductIds(prevSelectedIds => {
      const newSelectedIds = isSelected ? prevSelectedIds.filter(id => id !== productId) : [...prevSelectedIds, productId];
      const currentProducts = collection.product;
      const newCollectionProducts = isSelected ? currentProducts.filter(prod => prod.productId !== productId) : [...currentProducts, product];
      setCollection(prevCollection => ({
        ...prevCollection,
        product: newCollectionProducts
      }));
      return Array.isArray(newSelectedIds) ? newSelectedIds : [];
    });
  };


  const handleCancel = () => {
    navigate('/inventory/collections', { state: { ...stateData, tabs: stateData.childTabs } });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("collection", new Blob([JSON.stringify(collection)], { type: 'application/json' }));
    if (imageFile) {
      formData.append("image", imageFile);
    }
    try {
      setIsLoading(true);
      const response = await B2B_API.post('collections', { body: formData }).json();
      setCollection(initialState);
      setImageFile(null)
      notify({
        title: "Success!!!",
        message: id ? "Collection Updated Successfully" : response?.message,
        success: true,
      });
      navigate('/inventory/collections', { state: { ...stateData, tabs: stateData.childTabs } })
    } catch (error) {
      notify({
        title: "Oops!!!",
        message: error?.message || 'Something Went Wrong',
        error: true,
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  }

  console.log('coll : ', collection);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '28px', fontWeight: '700' }}>Create Collection</div>
        <B2BButton
          style={{ color: '#000' }}
          name="Back"
          onClick={handleCancel}
          leftSection={<IconArrowLeft size={15} />}
          color={"rgb(207, 239, 253)"}
        />
      </div>
      <div className="collection-form">
        {collectionFields.map((field) => (
          <div key={field.id} className="collection-form-group">
            <label className='collection-label'>{field.name}</label>
            {field.fieldType === 'textField' && (
              <B2BInput
                value={field.value}
                className='customer-input'
                required
                type={field.type}
                placeholder={field.name}
                onChange={field.onChange}
                disabled={field.disabled}
              />
            )}
            {field.fieldType === 'textArea' && (
              <B2BTextarea
                value={field.value}
                className='customer-input'
                required
                type={field.type}
                placeholder={field.name}
                onChange={field.onChange}
                disabled={field.disabled}
              />
            )}
            {field.fieldType === 'image' && (
              <div style={{ border: '2px solid silver', padding: '10px 50px', display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
                <FileButton ref={fileInputRef} onChange={fileChange} accept="image/png,image/jpeg">
                  {(props) => <Button {...props} bg='gray'>Add image</Button>}
                </FileButton>
                <label style={{ fontSize: '14px', textAlign: 'center' }}>Or drop an image here</label>
                {imageFile && (
                  <div>
                    <img src={id ? `${BASE_URL.replace('/api', '')}${imageFile}` : URL.createObjectURL(imageFile)} alt="Preview" style={{ maxWidth: '100%', height: '10rem', marginTop: '1rem' }} />
                  </div>
                )}
              </div>
            )}
            {field.fieldType === "radioField" && (
              <div className="radio-group">
                {field.options.map((option, idx) => (
                  <div key={idx} className="radio-item" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input
                      type={field.type}
                      value={option.value}
                      name={field.name}
                      onChange={field?.onChange}
                      checked={field?.checked === option?.value}
                    />
                    <label className='radio-label'>{option.label}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <B2BButton className='collectionBtn' onClick={handleSave} name={collection?.id ? 'Update' : 'Save'} color='rgb(26, 160, 70)' />
      </div>
      <div className='collection-product-table'>
        <h3>Select Products</h3>
        <B2BTableGrid
          columns={columns}
          data={sortedProducts}
          isLoading={isLoading}
          isError={isError}
          enableTopToolbar={true}
          enableGlobalFilter={true}
          manualPagination={true}
          pagination={pagination}
          rowCount={rowCount}
          onPaginationChange={setPagination}
          enableFullScreenToggle={true}
        />
      </div>
    </div>
  );
};

export default CollectionCreation;

