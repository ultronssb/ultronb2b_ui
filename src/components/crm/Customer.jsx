/* eslint-disable react-hooks/exhaustive-deps */
import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import notify from '../../utils/Notification';
import CustomerCreate from './CustomerCreate';
import { createB2BAPI } from '../../api/Interceptor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Text } from '@mantine/core';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalSearch, setGlobalSearch] = useState("")
  const [isCreateCustomer, setIsCreateCustomer] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const B2B_API = createB2BAPI();
  const [status, setStatus] = useState('ACTIVE')
  const [openDropDown, setOpenDropDown] = useState(false)

  useEffect(() => {
    fetchCustomers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize]);


  const onGlobalFilterChange = (value) => {
    setGlobalSearch(value)
  }

  const setCustomerFromResponse = (response) => {
    setRowCount(response?.totalElements || 0);
    setCustomers(response.content);
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(columnFilters, "columnFilters");
    filterCustomers();
  }, [columnFilters, globalSearch,status])

  const filterCustomers = async () => {
    const filter = columnFilters && columnFilters.map(filter => {
      return {
        name: filter.id,
        value: filter.value
      };
    });

    try {
      const response = await B2B_API.post(
        `customer/search?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&search=${globalSearch}&status=APPROVED`,
        { json: filter }
      ).json();

      const data = response?.response?.content || [];
      const customersWithLocation = await Promise.all(data.map(async (customer) => {
        const locationResponse = await B2B_API.get(`locations/customer-location/${customer.customerId}`).json();
        return { ...customer, location: locationResponse?.response || {} };
      }));

      setCustomerFromResponse({ content: customersWithLocation, totalElements: response?.response?.totalElements });

    } catch (error) {
      console.error('Error fetching users:', error);
      setIsError(true);
      notify({
        error: true,
        success: false,
        title: error?.message
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`customer?status=APPROVED&page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&status=${status}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);

      const customersWithLocation = await Promise.all(data.map(async (customer) => {
        const locationResponse = await B2B_API.get(`locations/customer-location/${customer.customerId}`).json();
        return { ...customer, location: locationResponse?.response || {} };
      }));

      setCustomers(customersWithLocation);
    } catch (error) {
      setIsError(true);
      notify({
        error: true,
        success: false,
        title: error?.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const columns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      enableColumnFilter: false,
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
    },
    {
      header: 'Customer Name',
      accessorKey: 'name'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Mobile No.',
      accessorKey: 'mobileNo'
    },
    {
      header: 'Address',
      accessorFn: row => row.location?.address1 + ' ' + row.location?.address2 || 'N/A',
      enableColumnFilter: false,
    },
    {
      header: 'Location',
      accessorFn: row => row.location?.city || 'N/A',
      enableColumnFilter: false,
    },
    {
      header: (
        <div>
          <div onClick={() => setOpenDropDown(!openDropDown)}>Status({status})</div>
          <FontAwesomeIcon icon={openDropDown ? faFilterCircleXmark : faFilter} onClick={() => setOpenDropDown(!openDropDown)} />
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
      mainTableHeaderCellProps: {
        align: 'center'
      },
      mainTableBodyCellProps: {
        align: 'center'
      },
      size: 100,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <IconPencil onClick={() => editCustomer(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], [status, openDropDown]);

  const handleStatusChange = (status) => {
    setOpenDropDown(false)
    setStatus(status)
  }

  const editCustomer = (node) => {
    const customerId = node.customerId;
    setCustomerId(customerId);
    setIsCreateCustomer(true);
  };

  const handleCreate = () => {
    setIsCreateCustomer(true)
  }

  const handleBack = () => {
    setIsCreateCustomer(false)
    setCustomerId('')
  }

  return (
    <div>
      <div className='user--container'>
        <header>Customer Details  {customerId ? <span style={{ fontSize: '15px', marginLeft: '0.5rem' }}>- (Edit)</span> : ''} </header>
        <div className='right--section'>
          {
            isCreateCustomer ?
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
                name={"Create Customer"}
                onClick={handleCreate}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
          }
        </div>
      </div>
      {
        isCreateCustomer ?
          <CustomerCreate
            setIsCreateCustomer={setIsCreateCustomer}
            customerId={customerId}
            setCustomerId={setCustomerId}
          />
          :
          <B2BTableGrid
            columns={columns}
            data={customers}
            isLoading={isLoading}
            isError={isError}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            manualPagination={true}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            enableFullScreenToggle={true}
            manualFiltering={true}
            columnFilters={columnFilters}
            onColumnFiltersChange={setColumnFilters}
            onGlobalFilterChange={onGlobalFilterChange}
          />
      }
    </div>
  )
}
export default Customer
