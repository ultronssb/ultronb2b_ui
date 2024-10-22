import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import BrandCreation from './BrandCreation';

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState();
  const [brandRowCount, setBrandRowCount] = useState(0);
  const [brandPagination, setBrandPagination] = useState({ pageIndex: 0, pageSize: 5 })
  const [isCreateBrand, setIsCreateBrand] = useState(false);

  useEffect(() => {
    getAllBrand();
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

  const editBrand = (obj) => {
    setBrandId(obj?.brandId);
    setIsCreateBrand(true);
  };

  const handleCreate = () => {
    setIsCreateBrand(true)
  }

  const handleBack = () => {
    setIsCreateBrand(false)
    setBrandId('')
  }

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
          <BrandCreation
            setIsCreateBrand={setIsCreateBrand}
            brandId={brandId}
            setBrandId={setBrandId}
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