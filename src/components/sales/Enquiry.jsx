import { Tabs } from '@mantine/core';
import React, { useEffect, useMemo, useState } from 'react';
import B2BTableGrid from '../../common/B2BTableGrid';
import { getpayLoadFromToken } from '../../common/JwtPayload';
import notify from '../../utils/Notification';
import { createB2BAPI } from '../../api/Interceptor';

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const variantOptions = ['Pending', 'Complete', 'Cancel'];
  const [activeTab, setActiveTab] = useState(variantOptions[0]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const B2B_API = createB2BAPI();

  const payload = useMemo(() => getpayLoadFromToken(), []);
  const userRole = payload?.ROLE;

  useEffect(() => {
    fetchEnquiries();
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(() => {
    return [
      { header: 'S.No', accessorFn: (_, index) => index + 1, size: 100, mantineTableHeadCellProps: { align: 'left' } },
      { header: 'Customer Name', accessorKey: 'customer.name' },
      { header: 'Mobile Number', accessorKey: 'customer.mobileNo' },
      { header: 'End Use', accessorKey: 'endUse' },
      { header: 'Fabric Type', accessorKey: 'fabricType' },
      { header: 'Fiber Composition', accessorKey: 'fiberComposition' },
      { header: 'Weight Minimum', accessorKey: 'weightMin' },
      { header: 'Weight Maximum', accessorKey: 'weightMax' },
      { header: 'Target Price Minimum', accessorKey: 'priceMin' },
      { header: 'Target Price Maximum', accessorKey: 'priceMax' },
    ];
  }, []);

  const fetchEnquiries = async () => {
    try {
      setIsLoading(true);
      let res;
      if (userRole === 'SALESMAN') {
        res = await B2B_API.get(`fabricInquiry/get-All?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      } else if (userRole === 'COMPANY_ADMIN') {
        res = await B2B_API.get(`fabricInquiry/all?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      }

      setEnquiries(res?.response?.content || []);
      setRowCount(res?.response?.totalElements || 0);
    } catch (error) {
      notify({ error: true, title: 'Error fetching enquiries' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (option) => {
    setActiveTab(option);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <header>Enquiry Details - {activeTab}</header>
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List>
          {variantOptions.map((item, index) => (
            <Tabs.Tab key={index} value={item} onClick={() => handleTabChange(item)}>
              {item}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        <Tabs.Panel value={activeTab}>
          <B2BTableGrid
            columns={columns}
            data={activeTab === 'Pending' ? enquiries.filter(enquiry => enquiry.isProgress) : activeTab === 'Complete' ? enquiries.filter(enquiry => enquiry.isComplete) : enquiries.filter(enquiry => enquiry.isCancelled)}
            isLoading={isLoading}
            enableTopToolbar={true}
            enableGlobalFilter={true}
            manualPagination={true}
            pagination={pagination}
            rowCount={rowCount}
            onPaginationChange={setPagination}
            enableFullScreenToggle={true}
          />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default Enquiry;

