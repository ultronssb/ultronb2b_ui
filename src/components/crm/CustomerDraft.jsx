import { Text } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../api/Interceptor';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../common/CommonResponse';
import notify from '../../utils/Notification';
import { ActiveTabContext } from '../../layout/Layout';
import { useNavigate } from 'react-router-dom';


const CustomerDraft = () => {

  const { stateData } = useContext(ActiveTabContext);
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
  }, [pagination.pageIndex, pagination.pageSize]);


  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`customer?status=DRAFT&page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setCustomers(data);
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
      header: 'Customer Name',
      accessorKey: 'name'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Company Name',
      accessorKey: 'companyName'
    },
    {
      header: 'Mobile No.',
      accessorKey: 'mobileNo'
    },
    {
      header: 'Salesman Assigned',
      accessorKey: 'salesmanId'
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
            <IconPencil onClick={() => editVarient(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editVarient = (node) => {
    const customerId = node.customerId;
    navigate(`/crm/customer/create?id=${customerId}`, { state: { ...stateData, tabs: stateData.childTabs } });
  };


  return (
    <div>
      <div className='user--container'>
        <Text size='lg'>Customer Details</Text>
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

export default CustomerDraft