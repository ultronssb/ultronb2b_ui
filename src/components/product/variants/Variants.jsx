import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react'
import { B2B_API } from '../../../api/Interceptor';
import notify from '../../../utils/Notification';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import B2BTableGrid from '../../../common/B2BTableGrid';
import B2BButton from '../../../common/B2BButton';
import { ColorInput, ColorSwatch, Text } from '@mantine/core';
import B2BInput from '../../../common/B2BInput';
import B2BSelectable from '../../../common/B2BSelectable';
import _ from 'lodash';

const Variants = () => {
  const initialState = {
    variantId: '',
    name: '',
    value: '',
    hexaColorCode: '',
    status: 'ACTIVE'
  };

  const [varient, setVarient] = useState(initialState);
  const [varients, setVarients] = useState([]);
  const [varientType, setVarientType] = useState([]);
  const [createUser, setCreateUser] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);



  useEffect(() => {
    fetchAllVarients();
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    fetchAllVarientType();
  }, [])

  const columns = useMemo(() => [
    {
      header: 'VariantId',
      accessorKey: 'variantId'
    },
    {
      header: 'Name',
      accessorKey: 'name'
    },
    {
      header: 'Value',
      accessorKey: 'value'
    },
    {
      header: 'HexaColorCode',
      accessorKey: 'hexaColorCode',
      Cell: ({ row }) => {
        const { original } = row;
        return (
          original.hexaColorCode ? <ColorSwatch size={20} color={original.hexaColorCode} /> : "-"

        );
      }
    },
    {
      header: 'Status',
      accessorKey: 'status'
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
            <IconTrash style={{ cursor: 'pointer', color: 'red' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);

  const editVarient = (varobj) => {
    setCreateUser(true);
    console.log(varobj, "varobj");
    setVarient((prev => ({ ...prev, ...varobj })));
  };
  console.log(varient, "varrient");

  const fetchAllVarients = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`variant/get-All?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setVarients(data);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_varients",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllVarientType = async () => {
    try {
      setIsLoading(true);
      const response = await B2B_API.get(`variantType`).json();
      const data = response?.response || [];
      setVarientType(data);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_varients",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (event, key) => {

    setVarient(prev => ({ ...prev, [key]: key === "name" ? event : event?.target?.value }));
  };

  const handleColorChange = (color) => {
    setVarient(prev => ({ ...prev, hexaColorCode: color }));
  };
  const submitVarient = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post('variant', { json: varient }).json();
      setVarient(initialState);
      setCreateUser(false);
      fetchAllVarients();
      notify({
        id: varient.variantId ? 'update_variant_success' : 'create_variant_success',
        title: "Success!!!",
        message: varient.variantId ? "Updated Successfully" : response?.message,
        success: true,
      });
    } catch (error) {
      notify({
        id: varient.variantId ? 'update_variant_error' : 'create_variant_error',
        title: "Oops!!!",
        message: error.response?.message || ERROR_MESSAGE,
        error: true,
        success: false,
      });
    }
  };

  console.log(_.includes(['color', 'colour'], varient.name.toLowerCase()))
  return (
    <>
      {!createUser && (
        <>
          <div className='user--container'>
            <Text size='lg'>Varient Details</Text>
            <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"Create Variants"}
                onClick={() => setCreateUser(true)}
                rightSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          <B2BTableGrid
            columns={columns}
            data={varients}
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
      {createUser && (
        <>
          <div className='user--container'>
            <Text size='lg'>Create Varient</Text>
          </div>
          <div className='grid-container'>
            <form onSubmit={submitVarient} className='form-container'>
              <div className="form-group">
                <label className='form-label'>VarientID</label>
                <B2BInput
                  value={varient.variantId}
                  className='form-input'
                  disabled
                  style={{ cursor: 'not-allowed' }}
                  onChange={(event) => handleChange(event, 'variantId')}
                  type="text"
                  placeholder="VariantId"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Name</label>
                <B2BSelectable
                  data={varientType}
                  value={varient.name || ""}
                  setData={setVarientType}
                  setValue={(event) => handleChange(event, 'name')}

                />
              </div>
              <div className="form-group">
                <label className='form-label'>Value</label>
                <B2BInput
                  value={varient.value}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Value'}
                  onChange={(event) => handleChange(event, 'value')}
                  type={'text'}
                  required={true}
                />
              </div>
              {_.includes(['color', 'colour'], varient.name.toLowerCase()) && < div className="form-group">
                <label className='form-label'>Hexa Color Code</label>
                <ColorInput
                  size="md"
                  value={varient.hexaColorCode}
                  placeholder="color"
                  onChange={handleColorChange}
                  style={{ width: '250px' }}
                />
              </div>}
              <div className="form-group status-container">
                <label className='form-label'>Status</label>
                <div className='radio-group'>
                  <div className='status-block'>
                    <input
                      type="radio"
                      value="ACTIVE"
                      onChange={(event) => handleChange(event, 'status')}
                      checked={varient.status === "ACTIVE"}
                      name="status"
                      id="status-active"
                    />
                    <label className='form-span radio' htmlFor="status-active">ACTIVE</label>
                  </div>
                  <div className='status-block'>
                    <input
                      type="radio"
                      value="INACTIVE"
                      onChange={(event) => handleChange(event, 'status')}
                      checked={varient.status === "INACTIVE"}
                      name="status"
                      id="status-inactive"
                    />
                    <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                  </div>
                </div>
              </div>
              <div className='save-button-container'>
                <B2BButton type='button' onClick={() => { setCreateUser(false); setVarient(initialState); }} color={'red'} name="Cancel" />
                <B2BButton type='submit' name={varient?.variantId ? "Update" : "Save"} />
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default Variants;
