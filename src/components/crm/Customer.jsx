import { Text } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../api/Interceptor';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';
import notify from '../../utils/Notification';

const Customer = () => {
  const { stateData } = useContext(ActiveTabContext);

  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      accessorKey: 'status'
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
    navigate(`/crm/customer/create?id=${customerId}`, { state: { ...stateData, tabs: stateData.childTabs } });
  };

  const handleChange = (e) => {
    navigate('/crm/customer/create', { state: { ...stateData, tabs: stateData.childTabs } });
  }

  return (

    <div>
      <div className='user--container'>
        <Text size='lg'>Customer Details</Text>
        <div className='right--section'>
          <B2BButton
            style={{ color: '#000' }}
            name={"Create Customer"}
            onClick={handleChange}
            leftSection={<IconPlus size={15} />}
            color={"rgb(207, 239, 253)"}
          />
        </div>
      </div>
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
    </div>
  )
}
export default Customer
