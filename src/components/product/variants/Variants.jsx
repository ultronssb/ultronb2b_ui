import { Button, ColorInput, ColorSwatch, FileButton, Group, Tabs, Text } from '@mantine/core';
import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { BASE_URL } from '../../../api/EndPoints';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BSelect from '../../../common/B2BSelect';
import B2BSelectable from '../../../common/B2BSelectable';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import './Variant.css';

const Variants = () => {
  const initialState = {
    variantId: '',
    name: '',
    value: '',
    hexaColorCode: '',
    image: '',
    type: '',
    status: 'ACTIVE',
  };

  const [isCreateVariant, setIsCreateVariant] = useState(false);
  const [variant, setVariant] = useState(initialState);
  const [variantList, setVariantList] = useState([]);
  const [currentVariantType, setCurrentVariantType] = useState('');
  const [variantTypes, setVariantTypes] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const variantOptions = ['Colour', 'Solid', 'More Variants'];
  const [activeTab, setActiveTab] = useState(variantOptions[0]);

  const [otherVariantTypes, setOtherVariantTypes] = useState([]);
  const [selectedOtherVariant, setSelectedOtherVariant] = useState('');


  useEffect(() => {
    fetchAllVariants();
  }, [pagination.pageIndex, pagination.pageSize, activeTab]);

  useEffect(() => {
    fetchAllVarientType();
  }, [])

  useEffect(() => {
    if (_.size(variantTypes) > 0) {
      setSelectedOtherVariant(variantTypes[0])
    }
  }, [variantTypes])

  const fetchAllVariants = async () => {
    const type = activeTab === 'More Variants' ? 'Others' : activeTab;
    try {
      setIsLoading(true);
      const res = await B2B_API.get(`variant/get-All?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&type=${type}`).json();
      const data = res?.response?.content || [];
      setRowCount(res?.response?.totalElements || 0);
      setVariantList(data);
      const uniqueNames = [...new Set(data.map(item => item.name))];
      setOtherVariantTypes(uniqueNames)
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_varients",
        error: true,
        success: false,
        title: error?.message || 'Error fetching variants',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllVarientType = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`variantType`).json();
      const data = response?.response || [];
      console.log(data);
      const filteredData = data.filter(item => !['Colour', 'Solid'].includes(item));

      setVariantTypes(filteredData);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_varients",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };


  const initializeImage = async (imagePath) => {
    try {
      const imageFile = await fetchImageAsBlob(imagePath);
      setImageFile(imageFile);
    } catch (error) {
      console.error("Failed to fetch and set image file:", error);
    }
  };

  const fetchImageAsBlob = async (imagePath) => {
    const response = await fetch(`${BASE_URL.replace('/api', '')}${imagePath}`);
    const contentType = response.headers.get('Content-Type');

    if (!contentType?.startsWith('image/')) {
      throw new Error(`Expected an image, but received: ${contentType}`);
    }

    const blob = await response.blob();
    return new File([blob], 'image.jpeg', { type: blob.type });
  };

  const handleSelect = (value) => {
    setCurrentVariantType(value || '');
    if (value !== 'Solid') {
      setImageFile(null)
    }
    setVariant(prev => ({
      ...prev,
      name: value === 'More Variants' ? '' : value,
      type: value === 'More Variants' ? 'Others' : value,
    }));
  };

  const handleChange = (event, key) => {
    const { value, checked, type } = event.target;
    console.log(type);

    setVariant(prev => ({
      ...prev,
      [key]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleVariant = (event, key) => {
    setVariant(prev => ({ ...prev, [key]: key === "name" ? event : event?.target?.value }));
  };

  const handleColorChange = (color) => {
    setVariant(prev => ({ ...prev, hexaColorCode: color }));
  };

  const renderInput = (label, key, type = 'text', required = true) => (
    <div className="variant-group">
      <label className='variant-label'>{label}</label>
      <B2BInput
        value={variant[key]}
        styles={{ input: { fontSize: '14px' } }}
        placeholder={label}
        onChange={(event) => handleChange(event, key)}
        type={type}
        required={required}
      />
    </div>
  );

  const handleSelectOtherVariants = (newValue) => {
    setSelectedOtherVariant(newValue);
  };


  const columns = {
    "Colour": [
      {
        header: 'S.No',
        accessorFn: (_, index) => index + 1,
        size: 100,
        mantineTableHeadCellProps: { align: 'center' },
        mantineTableBodyCellProps: { align: 'center' },
      },
      {
        header: 'Colour',
        accessorKey: 'value',
      },
      {
        header: 'Hexa Color Code', accessorKey: 'hexaColorCode', Cell: ({ row }) => {
          const { original } = row;
          return original.hexaColorCode ? (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <ColorSwatch size={20} color={original.hexaColorCode} />
              <span>{original.hexaColorCode.toUpperCase()}</span>
            </div>
          ) : (
            "-"
          );
        }
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
      {
        header: 'Actions', mainTableHeaderCellProps: { align: 'center' }, mainTableBodyCellProps: { align: 'center' }, size: 100, Cell: ({ row }) => {
          const { original } = row;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <IconPencil onClick={() => editVariant(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
            </div>
          );
        },
        accessorKey: "action",
      },
    ],

    "Solid": [
      {
        header: 'S.No',
        accessorFn: (_, index) => index + 1,
        size: 100,
        mantineTableHeadCellProps: { align: 'center' },
        mantineTableBodyCellProps: { align: 'center' }
      },
      {
        header: 'Solid / Pattern',
        accessorKey: 'value'
      },
      {
        header: 'Solid Pattern',
        accessorKey: 'solid/pattern',
        Cell: ({ row }) => {
          const { original } = row;
          return original.image ? <img src={`${BASE_URL.replace('/api', '')}${original.image}`} alt='solid' style={{ width: '75px', height: '50px' }} /> : "-";
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
      {
        header: 'Actions',
        mainTableHeaderCellProps: { align: 'center' },
        mainTableBodyCellProps: { align: 'center' },
        size: 100, Cell: ({ row }) => {
          const { original } = row;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <IconPencil onClick={() => editVariant(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
            </div>
          );
        },
      },
    ],
    "More Variants": [
      {
        header: 'S.No',
        accessorFn: (_, index) => index + 1,
        size: 100,
        mantineTableHeadCellProps: { align: 'center' },
        mantineTableBodyCellProps: { align: 'center' },
      },
      {
        header: (
          <B2BSelect
            style={{ width: '200px !important', border: 'none' }}
            value={selectedOtherVariant}
            data={otherVariantTypes}
            onChange={handleSelectOtherVariants}
            clearable
          />
        ),
        accessorKey: 'value',
        Cell: ({ row }) => {
          const { original } = row;
          if (original.name === selectedOtherVariant) {
            return <span>{original.value}</span>;
          }
          return null;
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
      {
        header: 'Actions',
        mainTableHeaderCellProps: { align: 'center' },
        mainTableBodyCellProps: { align: 'center' },
        size: 100,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <IconPencil onClick={() => editVariant(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
            </div>
          );
        },
        accessorKey: "actions"
      },
    ]
  }



  const handleTabChange = (option) => {
    setActiveTab(option);
  };


  const editVariant = (varobj) => {
    setIsCreateVariant(true);
    const type = varobj.type === 'Others' ? 'More Variants' : varobj.type;
    setCurrentVariantType(type);
    setVariant(prev => ({ ...prev, ...varobj }));
    initializeImage(varobj.image);
  };

  const submitVariant = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("variant", new Blob([JSON.stringify(variant)], { type: 'application/json' }));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setIsLoading(true);
      const response = await B2B_API.post('variant', { body: formData }).json();
      setIsCreateVariant(false);
      setVariant(initialState);
      setCurrentVariantType('');
      setImageFile(null)
      notify({
        id: variant.variantId ? 'update_variant_success' : 'create_variant_success',
        title: "Success!!!",
        message: variant.variantId ? "Updated Successfully" : response?.message,
        success: true,
      });
    } catch (error) {
      notify({
        id: variant.variantId ? 'update_variant_error' : 'create_variant_error',
        title: "Oops!!!",
        message: error?.message || 'Something Went Wrong',
        error: true,
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsCreateVariant(false);
    setVariant(initialState);
    setCurrentVariantType('');
    setImageFile(null);
  };

  const clearFile = () => {
    setVariant(prevVariant => ({
      ...prevVariant,
      image: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
    setImageFile(null);
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
        setVariant(prevVariant => ({
          ...prevVariant,
          image: '',
        }));
      } else {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setVariant(prevVariant => ({
            ...prevVariant,
            image: reader.result,
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImageFile(null);
      setVariant(prevVariant => ({
        ...prevVariant,
        image: '',
      }));
    }
  };

  const filteredVariants = variantList.filter(variant => variant.name === selectedOtherVariant);
  console.log('filter : ', filteredVariants);



  return (
    <div>
      {!isCreateVariant && (
        <>
          <div className='user--container'>
            <Text size='lg'>Variant Details</Text>
            <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"Create Variants"}
                onClick={() => setIsCreateVariant(true)}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          <div>
            <Tabs value={activeTab} onTabChange={setActiveTab}>
              <Tabs.List>
                {variantOptions.map((item, index) => (
                  <Tabs.Tab key={index} value={item} onClick={() => handleTabChange(item)}>
                    {item}
                  </Tabs.Tab>
                ))}
              </Tabs.List>
              <Tabs.Panel value={activeTab}>
                <B2BTableGrid
                  columns={columns[activeTab]}
                  data={activeTab === 'More Variants' ? filteredVariants : variantList}
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
              </Tabs.Panel>
            </Tabs>
          </div>

        </>
      )}
      {isCreateVariant && (
        <div className='container'>
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <B2BButton
              style={{ color: '#000' }}
              name="Back"
              onClick={handleCancel}
              leftSection={<IconArrowLeft size={15} />}
              color={"rgb(207, 239, 253)"}
            />
          </div>
          <div className='variant-container'>
            <h1 style={{ width: '250px' }}>{variant.variantId ? 'Update Variant' : 'New Variant'}</h1>
            <div className='variant-group'>
              <label className='variant-label'>Select Variant Type</label>
              <B2BSelect
                value={currentVariantType}
                data={variantOptions}
                onChange={handleSelect}
                clearable
              />
            </div>
            {currentVariantType === 'Colour' && (
              <>
                {renderInput('Value', 'value')}
                <div className="variant-group">
                  <label className='variant-label'>Hexa Color Code</label>
                  <ColorInput
                    size="md"
                    value={variant.hexaColorCode}
                    placeholder="color"
                    onChange={handleColorChange}
                    style={{ width: '250px' }}
                  />
                </div>
              </>
            )}
            {currentVariantType === 'Solid' && (
              <>
                {renderInput('Value', 'value')}
                <div className="variant-group">
                  <label className='variant-label'>Solid Image</label>
                  <Group w={250}>
                    <FileButton ref={fileInputRef} onChange={fileChange} accept="image/png,image/jpeg">
                      {(props) => <Button {...props}>{variant.variantId ? "Update Image " : "Add Image"}</Button>}
                    </FileButton>
                    <Button disabled={!imageFile} color="red" onClick={clearFile} w={100}>Reset</Button>
                  </Group>
                  {imageFile && (
                    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                      <img
                        src={URL.createObjectURL(imageFile)}
                        alt="Uploaded"
                        style={{ maxWidth: '150px', maxHeight: '150px', border: '1px solid #ccc', padding: '5px' }}
                      />
                    </div>
                  )}
                </div>
              </>
            )}
            {currentVariantType === 'More Variants' && (
              <>
                <div className="variant-group">
                  <label className='variant-label'>New Variant</label>
                  <B2BSelectable
                    data={variantTypes}
                    value={variant.name || ""}
                    setData={setVariantTypes}
                    setValue={(event) => handleVariant(event, 'name')}

                  />
                </div>
                {renderInput('Value', 'value')}
              </>
            )}
            <div className="variant-group">
              <label className='variant-label'>Status</label>
              <div className='variant-radio-group'>
                {['ACTIVE', 'INACTIVE'].map(status => (
                  <div className='variant-status-block' key={status}>
                    <input
                      type="radio"
                      value={status}
                      onChange={(event) => handleChange(event, 'status')}
                      checked={variant.status === status}
                      name="status"
                      id={`status-${status.toLowerCase()}`}
                    />
                    <label className='form-span radio' htmlFor={`status-${status.toLowerCase()}`}>{status}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className='variant-btns'>
              <B2BButton type='button' onClick={handleCancel} color='red' name="Cancel" />
              <B2BButton type='button' onClick={submitVariant} name={variant.variantId ? "Update" : "Save"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Variants;