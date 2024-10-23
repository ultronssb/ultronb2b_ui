import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API, createB2BAPI } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import TaxonomyCreation from './TaxonomyCreation';
import B2BForm from '../../../common/B2BForm';
import _ from 'lodash';
import notify from '../../../utils/Notification';
import { Text } from '@mantine/core';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Taxonomy = () => {
  const [taxonomys, setTaxonomys] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isCreateTaxonomy, setIsCreateTaxonomy] = useState(false);
  const [taxonomyId, setTaxonomyId] = useState();
  const initialData = {
    name: "",
    description: "",
    status: "ACTIVE",
  }
  const [taxonomy, setTaxonomy] = useState(initialData)
  const B2B_API = createB2BAPI();
  const [status, setStatus] = useState('ACTIVE')
  const [openDropDown, setOpenDropDown] = useState(false);

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
  const json = [
    {
      label: "Taxonomy Name",
      value: taxonomy?.name,
      required: true,
      onChange: (event) => handleChange(event, "name"),
      type: "text",
      placeholder: "Taxonomy Name"
    },
    {
      label: "Status",
      value: taxonomy?.status,
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

  const handleChange = (event, key) => {
    const value = event.target.type === 'radio' ? event.target.value : event.target.value;
    setTaxonomy(prev => ({
      ...prev, [key]: key === 'name' ? _.capitalize(value) : value
    }));
  };

  const addTaxonomy = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post(`taxonomy`, { json: taxonomy }).json();
      setTaxonomy(initialData);
      notify({
        message: response.message,
        success: true,
        error: false
      })
      setIsCreateTaxonomy(false)
      fetchTaxonomys();
    } catch (error) {
      notify({
        message: error.message,
        success: false,
        error: true
      });
    }
  }
  const handleStatusChange = (status) => {
    setOpenDropDown(false)
    setStatus(status)
  }

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
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div onClick={() => setOpenDropDown(!openDropDown)}>Status ({status})</div>
          <FontAwesomeIcon icon={openDropDown ? faFilterCircleXmark : faFilter} />
          {openDropDown && <div className='status-dropdown'>
            <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>ACTIVE</Text>
            </div>
            <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
              <Text size="xs" fw={800}>INACTIVE</Text>
            </div>
          </div>}
        </div>
      ),
      size: 200,
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
            <IconPencil onClick={() => editTaxonomy(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        )
      }
    }
  ], [])

  const editTaxonomy = (obj) => {
    setTaxonomy(obj);
    setIsCreateTaxonomy(true);
  };

  const handleCreate = () => {
    setIsCreateTaxonomy(true)
    setTaxonomy(initialData)
  }

  const handleBack = () => {
    setIsCreateTaxonomy(false)
    setTaxonomy(initialData)
  }

  const handleCancel = () => {
    setIsCreateTaxonomy(false)
    setTaxonomyId('')
  };

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
          <B2BForm
            json={json}
            handleChange={handleChange}
            onSave={addTaxonomy}
            handleCancel={handleCancel}
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
