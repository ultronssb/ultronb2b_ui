import { Checkbox } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BSelect from '../../../common/B2BSelect';
import ProductGrid from '../../../common/ProductGrid';

const MapChannel = () => {
  const [product, setProduct] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [storeOptions, setStoreOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);
  const [selectedPairs, setSelectedPairs] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [mapStatus, setMapStatus] = useState(false);
  const [areAllSelected, setAreAllSelected] = useState(false);
  const [status] = useState('ACTIVE');

  useEffect(() => {
    fetchAllCompanyLocations();
    fetchAllChannels();
  }, []);

  useEffect(() => {
    if (selectedChannel && selectedStore) {
      fetchAllProducts();
    } else {
      setSelectedPairs([]);
      setAreAllSelected(false);
      setProduct([]);
    }
  }, [pagination, selectedChannel, selectedStore, mapStatus]);

  const fetchAllCompanyLocations = async () => {
    try {
      const response = await B2B_API.get('company-location/get-all').json();
      const data = response.response.map(item => ({
        value: item.companyLocationId,
        label: item.name,
      }));
      setStoreOptions(data);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching company locations:", error);
    }
  };

  const fetchAllChannels = async () => {
    try {
      const response = await B2B_API.get('channel/get-all-channel').json();
      const data = response.response.map(item => ({
        value: item.channelId,
        label: item.name,
      }));
      setChannelOptions(data);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching channels:", error);
    }
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

      if (selectedPairs.length === rowCount && rowCount > 0) {
        setAreAllSelected(true);
      } else {
        setAreAllSelected(false);
      }
    } catch (error) {
      setIsError(true);
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPair = (product) => {
    setAreAllSelected(false);
    if (selectedPairs.includes(product.productId)) {
      setSelectedPairs(prev => prev.filter(pair => pair !== product.productId));
    } else {
      setSelectedPairs(prev => [...prev, product.productId]);
    }
  };

  const onSave = async () => {
    const prod = {
      channelId: selectedChannel,
      locationId: selectedStore,
      productIds: selectedPairs,
    };

    console.log(prod);
    await B2B_API.post('map-channel', { json: prod }).json();
    fetchAllProducts();
  };

  const unMap = async () => {
    const prod = {
      channelId: selectedChannel,
      locationId: selectedStore,
      productIds: selectedPairs,
    };
    await B2B_API.delete('map-channel', { json: prod }).json();
    fetchAllProducts();
  };

  const handleSelectAllPairs = () => {
    if (!areAllSelected) {
      const allProductIds = product.map(item => item.productId);
      console.log(product, "prod inside")


      setSelectedPairs(allProductIds);
      setAreAllSelected(!areAllSelected);
    } else {
      setSelectedPairs([]);
      setAreAllSelected(!areAllSelected);
    }

  };


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
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', marginBottom: '0.5rem' }}>
        <div className='left--section'>
          <div>
            <h2>{!mapStatus ? 'Unmapped Products - ' : 'Mapped Products - '}</h2>
          </div>
          <B2BButton onClick={() => { setMapStatus(!mapStatus); setSelectedPairs([]) }} disabled={!mapStatus} name='UnMapped' />
          <B2BButton onClick={() => { setMapStatus(!mapStatus); setSelectedPairs([]) }} disabled={mapStatus} name='Mapped' />
        </div>
        <div className='right--section'>
          <B2BButton
            style={{ color: selectedPairs.length === 0 ? '#000' : (mapStatus ? '#fff' : '#fff') }}
            name={mapStatus ? "UnMap" : "Map"}
            onClick={mapStatus ? unMap : onSave}
            disabled={selectedPairs.length == 0}
            color={mapStatus ? "rgb(255, 0, 0)" : "rgb(0, 125, 0)"}
          />
        </div>
      </div>
      <ProductGrid
        data={product}
        map={"mapStatus"}
        selectedPairs={selectedPairs}
        areAllSelected={areAllSelected}
        handleSelectAllPairs={handleSelectAllPairs}
        handleSelectPair={handleSelectPair}
        isLoading={isLoading}
        manualPagination={true}
        pagination={pagination}
        rowCount={rowCount}
        onPaginationChange={setPagination}
      />
    </div>
  );
};

export default MapChannel;
