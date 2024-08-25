import React, { useEffect, useMemo, useRef, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { IconPencil } from '@tabler/icons-react';
import B2BInput from '../../../common/B2BInput';

const Brand = () => {

  const initialData = {

    brandId: "",
    name: "",
    description: "",
    status: "ACTIVE",
  }

  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState(initialData);
  const [brandRowCount, setBrandRowCount] = useState(0);
  const [brandPagination, setBrandPagination] = useState({ pageIndex: 0, pageSize: 5 })

  const formRef = useRef(null)

  useEffect(() => {
    getAllBrand();
    if (location?.state?.brand) {
      const { brand } = location.state;
      setBrand((prev) => ({ ...prev, ...brand, brandId: brand?.brandId }))
    }
  }, [brandPagination.pageIndex, brandPagination.pageSize])

  const getAllBrand = async () => {
    try {
      const res = await B2B_API.get(`brand`).json();
      setBrands(res?.response);
      setBrandRowCount(res?.response?.totalElement)
    } catch (err) {
      console.error("Failed To Fecth Brand");
    }
  }


  const addBrand = async (event) => {
    event.preventDefault();
    try {
      const res = await B2B_API.post(`brand`, { json: brand }).json();
      getAllBrand();
      setBrand(initialData);
    } catch (err) {
      console.error("Failed to Add Brand", err);
    }
  }

  const handleChange = (event, key) => {
    setBrand((prev) => (
      { ...prev, [key]: event.target.value }
    ))
  }

  const json = [
    {
      label: "Brand Id",
      value: brand.brandId,
      onChange: (event) => handleChange(event, "brandId"),
      style: { cursor: 'not-allowed' },
      disabled: true,
      type: "text",
      placeholder: "BrandID"
    },
    {
      label: "Brand Name",
      value: brand.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Brand Name"
    },
    {
      label: "Description",
      value: brand.description,
      onChange: (event) => handleChange(event, "description"),
      type: "text",
      placeholder: "Description"
    },
    {
      label: "Status",
      value: brand.status,
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
    }, {
      header: 'ID',
      accessorKey: 'brandId',
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
      accessorKey: 'status'
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

  const editBrand = (obj) => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'auto' });
    }
    setBrand((prev) => ({ ...prev, ...obj }));
  };

  return (
    <div className='grid-container'>
      <form onSubmit={(event) => addBrand(event)} className='form-container'>
        {json.map((e, index) => (
          <div key={index} className={e.className ? e.className : "form-group"}>
            <label className='form-label'>{e.label}</label>
            {e.type == "radio" ? (
              <div className='radio-label-block'>
                {e.options.map((option, idx) => (
                  <div className='radio-group' key={idx}>
                    <div className='status-block'>
                      <input
                        id={`${e.name}-${option.value.toLowerCase()}`}
                        value={option.value}
                        style={e.style && e.style}
                        onChange={(event) => e.onChange(event, e.name)}
                        checked={e.value === option.value}
                        type={e.type}
                        placeholder={e.placeholder}
                      />
                      <label className='form-span radio' htmlFor={`${e.name}-${option.value.toLowerCase()}`}>{option.label}</label>
                    </div>
                  </div>
                ))}
              </div>
            )
              : <B2BInput
                value={e.value}
                className='form-input'
                style={e.style}
                disabled={e.disabled}
                onChange={e.onChange}
                type={e.type}
                required={e.required}
                placeholder={e.placeholder}
              />
            }

          </div>
        ))}
        <div className='save-button-container'>
          <B2BButton type='submit' name="Sumbit" />
          <B2BButton type='submit' name="Save" />
        </div>
      </form>

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
    </div>
  )
}

export default Brand