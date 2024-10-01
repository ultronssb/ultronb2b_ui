import React, { useEffect, useMemo, useState } from 'react';
import { Text } from '@mantine/core';
import { B2B_API } from '../../api/Interceptor';
import B2BButton from '../../common/B2BButton';
import B2BTableGrid from '../../common/B2BTableGrid';
import notify from '../../utils/Notification';
import { getpayLoadFromToken } from '../../common/JwtPayload';

const Enquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [salesmanAssigned, setSalesmanAssigned] = useState(true);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const payload = useMemo(() => getpayLoadFromToken(), []);
  const user = payload?.ROLE;

  useEffect(() => {
    fetchEnquiries();
  }, [pagination.pageIndex, pagination.pageSize, salesmanAssigned]);

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
      const res = await B2B_API.get(`fabricInquiry/get-All?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const filteredEnquiries = res?.response?.content?.filter(enquiry => {
        return salesmanAssigned ? enquiry.isProgress : !enquiry.isProgress;
      });

      setEnquiries(filteredEnquiries || []);
      setRowCount(res?.response?.totalElements || 0);
    } catch (error) {
      notify({ error: true, title: 'Error fetching enquiries' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className='user--container'>
          <Text size='lg' fw={800}>
            Enquiry Details {user !== 'SALESMAN' ? '' : (salesmanAssigned ? '- Enquiry Pending' : '- Enquiry Complete')}
          </Text>
        </div>
        {user === 'SALESMAN' && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem' }}>
            <B2BButton
              onClick={() => { setSalesmanAssigned(true); }} // Show only pending enquiries
              disabled={salesmanAssigned}
              name='Enquiry Pending'
            />
            <B2BButton
              onClick={() => { setSalesmanAssigned(false); }} // Show only completed enquiries
              disabled={!salesmanAssigned}
              name='Enquiry Complete'
            />
          </div>
        )}
      </div>

      <B2BTableGrid
        data={enquiries}
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

export default Enquiry;
