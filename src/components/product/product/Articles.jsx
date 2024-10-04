import { IconPlus } from '@tabler/icons-react';
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import ProductGrid from '../../../common/ProductGrid';
import { ActiveTabContext } from '../../../layout/Layout';
import notify from '../../../utils/Notification';

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


  useEffect(() => {
    fetchAllProducts();
  }, [pagination.pageIndex, pagination.pageSize, searchTerm]);

  const editVarient = (varobj) => {
    setIsCreateProduct(true);
    navigate(`/product/product/create?id=${varobj?.productId}`);
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
