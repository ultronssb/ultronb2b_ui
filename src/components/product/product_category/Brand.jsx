import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import B2BButton from '../../../common/B2BButton';
import B2BForm from '../../../common/B2BForm';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { createB2BAPI } from '../../../api/Interceptor';
import { Text } from '@mantine/core';
import notify from '../../../utils/Notification';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState();
  const [brandRowCount, setBrandRowCount] = useState(0);
  const [brandPagination, setBrandPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [isCreateBrand, setIsCreateBrand] = useState(false);
  const initialData = {
    name: "",
    description: "",
    status: "ACTIVE",
  }
  const [brand, setBrand] = useState(initialData);
  const [status, setStatus] = useState('ACTIVE')
  const [openDropDown, setOpenDropDown] = useState(false);
  const B2B_API = createB2BAPI();

  useEffect(() => {
    getAllBrand();
  }, [brandPagination.pageIndex, brandPagination.pageSize,status])

  const getAllBrand = async () => {
    try {
      const res = await B2B_API.get(`brand/get-all?page=${brandPagination.pageIndex}&pageSize=${brandPagination.pageSize}&status=${status}`).json();
      setBrands(res?.response?.content);
      setBrandRowCount(res?.response?.totalElements)
    } catch (err) {
      console.error("Failed To Fecth Brand");
    }
  }

  const handleStatusChange = (status) => {
    setStatus(status);
    setOpenDropDown(false)
  }

  const brandColumns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 50,
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
    },
    {
      header: 'Name',
      accessorKey: 'name',
      size: 100
    },
    {
      header: 'Description',
      accessorKey: 'description',
      size: 180
    },
    {
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div onClick={() => setOpenDropDown(prev => !prev)}>Status ({status})</div>
          <FontAwesomeIcon onClick={() => setOpenDropDown(prev => !prev)} icon={openDropDown ? faFilterCircleXmark : faFilter} />
          {openDropDown && <div className='status-dropdown'>
            <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>ACTIVE</Text>
            </div>
            <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>INACTIVE</Text>
            </div>
          </div>
          }
        </div>
      ),
      accessorKey: 'status',
      size:100,
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
            <IconPencil onClick={() => editBrand(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ], [openDropDown, status])

  const json = [
    // {
    //   label: "Brand Id",
    //   value: brand?.brandId,
    //   onChange: (event) => handleChange(event, "brandId"),
    //   style: { cursor: 'not-allowed', backgroundColor: '#e2e2e2' },
    //   disabled: true,
    //   type: "text",
    //   placeholder: "BrandID"
    // },
    {
      label: "Brand Name",
      value: brand?.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Brand Name"
    },
    {
      label: "Description",
      value: brand?.description,
      onChange: (event) => handleChange(event, "description"),
      type: "textArea",
      placeholder: "Description"
    },
    {
      label: "Status",
      value: brand?.status,
      onChange: (event) => handleChange(event, "status"),
      type: "radio",
      className: "form-group status-container",
      placeholder: "Status",
      options: [
        { value: "ACTIVE", label: "ACTIVE" },
        { value: "INACTIVE", label: "INACTIVE" }
      ]
    }
  ]

  const editBrand = (obj) => {
    setBrand(obj)
    setIsCreateBrand(true);
  };

  const handleCreate = () => {
    setIsCreateBrand(true)
  }

  const handleBack = () => {
    setIsCreateBrand(false)
    setBrand(initialData)
  }

  const handleChange = (event, key) => {
    setBrand((prev) => (
      { ...prev, [key]: event.target.value }
    ))
  }

  const addBrand = async (event) => {
    event.preventDefault();
    try {
      const res = await B2B_API.post(`brand`, { json: brand }).json();
      setBrand(initialData);
      getAllBrand();
      notify({
        message: res.message,
        success: true,
        error: false
      })
      setIsCreateBrand(false)
    } catch (error) {
      notify({
        message: error.message,
        success: false,
        error: true
      });
    }
  }

  const handleCancel = () => {
    setIsCreateBrand(false);
    setBrandId('');
  };

  return (
    <div className='grid-container'>
      <div className='user--container'>
        <header>Brand Details</header>
        <div className='right--section'>
          {
            isCreateBrand ?
              <B2BButton
                style={{ color: '#000' }}
                name={"Back"}
                onClick={handleBack}
                leftSection={<IconArrowLeft size={15} />}
                color={"rgb(207, 239, 253)"}
              />
              :
              <B2BButton
                style={{ color: '#000' }}
                name={"Create Brand"}
                onClick={handleCreate}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
          }
        </div>
      </div>
      {
        isCreateBrand ?
          <B2BForm
            json={json}
            handleChange={handleChange}
            onSave={addBrand}
            handleCancel={handleCancel}
          />
          :
          <B2BTableGrid
            columns={brandColumns}
            data={brands}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            pagination={brandPagination}
            rowCount={brandRowCount}
            onPaginationChange={setBrandPagination}
            enableFullScreenToggle={true}
          />
      }
    </div>
  )
}

export default Brand