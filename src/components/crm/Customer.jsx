import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../api/Interceptor';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import notify from '../../utils/Notification';
import CustomerCreate from './CustomerCreate';

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateCustomer, setIsCreateCustomer] = useState(false);
  const [customerId, setCustomerId] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, [pagination]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`customer?status=APPROVED&page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
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
    },
    {
      header: 'Location',
      accessorFn: row => row.location?.city || 'N/A',
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
  ], []);

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
          />
      }
    </div>
  )
}
export default Customer
