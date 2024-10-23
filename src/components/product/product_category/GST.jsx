import { Text } from '@mantine/core';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';
import '../../../css/formstyles/Formstyles.css';
import notify from '../../../utils/Notification';
import B2BTextarea from '../../../common/B2BTextarea';
import B2BInput from '../../../common/B2BInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';

const GST = () => {
  const initialGSTState = {
    gstId: '',
    name: '',
    gstRate: '',
    igst: '',
    cgst: '',
    sgst: '',
    gstcess: '',
    description: '',
    status: 'ACTIVE',
  };

  const [gst, setGst] = useState(initialGSTState);
  const [gsts, setGsts] = useState([]);
  const [createGSTArea, setCreateGSTArea] = useState(false);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
  const [rowCount, setRowCount] = useState(5);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('ACTIVE')
  const [openDropDown, setOpenDropDown] = useState(false)

  useEffect(() => {
    fetchAllGSTs();
  }, [pagination.pageIndex, pagination.pageSize]);


  const columns = useMemo(() => [
    {
      header: 'Name',
      accessorKey: 'name'
    },
    {
      header: 'Rate',
      accessorKey: 'gstRate',
      size: 80
    },
    {
      header: 'IGST',
      accessorKey: 'igst',
      size: 80
    },
    {
      header: 'CGST',
      accessorKey: 'cgst',
      size: 80
    },
    {
      header: 'SGST',
      accessorKey: 'sgst',
      size: 80
    },
    {
      header: 'GST Cess',
      accessorKey: 'gstcess',
      size: 80
    },
    {
      header: 'Description',
      accessorKey: 'description',
      size: 130
    },
    {
      header: (
        <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
          <div>Status ({status})</div>
          <FontAwesomeIcon icon={openDropDown ? faFilterCircleXmark : faFilter} onClick={() => setOpenDropDown(!openDropDown)} />
        </div>
      ),
      accessorKey: 'status',
      size: 120,
      Cell: ({ cell, row }) => {
        const status = row.original.status;
        return (
          <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}>
            {status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      mantineTableHeadCellProps: {
        align: 'center'
      },
      mantineTableBodyCellProps: {
        align: 'center'
      },
      size: 100,
      Cell: ({ row }) => {
        const { original } = row;
        return (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <IconPencil onClick={() => editGST(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
          </div>
        );
      }
    }
  ], []);



  const editGST = (gstObj) => {
    setCreateGSTArea(true);
    setGst((prev => ({ ...prev, ...gstObj })));
  };


  const fetchAllGSTs = async () => {
    setIsLoading(true);
    try {
      const response = await B2B_API.get(`gst/get-all?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
      const data = response?.response?.content || [];
      setRowCount(response?.response?.totalElements || 0);
      setGsts(data);
    } catch (error) {
      setIsError(true);
      notify({
        id: "fetch_gsts",
        error: true,
        success: false,
        title: error?.message || ERROR_MESSAGE
      });
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (event, key) => {
    const value = event?.target?.value;
    if (key === 'gstRate') {
      const rate = parseFloat(value);
      if (!rate) {
        setGst((prev) => ({
          ...prev,
          gstRate: '',
          igst: '',
          cgst: '',
          sgst: '',
          name: '',
        }));
      } else {
        const calculatedIgst = rate;
        const calculatedCgstSgst = rate / 2;
        setGst((prev) => ({
          ...prev,
          gstRate: value,
          igst: calculatedIgst,
          cgst: calculatedCgstSgst,
          sgst: calculatedCgstSgst,
          name: `GST ${rate}%`,
        }));
      }
    } else if (['igst', 'cgst', 'sgst', 'name'].includes(key)) {
      return;
    } else {
      setGst((prev) => ({ ...prev, [key]: value }));
    }
  };


  const createGST = async (event) => {
    event.preventDefault();
    try {
      const response = await B2B_API.post('gst', { json: gst }).json();
      setGst(initialGSTState);
      setCreateGSTArea(false);
      fetchAllGSTs();
      notify({
        id: gst.gstId ? 'update_gst_success' : 'create_gst_success',
        title: "Success!!!",
        message: gst.gstId ? "Updated Successfully" : response?.message,
        success: true,
      });
    } catch (error) {
      notify({
        id: gst.gstId ? 'update_gst_error' : 'create_gst_error',
        title: "Oops!!!",
        message: error.message || ERROR_MESSAGE,
        error: true,
        success: false,
      });
    }
  };


  return (
    <>
      {!createGSTArea && (
        <>
          <div className='user--container'>
            <header>GST Details</header>
            <div className='right--section'>
              <B2BButton
                style={{ color: '#000' }}
                name={"Create GST"}
                onClick={() => setCreateGSTArea(true)}
                leftSection={<IconPlus size={15} />}
                color={"rgb(207, 239, 253)"}
              />
            </div>
          </div>
          <B2BTableGrid
            columns={columns}
            data={gsts}
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
      {createGSTArea && (
        <>
          <div className='user--container'>
            <Text size='lg'>Create GST</Text>
          </div>
          <div className='grid-container'>
            <form onSubmit={createGST} className='form-container'>
              <div className="form-group">
                <label className='form-label'>GST ID</label>
                <B2BInput
                  value={gst.gstId}
                  className='form-input'
                  disabled
                  style={{ cursor: 'not-allowed' }}
                  onChange={(event) => handleChange(event, 'gstId')}
                  type="text"
                  placeholder="GST ID"
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Name</label>
                <B2BInput
                  value={gst.name}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'Name'}
                  onChange={(event) => handleChange(event, 'name')}
                  type={'text'}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className='form-label'>GST Rate</label>
                <B2BInput
                  value={gst.gstRate}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'GST Rate'}
                  onChange={(event) => handleChange(event, 'gstRate')}
                  type={'number'}
                  required={true}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>IGST</label>
                <B2BInput
                  value={gst.igst}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'IGST'}
                  onChange={(event) => handleChange(event, 'igst')}
                  type={'text'}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className='form-label'>CGST</label>
                <B2BInput
                  value={gst.cgst}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'CGST'}
                  onChange={(event) => handleChange(event, 'cgst')}
                  type={'text'}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className='form-label'>SGST</label>
                <B2BInput
                  value={gst.sgst}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'SGST'}
                  onChange={(event) => handleChange(event, 'sgst')}
                  type={'text'}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label className='form-label'>GST Cess</label>
                <B2BInput
                  value={gst.gstcess}
                  styles={{ input: { fontSize: '14px' } }}
                  placeholder={'GST Cess'}
                  onChange={(event) => handleChange(event, 'gstcess')}
                  type={'text'}
                />
              </div>
              <div className="form-group">
                <label className='form-label'>Description</label>
                <B2BTextarea
                  value={gst.description}
                  className='form-input'
                  required
                  type="text"
                  onChange={(event) => handleChange(event, 'description')}
                  placeholder="Description"
                />
              </div>
              <div className="form-group status-container">
                <label className='form-label'>Status</label>
                <div className='radio-group'>
                  <div className='status-block'>
                    <input
                      type="radio"
                      value="ACTIVE"
                      onChange={(event) => handleChange(event, 'status')}
                      checked={gst.status === "ACTIVE"}
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
                      checked={gst.status === "INACTIVE"}
                      name="status"
                      id="status-inactive"
                    />
                    <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                  </div>
                </div>
              </div>
              <div className='save-button-container'>
                <B2BButton type='button' onClick={() => { setCreateGSTArea(false); setGst(initialGSTState) }} color={'red'} name="Cancel" />
                <B2BButton type='submit' name={gst?.gstId ? "Update" : "Save"} />

              </div>
            </form>

          </div>
        </>
      )}
    </>
  );
};

export default GST;
