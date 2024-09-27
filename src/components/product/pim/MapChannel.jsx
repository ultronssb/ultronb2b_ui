import { Checkbox } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BSelect from '../../../common/B2BSelect'; 
import B2BTableGrid from '../../../common/B2BTableGrid';

const MapChannel = () => {
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
  const [mapStatus, setMapStatus] = useState(false);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [status]=useState('ACTIVE')

  useEffect(() => {
    if (selectedChannel && selectedStore) {
      fetchAllProducts();
      console.log(selectedPairs.length,'leng')
      if (selectedPairs.length === rowCount && rowCount > 0) {
        setAreAllSelected(true);
      } else {
        setAreAllSelected(false);
      }
    } else {
      setSelectedPairs([]);
      setAreAllSelected(false);
      setProduct([]);
    }
    fetchAllCompanyLocations();
    fetchAllChannels();
  }, [pagination, selectedChannel, selectedStore, mapStatus]);



  const fetchAllCompanyLocations = async () => {
    try {
      const response = await B2B_API.get(`company-location/get-all`).json();
      const data = response.response;
      const transformedData = data.map(item => ({
        value: item.companyLocationId,
        label: item.name,
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
        label: item.name,
      }));
      setChannelOption(transformedData);
    } catch (error) {
      setIsError(true);
      console.log("Error fetching channels:", error);
    }
  };

  const onSave = async () => {
    const prod = { 
      channelId: selectedChannel,
      locationId: selectedStore,
      productIds: selectedPairs,
    };
 
    console.log(prod);
    const response = await B2B_API.post(`map-channel`, { json: prod }).json();
    fetchAllProducts();
  };
  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const endpoint = mapStatus
        ? `pim/product?page=${pagination.pageIndex}&size=${pagination.pageSize}&channelId=${selectedChannel}&locationId=${selectedStore}&status=${status}`
        : `map-channel/product?page=${pagination.pageIndex}&size=${pagination.pageSize}&channelId=${selectedChannel}&locationId=${selectedStore}&status=${status}`;

      const response = await B2B_API.get(endpoint).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setProduct(data.map(item => mapStatus ? item.product : item));
    } catch (error) {
      setIsError(true);
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAllPairs = () => {

      const allProductIds = product.map(item => item.productId);
      const updateProductsIds = selectedPairs.concat(allProductIds)
      setSelectedPairs(updateProductsIds);
    
    setAreAllSelected(!areAllSelected);
  };

  const handleSelectPair = (product) => {
    const isAlreadySelected = selectedPairs.includes(product.productId);
    setAreAllSelected(false)
    if (!isAlreadySelected) {
      setSelectedPairs(prev => [...prev, product.productId]);
    } else {
      setSelectedPairs(prev => prev.filter(pair => pair !== product.productId));
    }
  };

  const productColumns = [
    {
      header: (
        <Checkbox 
          checked={areAllSelected}
          onChange={handleSelectAllPairs} 
        />
      ),
      mainTableHeaderCellProps: { align: 'center' },
      mainTableBodyCellProps: { align: 'center' },
      size: 100,
      Cell: ({ row }) => (
        <Checkbox
          checked={selectedPairs.includes(row.original.productId)}
          onChange={() => handleSelectPair(row.original)}
        />
      ),
    },
    {
      header: 'Product Code',
      accessorKey: 'articleCode',
    },
    {
      id: 'ProductName',
      header: 'Product Name',
      accessorKey: 'articleName',
    },
    {
      id: 'FabricType',
      header: 'Fabric Type',
      accessorFn: row => row.productCategories["Fabric Type"]?.name || '',
    },
    {
      id: 'Variants',
      header: 'Variants',
      accessorFn: row => row.productVariants?.flatMap(pv => pv.variants.map(v => v.value)).join(', ') || '',
    },
    {
      id: 'Width',
      header: 'Width',
      accessorKey: 'metrics.width',
    },
  ];
 const unMap =async ()=>{
  const prod = { 
    channelId: selectedChannel,
    locationId: selectedStore,
    productIds: selectedPairs,
  };
  const response = await B2B_API.delete(`map-channel`, { json: prod }).json();
  fetchAllProducts();
 }
  return (
    <div>
      <div className='user--container'>
        <div className="channel-selection">
          <label htmlFor="channel-select">Select Channel:</label>
          <B2BSelect
            id="channel-select"
            value={selectedChannel}
            onChange={setSelectedChannel}
            data={channelOptions}
            placeholder="Select a channel"
          />
          <label htmlFor="store-select">Store:</label>
          <B2BSelect
            id="store-select"
            value={selectedStore}
            onChange={setSelectedStore}
            data={storeOptions}
            placeholder="Select a store"
          />
        </div>
        <div className='right--section'>
          <B2BButton
            style={{ color: '#000' }}
            name={mapStatus?"UnMap" : "Map"}
            onClick={mapStatus? unMap : onSave}
            disabled={selectedPairs.length==0}
            color={"rgb(207, 239, 253)"}
          />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '2rem', marginBottom:'0.5rem'}}>
        <B2BButton onClick={() => {setMapStatus(!mapStatus); setSelectedPairs([])}} disabled={!mapStatus} name='UnMapped' />
        <B2BButton onClick={() => {setMapStatus(!mapStatus);setSelectedPairs([])}} disabled={mapStatus} name='Mapped' />
      </div>
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

export default MapChannel;
