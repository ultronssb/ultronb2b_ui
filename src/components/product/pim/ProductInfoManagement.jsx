import { IconPencil } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect'; // Ensure you import B2BSelect
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ActiveTabContext } from '../../../layout/Layout';

const ProductInfoManagement = () => {
  const { stateData } = useContext(ActiveTabContext);
  const [product, setProduct] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [storeOptions, setStoreOption] = useState([]);
  const [channelOptions, setChannelOption] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [status,SetStatus]=useState('ACTIVE')
  const navigate =useNavigate()

  const statusOption = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVE', label: 'INACTIVE' },
  ]
  useEffect(() => {
    if(selectedChannel&&selectedStore){
    fetchAllProducts();
  }else{
    setProduct([])
  }
    fetchAllCompanyLocations();
    fetchAllChannels();
  }, [pagination,selectedChannel,selectedStore,status]);
useEffect(()=>{
  const query_param = new URLSearchParams(location.search);
  const channel=query_param.get('channel')
  const store =query_param.get('store')
  if(channel){
    setSelectedChannel(channel);
    setSelectedStore(store);
  }

},[location.search])
  const fetchAllCompanyLocations = async () => {
    try {
      const response = await B2B_API.get(`company-location/get-all`).json();
      const data = response.response;
      const transformedData = data.map(item => ({
        value: item.companyLocationId,
        label: item.name
      }));
      setStoreOption(transformedData);
    } catch (error) {
      setIsError(true);
      console.log("Error fetching company locations:", error);
    }
  };

  const fetchAllChannels = async () => {
    try {
      const response = await B2B_API.get(`channel/get-all-channel`).json();
      const data = response.response;
      const transformedData = data.map(item => ({
        value: item.channelId,
        label: item.name
      }));
      setChannelOption(transformedData);
    } catch (error) {
      setIsError(true);
      console.log("Error fetching channels:", error);
    }
  };

  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await B2B_API.get(`pim/product?page=${pagination.pageIndex}&size=${pagination.pageSize}&channelId=${selectedChannel}&locationId=${selectedStore}&status=${status}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setProduct(data);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const productColumns = [
    {
      header: 'Product Code',
      accessorKey: 'product.articleCode'
    },
    {
      id: 'ProductName',
      header: 'Product Name',
      accessorKey: 'product.articleName'
    },
    {
      id: 'FabricType',
      header: 'Fabric Type',
      accessorFn: row => row.product.productCategories["Fabric Type"]?.name || '',
    },
    {
      id: 'GSM',
      header: 'GSM',
      accessorFn: row => row.product.productVariants?.flatMap(pv => pv.variants.map(v => v.value)).join(', ') || '',
    },
    {
      id: 'Width',
      header: 'Width',
      accessorKey: 'product.metrics.width'
    },
    {
      id: 'Status',
      header: 'Status',
      accessorKey: 'status'
    },
    {
      header: 'Actions',
      mainTableHeaderCellProps: { align: 'center' },
      mainTableBodyCellProps: { align: 'center' },
      size: 100,
      Cell: ({ row }) => {
        console.log(row)
        const { original } = row;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <IconPencil onClick={() => editVarient(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ];

  const editVarient = (varobj) => {
    navigate(`/product/pim/enrich-product?id=${varobj.pimId}&from=${encodeURIComponent(`${window.location.pathname}?channel=${selectedChannel}&store=${selectedStore}`)}`,{ state: { ...stateData, tabs: stateData.childTabs }});
  };

  return (
    <div>
    <div className='user--container'>
      
      <div className="channel-selection" style={{   display: 'flex',
  flexDirection: 'row',
  alignItems: 'center', 
  gap: '1rem', 
  marginBottom: '1rem'}}>
        <label htmlFor="channel-select" >Select Channel:</label>
        <B2BSelect
          id="channel-select"
          value={selectedChannel}
          onChange={(value) => setSelectedChannel(value)}
          data={channelOptions}
          placeholder="Select a channel"
        />
        <label htmlFor="store-select" >Store:</label>
        <B2BSelect
          id="store-select"
          value={selectedStore}
          onChange={(value) => setSelectedStore(value)}
          data={storeOptions}
          placeholder="Select a store"
        />
        <label htmlFor="channel-select" >Status:</label>
         <B2BSelect
          id="store-select"
          value={status}
          onChange={(value) => SetStatus(value)}
          data={statusOption}
          clearable={false}
        />
      </div>
            </div>
      {isError && <div className="error">Failed to load products. Please try again.</div>}
      <B2BTableGrid
        columns={productColumns}
        data={product}
        isLoading={isLoading}
        manualPagination={true}
        pagination={pagination}
        rowCount={rowCount}
        onPaginationChange={setPagination}
        enableTopToolbar={true}
        enableGlobalFilter={true}
        enableFullScreenToggle={true}
      />
    </div>
  );
};

export default ProductInfoManagement;
