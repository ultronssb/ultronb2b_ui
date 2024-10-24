import { IconPencil } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BTableGrid from '../../common/B2BTableGrid';
import moment from 'moment';
import B2BToolTip from '../../common/B2BToolTip';
import B2BPopOver from '../../common/B2BPopOver';
import { useDisclosure } from '@mantine/hooks';
import { Button } from '@mantine/core';
import { Table } from '@mantine/core';
import _ from 'lodash';
import { ActiveTabContext } from '../../layout/Layout';
import { createB2BAPI } from '../../api/Interceptor';

const OrderOpen = () => {

  const { stateData } = useContext(ActiveTabContext);
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [opened, { close, open }] = useDisclosure(false);
  const B2B_API = createB2BAPI();

  const navigate = useNavigate();


  useEffect(() => {
    fetchOrders();
  }, [pagination.pageIndex, pagination.pageSize])

  const fetchOrders = async () => {
    const response = await B2B_API.get(`order/orders?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
    const data = response.response.content;
    setRowCount(response.response.totalElements)
    setOrders(data)
  }

  const renderChildren = (items) => {

    const tableContent = items.items && items.items.map((item, index) => [
      index + 1,
      item?.orderNo,
      item?.productVariant?.name || "Item Name Not Available",
      (item.totalAmount / item?.qty) || 0,
      item?.qty
    ])
    const tableData = {
      caption: _.size(items.items) > 0 ? 'Stock Order' : "No Items Found",
      head: ['S.No', 'Item ID', 'Item Name', 'Price', 'Qty'],
      body: tableContent,
    };

    return <Table data={tableData} />;
  };

  const renderTarget = () => {
    return (
      <Button variant="light">
        View
      </Button>
    );
  };

  const editOrder = (orderItem) => {
    const { orderedStatus, orderNo } = orderItem;
    // DELIVERED, ORDERED, ABANDONED, CANCELLED, RETURNED, OPEN
    switch (orderedStatus) {
      case "OPEN":
        navigate(`/sales/sales-order/${orderNo}`, { state: { ...stateData, tabs: stateData.childTabs } })
        break;
      case "DELIVERED":
        navigate("/sales/packing")
        break;
      case "ORDERED":
        navigate("/sales/invoice")
    }
  }

  const columns = useMemo(() => [
    {
      header: 'S.No',
      accessorFn: (_, index) => index + 1,
      size: 100,
      mantineTableHeadCellProps: { align: 'center' },
      mantineTableBodyCellProps: { align: 'center' },
    },
    {
      header: 'Order #',
      accessorKey: 'orderNo',
      size: 100,
    },
    {
      header: 'Order Date',
      accessorFn: (row) => moment(row.createdDate).format('L'),
      size: 100,
      accessorKey: 'orderDate'
    },
    {
      header: 'Customer',
      accessorFn: (row) => row?.customer?.name,
      size: 100,
      accessorKey: 'customer',
    },
    {
      header: 'Total Amount',
      accessorKey: 'grossTotal',
      size: 150,
    },
    // {
    //   header: 'Delivery Type',
    //   accessorKey: 'deliveryType'
    // },
    {
      header: 'Bill Location',
      accessorFn: (row) => row.billLocation.nickName,
      accessorKey: 'billLocation',
      size: 150,
      Cell: ({ row }) => {
        const { nickName } = row.original.billLocation;
        return (<B2BToolTip label={nickName} value={nickName} />)
      },
    },
    {
      header: 'Ship Location',
      accessorFn: (row) => row.shipLocation.nickName,
      accessorKey: 'shipLocation',
      size: 150,
    },
    {
      header: 'Payment Mode',
      size: 150,
      accessorKey: 'paymentMode'
    },
    {
      header: 'Order Status',
      accessorKey: 'orderedStatus',
      size: 120,
    },
    // {
    //   header: 'Salesman',
    //   accessorKey: 'salesman'
    // },
    {
      header: "Order Source",
      size: 120,
      accessorFn: () => {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        return isMobile ? 'Mobile' : 'Website';
      }
    },
    {
      header: 'Items',
      size: 100,
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
      Cell: ({ row }) => {
        return (
          <B2BPopOver
            target={renderTarget()}
            children={renderChildren(row.original)}
          />
        )
      }
    },
    {
      header: 'Payment Status',
      size: 150,
      accessorKey: 'paymentStatus'
    },
    {
      header: 'Status',
      accessorKey: 'status',
      size: 100,
      Cell: ({ row }) => {
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
            <IconPencil onClick={() => editOrder(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], [stateData]);


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <header>Open Order</header>
      </div>
      <B2BTableGrid
        columns={columns}
        data={orders}
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

export default OrderOpen