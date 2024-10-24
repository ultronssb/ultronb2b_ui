import React, { useContext, useEffect, useMemo, useState } from 'react';
import { createB2BAPI } from '../../api/Interceptor';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';
import notify from '../../utils/Notification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Text } from '@mantine/core';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

const Salesman = () => {
  const { stateData } = useContext(ActiveTabContext);

  const [salesMans, setSalesMans] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customerCounts, setCustomerCount] = useState({});
  const B2B_API = createB2BAPI();
  const [status, setStatus] = useState('ACTIVE')
  const [openDropDown, setOpenDropDown] = useState(false)

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
      accessorKey: "userName"
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
      id: 'customersCount',
      header: 'Customers',
      accessorFn: (row) => {
        return customerCounts[row?.userId];
      }
    }
  ], [customerCounts,status,openDropDown]);

  const handleStatusChange = (status) => {
    setOpenDropDown(false)
    setStatus(status);
  }
  return (

    <div>
      <div className='user--container'>
        <header>Saleman Details</header>
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