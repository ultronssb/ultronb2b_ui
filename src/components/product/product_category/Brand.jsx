import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import BrandCreation from './BrandCreation';
import B2BForm from '../../../common/B2BForm';

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

  useEffect(() => {
    getAllBrand();
  }, [brandPagination.pageIndex, brandPagination.pageSize])

  const getAllBrand = async () => {
    try {
      const res = await B2B_API.get(`brand/get-all?page=${brandPagination.pageIndex}&pageSize=${brandPagination.pageSize}`).json();
      setBrands(res?.response?.content);
      setBrandRowCount(res?.response?.totalElements)
    } catch (err) {
      console.error("Failed To Fecth Brand");
    }
  }

  const brandColumns = useMemo(() => [
    {
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
      header: 'Name',
      accessorKey: 'name'
    },
    {
      header: 'Description',
      accessorKey: 'description'
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
  ], [])

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
    setBrandId('')
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