import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../common/B2BButton';
import { Text } from '@mantine/core';
import B2BTableGrid from '../../common/B2BTableGrid';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import { ActiveTabContext } from '../../layout/Layout';
import { B2B_API } from '../../api/Interceptor';
import notify from '../../utils/Notification';

const Salesman = () => {
  const { stateData } = useContext(ActiveTabContext);

  const [salesMans, setSalesMans] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerCounts, setCustomerCount] = useState({});
  useEffect(() => {
    fetchSaleMan();
    fetchCustomerCount()
  }, [pagination]);
  const fetchCustomerCount = async () => {
    const response1 = await B2B_API.get(`customer/customerCount`).json();
    const counts = response1?.response || [];
    setCustomerCount(counts);
  }
  const fetchSaleMan = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`user/salesman`).json();
      const data = response?.response || [];
      setRowCount(response?.response?.totalElements || 0);
      setSalesMans(data);
      
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
console.log(salesMans);


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
      header: 'Sales Man Name',
      accessorFn: (row) => row?.firstName + " " + (row?.lastName === null ? '' : row?.lastName),
      accessorKey:"userName"
    },
    {
      header: 'Email',
      accessorKey: 'emailId'
    },
    {
      header: 'Mobile No.',
      accessorKey: 'mobileNumber'
    },
    {
      header: 'Location',
      accessorKey: "assignedLocation",
    },
    {
      header: 'Status',
      accessorKey: 'status'
    },
     { id: 'customersCount',
      header: 'Customers',
      accessorFn: (row) => {
        return  customerCounts[row?.userId] ;
      }
     }
  ], [customerCounts]);
  return (

    <div>
      <div className='user--container'>
        <Text size='lg'>Saleman</Text>
        {/* <div className='right--section'>
          <B2BButton
            style={{ color: '#000' }}
            name={"Create Customer"}
            onClick={handleChange}
            leftSection={<IconPlus size={15} />}
            color={"rgb(207, 239, 253)"}
          />
        </div> */}
      </div>
      <B2BTableGrid
        columns={columns}
        data={salesMans}
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

export default Salesman