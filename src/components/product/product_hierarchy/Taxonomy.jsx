import { IconPencil } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';

const Taxonomy = () => {
  const initialData = {
    name: "",
    status: "ACTIVE"

  }

  const [taxonomy, setTaxonomy] = useState(initialData);
  const [taxonomys, setTaxonomys] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })

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
  ],[])

  const editTaxonomy = (roleObj) => {
    setTaxonomy((prev => ({ ...prev, ...roleObj })))
  }

  useEffect(() => {
    fetchTaxonomys();
  }, [pagination.pageIndex, pagination.pageSize]);

  const addTaxonomy = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`taxonomy`, { json: taxonomy }).json();
      setTaxonomy(initialData);
      fetchTaxonomys()
      notify({
        message: response.message,
        success: true,
        error: false
      })
    } catch (error) {
      notify({
        message: error.message,
        success: false,
        error: true
      });
    }
  }

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

  const handleChange = (event, key) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setTaxonomy(prev => ({
      ...prev, [key]: key === 'name' ? value.toUpperCase() : value
    }));
  };

  return (
    <>
      <div className='grid-container'>
        <form onSubmit={(event) => addTaxonomy(event)} className='form-container'>
          <div className="form-group">
            <label className='form-label'>Name</label>
            <input
              value={taxonomy.name || ''}
              className='form-input'
              required
              type="text"
              onChange={(event) => handleChange(event, 'name')}
              placeholder="Taxonomy Name"
            />
          </div>

          <div className="form-group status-container">
            <label className='form-label'>Status</label>
            <div className='radio-group'>
              <div className='status-block'>
                <input
                  type="radio"
                  value="ACTIVE"
                  onChange={(event) => handleChange(event, 'status')}
                  checked={taxonomy.status === "ACTIVE"}
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
                  checked={taxonomy.status === "INACTIVE"}
                  name="status"
                  id="status-inactive"
                />
                <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
              </div>
            </div>
          </div>
          <div className='save-button-container'>
            <B2BButton type='button' color={'red'} onClick={() => setTaxonomy(initialData)} name="Cancel" />
            <B2BButton type='submit' name={taxonomy?.id ? 'Update' : "Save"} />
          </div>
        </form>
      </div>
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
    </>
  )
}

export default Taxonomy
