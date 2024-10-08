import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BSelect from '../../../common/B2BSelect'; // Ensure you import B2BSelect
import ProductGrid from '../../../common/ProductGrid';
import { ActiveTabContext } from '../../../layout/Layout';
import _ from 'lodash';

const ProductInfoManagement = () => {
  const { stateData } = useContext(ActiveTabContext);
  const [product, setProduct] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [storeOptions, setStoreOption] = useState([]);
  const [channelOptions, setChannelOption] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedStore, setSelectedStore] = useState('');
  const [status, SetStatus] = useState('ACTIVE')
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate()

  const statusOption = [
    { value: 'ACTIVE', label: 'ACTIVE' },
    { value: 'INACTIVE', label: 'INACTIVE' },
  ]
  useEffect(() => {
    if (selectedChannel && selectedStore) {
      fetchAllProducts();
    } else {
      setProduct([])
    }

  }, [pagination, selectedChannel, selectedStore, status, searchTerm]);

  useEffect(() => {
    const query_param = new URLSearchParams(location.search);
    const channel = query_param.get('channel')
    const store = query_param.get('store')
    if (channel) {
      setSelectedChannel(channel);
      setSelectedStore(store);
      fetchAllCompanyLocations(false)
      fetchAllChannels(false)
    } else {
      fetchAllCompanyLocations();
      fetchAllChannels();
    }

  }, [location.search])



  const fetchAllCompanyLocations = async (setDefault = true) => {
    try {
      const response = await B2B_API.get(`company-location/get-all`).json();
      const data = response.response;
      if (_.size(data) > 0  && setDefault) {
        setSelectedStore(data[0].companyLocationId)
      }
      const transformedData = data.map(item => ({
        value: item.companyLocationId,
        label: item.name
      }));
      setStoreOption(transformedData);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching company locations:", error);
    }
  };

  const fetchAllChannels = async (setDefault = true) => {
    try {
      const response = await B2B_API.get(`channel/get-all-channel`).json();
      const data = response.response;
      if (_.size(data) > 0 && setDefault) {
        setSelectedChannel(data[0].channelId)
      }
      const transformedData = data.map(item => ({
        value: item.channelId,
        label: item.name
      }));
      setChannelOption(transformedData);
    } catch (error) {
      setIsError(true);
      console.error("Error fetching channels:", error);
    }
  };

  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await B2B_API.get(`pim/product?page=${pagination.pageIndex}&size=${pagination.pageSize}&channelId=${selectedChannel}&locationId=${selectedStore}&status=${status}&searchTerm=${searchTerm}`).json();
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

  const handleSearchChange = (event) => {
    const value = event.currentTarget.value;
    setSearchTerm(value);
  };

  const editVarient = (varobj) => {
    navigate(`/product/pim/enrich-product?id=${varobj.pimId}&from=${encodeURIComponent(`${window.location.pathname}?channel=${selectedChannel}&store=${selectedStore}`)}`, { state: { ...stateData, tabs: stateData.childTabs } });
  };

  return (
    <div>
      <div className='user--container'>

        <div className="channel-selection" style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
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
      <ProductGrid
        data={product}
        editVariant={editVarient}
        isLoading={isLoading}
        manualPagination={true}
        pagination={pagination}
        rowCount={rowCount}
        onPaginationChange={setPagination}
        handleSearchChange={handleSearchChange}
      />
    </div>
  );
};

export default ProductInfoManagement;
