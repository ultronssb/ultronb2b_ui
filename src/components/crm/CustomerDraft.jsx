import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Button, Modal, Select, Text } from '@mantine/core';
import { IconPencil } from '@tabler/icons-react';
import { json, useNavigate } from 'react-router-dom';
import { B2B_API } from '../../api/Interceptor';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import { ActiveTabContext } from '../../layout/Layout';
import notify from '../../utils/Notification';
import { getpayLoadFromToken } from '../../common/JwtPayload';
import { assign } from 'lodash';

const CustomerDraft = () => {
  const { stateData } = useContext(ActiveTabContext);
  const [customerId, setCustomerId] = useState('');
  const [customers, setCustomers] = useState([]);
  const [salesmanOptions, setSalesmanOptions] = useState([]);
  const [salesmanAssignedCustomer, setSalesmanAssignedCustomer] = useState([]);
  const [salesmanCustomer, setSalesmanCustomer] = useState([]);
  const [salesmanAssigned, setSalesmanAssigned] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const payload = useMemo(() => getpayLoadFromToken(), [])
  const user = payload?.ROLE

  useEffect(() => {
    fetchSalesman();
    fetchCustomers();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchSalesman = async () => {
    try {
      setIsLoading(true);
      const res = await B2B_API.get('user/salesman').json();
      const data = res.response;
      const options = data.map(user => ({ value: user.userId, label: user.username }));
      setSalesmanOptions(options);
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

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`customer?status=DRAFT&page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);

      // When a salesman login, show the list of customers assigned to that salesman within the customer data.
      setSalesmanCustomer(data);

      // Customers without an assigned salesman
      const unassignedCustomers = data.filter(customer => !customer.assignedSalesman);
      setCustomers(unassignedCustomers);

      // Customers with an assigned salesman
      const assignedCustomers = data.filter(customer => customer.assignedSalesman);
      setSalesmanAssignedCustomer(assignedCustomers);
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

  const handleSalesmanChange = (value, customerId) => {
    setCustomers(prevCustomers => prevCustomers.map(customer =>
      customer.customerId === customerId ? { ...customer, assignedSalesman: value } : customer
    ));
    setCustomerId(customerId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleAddSalesman = async () => {
    const updateCustomer = customers.find(cust => cust.customerId === customerId);
    if (!updateCustomer) {
      notify({
        title: 'Error!!',
        message: 'Customer not found',
        error: true,
        success: false
      });
      return;
    }
    try {
      const res = await B2B_API.post('customer/save', {
        body: JSON.stringify(updateCustomer),
        headers: {
          'Content-Type': 'application/json'
        }
      }).json();

      notify({
        title: 'Success!!',
        message: res?.message || 'Customer updated successfully',
        error: false,
        success: true
      });
    } catch (err) {
      notify({
        title: 'Error!!',
        message: err?.message || 'An error occurred',
        error: true,
        success: false
      });
    }
    setIsModalOpen(false);
  };

  const columns = useMemo(() => {
    const baseColumns = [
      { header: 'S.No', accessorFn: (_, index) => index + 1, size: 100, mantineTableHeadCellProps: { align: 'center' }, mantineTableBodyCellProps: { align: 'center' }, },
      { header: 'Customer Name', accessorKey: 'name' },
      { header: 'Email', accessorKey: 'email' },
      { header: 'Company Name', accessorKey: 'companyName' },
      { header: 'Mobile No.', accessorKey: 'mobileNo' },
    ];
    const conditionalColumns = [
      ...(user !== 'SALESMAN' ? [
        salesmanAssigned === false ? {
          header: 'Salesman Assigned',
          accessorKey: 'assignedSalesman',
          Cell: ({ row }) => {
            const { original } = row;
            return (
              <Select
                data={salesmanOptions}
                value={isModalOpen === false ? original.assignedSalesman : ''}
                onChange={(value) => {
                  handleSalesmanChange(value, original.customerId);
                }}
                placeholder="Select Salesman"
              />
            );
          }
        } : {
          header: 'Salesman Assigned',
          accessorKey: 'assignedSalesman',
        }
      ] : []),
      ...(salesmanAssigned === true || user === 'SALESMAN' ? [{
        header: 'Actions',
        mainTableHeaderCellProps: { align: 'center' },
        mainTableBodyCellProps: { align: 'center' },
        size: 100,
        Cell: ({ row }) => {
          const { original } = row;
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <IconPencil
                onClick={() => editCustomer(original)}
                style={{ cursor: 'pointer', color: 'teal' }}
                stroke={2}
              />
            </div>
          );
        }
      }] : []),
    ];
    return [...baseColumns, ...conditionalColumns];
  }, [salesmanOptions, salesmanAssigned, user]);

  const editCustomer = (node) => {
    const customerId = node.customerId;
    navigate(`/crm/customer/create?id=${customerId}`, {
      state: { ...stateData, tabs: stateData.childTabs }
    });
  };

  const handleSalesmanAssigned = () => setSalesmanAssigned(true);
  const handleSalesmanNotAssigned = () => setSalesmanAssigned(false);

  return (
    <div>
      <Modal.Root opened={isModalOpen} onClose={handleModalClose}>
        <Modal.Overlay />
        <Modal.Content>
          <Modal.Header>
            <Modal.Title fw={800}>Add Salesman to Customer</Modal.Title>
            <Modal.CloseButton />
          </Modal.Header>
          <Modal.Body>
            <p style={{ fontSize: '16px', padding: '2rem 0' }}>
              Are you sure you want to add this salesman to the selected customer?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
              <Button onClick={handleModalClose} color='#fa5252'>Cancel</Button>
              <Button onClick={handleAddSalesman} color='#228be6'>Add Salesman</Button>
            </div>
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='user--container'>
          <Text size='lg' fw={800}>Customer Details {user === 'SALESMAN' ? '' : (salesmanAssigned ? '- Salesman Assigned' : '- Salesman Not Assigned')}</Text>
        </div>
        {user !== 'SALESMAN' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
            <B2BButton onClick={handleSalesmanNotAssigned} disabled={!salesmanAssigned ? true : false} name='Salesman Not Assigned' />
            <B2BButton onClick={handleSalesmanAssigned} disabled={salesmanAssigned ? true : false} name='Salesman Assigned' />
          </div>
        )}
      </div>
      <B2BTableGrid
        data={user === 'SALESMAN' ? salesmanCustomer : (!salesmanAssigned ? customers : salesmanAssignedCustomer)}
        columns={columns}
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        setPagination={setPagination}
        rowCount={rowCount}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CustomerDraft;
