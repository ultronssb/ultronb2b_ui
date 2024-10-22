import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import TaxonomyCreation from './TaxonomyCreation';

const Taxonomy = () => {
  const [taxonomys, setTaxonomys] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isCreateTaxonomy, setIsCreateTaxonomy] = useState(false);
  const [taxonomyId, setTaxonomyId] = useState();

  useEffect(() => {
    fetchTaxonomys();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchTaxonomys = async () => {
    try {
      const response = await B2B_API.get(`taxonomy/get-all-taxonomy?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      setTaxonomys(response?.response?.content);
      setRowCount(response?.response?.totalElements)
    } catch (error) {
      setIsError(true);
      notify({ error: true, success: false, title: error?.message });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(() => [
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
      header: 'Taxonomy Name',
      accessorKey: 'name',
      size: 120
    },

    {
      header: 'Status',
      accessorKey: 'status',
      size: 100,
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
            <IconPencil onClick={() => editTaxonomy(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ], [])

  const editTaxonomy = (obj) => {
    setTaxonomyId(obj?.id);
    setIsCreateTaxonomy(true);
  };

  const handleCreate = () => {
    setIsCreateTaxonomy(true)
  }

  const handleBack = () => {
    setIsCreateTaxonomy(false)
    setTaxonomyId('')
  }

  return (
    <div>
      <div className='user--container'>
        <header>Taxonomy Details</header>
        <div className='right--section'>
          {
            isCreateTaxonomy ?
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
                name={"Create Taxonomy"}
                onClick={handleCreate}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
          }
        </div>
      </div>
      {
        isCreateTaxonomy ?
          <TaxonomyCreation
            setIsCreateTaxonomy={setIsCreateTaxonomy}
            taxonomyId={taxonomyId}
            setTaxonomyId={setTaxonomyId}
          />
          :
          <B2BTableGrid
            columns={columns}
            data={taxonomys}
            isLoading={isLoading}
            isError={isError}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            enableFullScreenToggle={true}
          />
      }
    </div>
  )
}

export default Taxonomy
