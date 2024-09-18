import { Text } from '@mantine/core';
import { IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import { ActiveTabContext } from '../../../layout/Layout';
import notify from '../../../utils/Notification';

const LocationDetails = () => {
  const [locations, setLocations] = useState([]);
  const [isCreateProduct, setIsCreateProduct] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    fetchAllCompanyLocations();
  }, [pagination.pageIndex, pagination.pageSize]);

  const columns = useMemo(() => [
    {
      header: 'Location Id',
      accessorKey: 'companyLocationId'
    },
    {
      header: 'Location Name',
      accessorKey: 'name'
    },
    {
      header: 'Address',
      accessorKey: 'address'
    },
    {
      header: 'Email',
      accessorKey: 'email'
    },
    {
      header: 'Mobile',
      accessorKey: 'mobileNumber'
    },
    {
      header: 'Location Type',
      accessorKey: 'locationType'
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
          <IconPencil onClick={() => editVarient(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editVarient = (varobj) => {
    setIsCreateProduct(true);
    navigate(`/settings/location/new-location?id=${varobj.companyLocationId}`);
    setProduct((prev => ({ ...prev, ...varobj })));
  };

  const fetchAllCompanyLocations = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`company-location/view?page=${pagination.pageIndex}&size=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      console.log(data)
      const transformedData = data.map(item => ({
        companyLocationId: item.companyLocationId,
        name: item.name,
        address: item.address,
        email: item.email,
        mobileNumber: item.mobileNumber,
        locationType: item.locationType?.name 
      }));
      setLocations(transformedData);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_location",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
  
    navigate('/settings/location/new-location' )
  }

  return (
    <>
      {!isCreateProduct && (
        <>
          <div className='user--container'>
            <Text size='lg'> Location Details</Text>
            <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"New Location"}
                onClick={(e) => handleChange(e)}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          <B2BTableGrid
            columns={columns}
            data={locations}
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
        </>
      )}
    </>
  );
};

export default LocationDetails;

