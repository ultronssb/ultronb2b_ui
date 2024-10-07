import { IconPencil } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import notify from '../../../utils/Notification';

export const Attribute = () => {
  const initialData = {
    name: "",
    status: "ACTIVE"
  };

  const [attribute, setAttribute] = useState(initialData);
  const [attributes, setAttributes] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      header: 'Attribute Name',
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
            <IconPencil onClick={() => editAttribute(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editAttribute = (roleObj) => {
    setAttribute(prev => ({ ...prev, ...roleObj }));
  };

  useEffect(() => {
    if (pagination.pageIndex >= 0 && pagination.pageSize > 0) {
      fetchAttribute();
    }
  }, [pagination.pageIndex, pagination.pageSize]);

  const addAttribute = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`attribute`, { json: attribute }).json();
      setAttribute(initialData);
      fetchAttribute();
      notify({
        message: response.message,
        success: true,
        error: false
      });
    } catch (error) {
      notify({
        message: error.message,
        success: false,
        error: true
      });
    }
  };

  const fetchAttribute = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`attribute/get-all-attribute?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setAttributes(data);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetchAttribute",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event, key) => {
    const value = event.target.value;
    setAttribute(prev => ({
      ...prev,
      [key]: key === 'name' ? value.toUpperCase() : value
    }));
  };

  return (
    <>
      <div className='grid-container'>
        <form onSubmit={addAttribute} className='form-container'>
          <div className="form-group">
            <label className='form-label'>Name</label>
            <input
              value={attribute.name || ''}
              className='form-input'
              required
              type="text"
              onChange={(event) => handleChange(event, 'name')}
              placeholder="Attribute Name"
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
                  checked={attribute.status === "ACTIVE"}
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
                  checked={attribute.status === "INACTIVE"}
                  name="status"
                  id="status-inactive"
                />
                <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
              </div>
            </div>
          </div>
          <div className='save-button-container'>
            <B2BButton type='button' color={'red'} onClick={() => setAttribute(initialData)} name="Cancel" />
            <B2BButton type='submit' name={attribute?.id ? 'Update' : "Save"} />
          </div>
        </form>
      </div>
      <B2BTableGrid
        columns={columns}
        data={attributes}
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
  );
};
