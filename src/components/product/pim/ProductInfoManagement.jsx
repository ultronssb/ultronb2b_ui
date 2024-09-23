import React, { useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BTableGrid from '../../../common/B2BTableGrid';
import B2BSelect from '../../../common/B2BSelect'; // Ensure you import B2BSelect
import { IconPencil } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@mantine/core';
import B2BButton from '../../../common/B2BButton';
import _ from 'lodash';

const ProductInfoManagement = () => {
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
  const navigate =useNavigate()
  const [mapChannel,setMapChannel] = useState({channelId:'',storeId:'',productsIds:[]})

  useEffect(() => {
    if(selectedChannel&&selectedStore){
    fetchAllProducts();
  }
    fetchAllCompanyLocations();
    fetchAllChannels();
  }, [pagination,selectedChannel,selectedStore]);

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
const onSave = async () =>{
  const prod ={ channelId: selectedChannel,
    locationId:selectedStore,
    productIds: selectedPairs
  }
    console.log(prod)
    const response = await B2B_API.post(`map-channel`, { json: prod }).json();
    console.log(response);
    
  // setMapChannel(prev => ({
  //   ...prev,
  //   channelId: selectedChannel,
  //   locationId:selectedStore,
  //   productIds:selectedPairs

  // }))

}
  const fetchAllProducts = async () => {
    setIsLoading(true);
    try {
      const response = await B2B_API.get(`pim/product?page=${pagination.pageIndex}&size=${pagination.pageSize}&channelId=${selectedChannel}&locationId=${selectedStore}`).json();
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
    navigate(`/product/pim/enrich-product?id=${varobj.id}`);
    // setProduct((prev => ({ ...prev, ...varobj })));
  };

  // const handleSelectPair = (product) => {
  //   const isAlreadySelected = selectedPairs.some(pair => pair === product.productId);
    
  //   if (!isAlreadySelected) {
  //     setSelectedPairs(prev => [...prev, product.productId]);
  //   } else {
  //     setSelectedPairs(prev => prev.filter(pair => pair !== product.productId));
  //   }
  // };


  return (
    <div>
    <div className='user--container'>
      
      <div className="channel-selection">
        <label htmlFor="channel-select">Select Channel:</label>
        <B2BSelect
          id="channel-select"
          value={selectedChannel}
          onChange={(value) => setSelectedChannel(value)}
          data={channelOptions}
          placeholder="Select a channel"
        />
        <label htmlFor="store-select">Store:</label>
        <B2BSelect
          id="store-select"
          value={selectedStore}
          onChange={(value) => setSelectedStore(value)}
          data={storeOptions}
          placeholder="Select a store"
        />
      </div>
      <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"Save"}
                onClick={() => onSave()}
                color={"rgb(207, 239, 253)"}
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
