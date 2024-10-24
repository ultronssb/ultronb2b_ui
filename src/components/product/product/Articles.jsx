import { IconPlus } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import B2BButton from '../../../common/B2BButton';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import ProductGrid from '../../../common/ProductGrid';
import { ActiveTabContext } from '../../../layout/Layout';
import notify from '../../../utils/Notification';
import { createB2BAPI } from '../../../api/Interceptor';

const Articles = () => {

  const { stateData } = useContext(ActiveTabContext);
  const [products, setProducts] = useState([]);
  const [isCreateProduct, setIsCreateProduct] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const query_param = new URLSearchParams(location.search);
  const page = query_param.get('page');
  const size = query_param.get('size');
  const search = query_param.get('search');
  const B2B_API = createB2BAPI();

  useEffect(() => {
    fetchAllProducts();
  }, [pagination.pageIndex, pagination.pageSize, searchTerm]);

  useEffect(() => {
    if(page && size) {
      setPagination({pageIndex: parseInt(page), pageSize: parseInt(size)})
      setSearchTerm(search)
    }
  },[location.search])

  console.log("pagination :",pagination)
  const editVarient = (varobj) => {
    setIsCreateProduct(true);
    navigate(`/product/product/create?id=${varobj?.productId}&page=${pagination.pageIndex}&size=${pagination.pageSize}&search=${searchTerm}`, { state: { ...stateData, tabs: stateData.childTabs } });
  };

  const fetchAllProducts = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`product/products/search?page=${pagination.pageIndex}&size=${pagination.pageSize}&searchTerm=${searchTerm}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setProducts(data);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_products",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    setIsCreateProduct(true)
    navigate('/product/product/create', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  const handleSearchChange = (event) => {
    const value = event.currentTarget.value;
    setSearchTerm(value);
  };

  return (
    <>
      {!isCreateProduct && (
        <div>
          <div className='user--container'>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'end' }}>
              <B2BButton
                style={{ color: '#000', }}
                name={"Create Product"}
                onClick={(e) => handleChange(e)}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          <ProductGrid
            isLoading={isLoading}
            isError={isError}
            data={products}
            editVariant={editVarient}
            onPaginationChange={setPagination}
            pagination={pagination}
            rowCount={rowCount}
            manualPagination={true}
            searchTerm={searchTerm}
            handleSearchChange={handleSearchChange}
          />
        </div>
      )}
    </>
  );
};

export default Articles;
