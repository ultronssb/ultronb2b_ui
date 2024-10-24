import { ActionIcon, Button, Checkbox, Grid, Group, Select, Table, TextInput } from '@mantine/core';
import { IconArrowLeft, IconEye, IconMinus } from '@tabler/icons-react';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import B2BSelect from '../../common/B2BSelect';
import B2BButton from '../../common/B2BButton';
import { ActiveTabContext } from '../../layout/Layout';
import B2BHoverCard from '../../common/B2BHoverCard';
import _ from 'lodash';
import { createB2BAPI } from '../../api/Interceptor';

const styles = {
  table: {
    marginTop: '40px',
    fontFamily: 'Arial, sans-serif',
    borderCollapse: 'collapse',
    width: '100%',
  },
  tableCell: {
    border: '1px solid #dddddd',
    textAlign: 'left',
    padding: '8px',
  },
  iconCircle: {
    color: 'red',
    borderRadius: '50%',
    width: '15px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}

const SalesOrder = () => {

  const initialState = {
    customer: {},
    billLocation: {},
    shipLocation: {}
  }

  const [salesOrder, setSalesOrder] = useState(null);
  const [isUserSame, setIsUserSame] = useState(false);
  const [readOnly, setReadOnly] = useState(false)
  const [trackingIdIsEmpty, setTrackingIdIsEmpty] = useState(false)
  const location = useLocation();
  const navigate = useNavigate();
  const B2B_API = createB2BAPI();
  const { user } = useContext(ActiveTabContext);
  const { stateData } = useContext(ActiveTabContext);
  const { orderNo } = useParams();


  // useEffect(() => {
  //   if (location?.state) {
  //     const { salesOrderData } = location.state;

  //     if (!salesOrder && salesOrderData) {
  //       setReadOnly(true);
  //       setSalesOrder(salesOrderData);
  //       setIsUserSame(user?.userId === salesOrderData?.createdBy);
  //     }
  //   }
  // }, [location?.state, salesOrder]);

  useEffect(() => {
    if (orderNo) {
      fetchOrderByOrderId();
      setReadOnly(true);
    }
    setSalesOrder(initialState)
    setIsUserSame(user?.userId === salesOrder?.createdBy);
  }, [orderNo])

  const fetchOrderByOrderId = async () => {
    const response = await B2B_API.get(`order/${orderNo}`).json();
    const data = response.response;
    setSalesOrder(data);
  }


  const handleAddItem = () => {

  }

  const handleSelectChange = () => {

  }

  const changeHandler = (event, key, field = "") => {
    const { value } = event.target;

    setSalesOrder(prev => ({
      ...prev, ...(field ? {
        [field]: {
          ...prev[field],
          [key]: value
        }
      } : {
        [key]: value
      })
    }));
    if (key === 'trackingId') setTrackingIdIsEmpty(false);
  };


  const handlePaymentReceived = (event) => {
    if (salesOrder?.trackingId == null || salesOrder?.trackingId === "") {
      setTrackingIdIsEmpty(true);
      return;
    }
    const { checked } = event.target
    setSalesOrder(prev => ({ ...prev, paymentStatus: checked ? "PAID" : "DUE" }))
  }

  const getTotalAmount = () => {
    if (salesOrder) {
      const { grossTotal, totalGst, shippingCost } = salesOrder;
      return grossTotal + totalGst + shippingCost;
    } else {
      return 0;
    }
  }

  const renderTarget = () => {
    return (
      <ActionIcon style={{ marginLeft: '0.5rem', marginTop: '1.4rem' }} size="sm" variant="default">
        <IconEye />
      </ActionIcon>
    )
  }
  const renderChildren = (key) => {
    if (_.isEmpty(salesOrder) || !salesOrder) return <div>
      No Address Found
    </div>;

    const {
      nickName,
      address1,
      address2,
      email,
      mobileNo,
      city,
      state,
      country,
      pincode,
      isPrimary
    } = salesOrder[key];

    return (
      <div className="hover-card">
        <div className="card-content">
          <h3 className="nickname">Location: {nickName}</h3>
          <div className="info">
            <p><strong>Address:</strong> <span>{address1}, {address2}</span></p>
            <p><strong>City:</strong> <span>{city}</span></p>
            <p><strong>State:</strong> <span>{state}</span></p>
            <p><strong>Pincode:</strong> <span>{pincode}</span></p>
            <p><strong>Country:</strong> <span>{country}</span></p>
            <p><strong>Email:</strong> <span>{email}</span></p>
            <p><strong>Mobile No:</strong> <span>{mobileNo}</span></p>
            <p style={{ display: 'flex', alignContent: 'center' }}><strong>Is Primary:</strong><input style={{ marginLeft: '.5rem' }} type='checkbox' readOnly={readOnly} value={isPrimary} checked={isPrimary ?? false} /></p>
          </div>
        </div>

      </div>
    );
  };

  const handleSaveOrder = async () => {
    try {
      const response = await B2B_API.post(`order/update`, { json: salesOrder }).json();
      console.log(response.response)
      navigate('/sales/order-management', { state: { ...stateData, tabs: stateData.childTabs } })
    } catch (error) {
      console.log(error)
    }
  }

  const handleBack = () => {
    navigate('/sales/order-management', { state: { ...stateData, tabs: stateData.childTabs } })
  }

  return (
    <div style={{ padding: '20px' }}>
      <Grid style={{ marginBottom: '30px', fontSize: '16px' }} >
        <Grid.Col span={4}>
          <p><strong>Order No:</strong> {salesOrder?.orderNo}</p>
        </Grid.Col>
        <Grid.Col span={4}>
          <p><strong>Created Date:</strong> {salesOrder?.createdDate ? new Date(salesOrder?.createdDate)?.toLocaleDateString() : new Date()?.toLocaleDateString()}</p>
        </Grid.Col>
        <Grid.Col span={2}>
          <p><strong>Created By:</strong> {salesOrder?.createdBy || user?.firstName}</p>
        </Grid.Col>
        <div style={{ width: '15%', display: 'flex', justifyContent: 'flex-end' }}>
          <B2BButton
            style={{ color: '#000' }}
            name={"Back"}
            onClick={handleBack}
            leftSection={<IconArrowLeft size={15} />}
            color={"rgb(207, 239, 253)"}
          />
        </div>
      </Grid>


      <Grid>
        {/* Left section */}
        <Grid.Col span={6}>
          <Grid styles={{ inner: { justifyContent: 'center' } }}>
            <Grid.Col span={8}>
              <TextInput label="Customer Name" readOnly={readOnly} onChange={(event) => changeHandler(event, 'name', 'customer')} value={salesOrder?.customer?.name} placeholder="Enter customer name" />
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput label="Mobile No" readOnly={readOnly} onChange={(event) => changeHandler(event, 'mobileNo', 'customer')} value={salesOrder?.customer?.mobileNo} placeholder="Enter mobile number" />
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput label="Email" readOnly={readOnly} onChange={(event) => changeHandler(event, 'email', 'customer')} value={salesOrder?.customer?.email} placeholder="Enter email" />
            </Grid.Col>



            <Grid.Col span={8}>
              <Grid styles={{ inner: { alignItems: 'center' } }} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                <TextInput
                  label="Bill To Location"
                  value={salesOrder?.billLocation?.nickName}
                  placeholder="Enter billing location"
                  readOnly={readOnly}
                  onChange={(event) => changeHandler(event, 'nickName', 'billLocation')}
                  style={{ flex: 1 }}
                />
                <B2BHoverCard target={renderTarget()} children={renderChildren("billLocation")} />
              </Grid>
            </Grid.Col>



            <Grid.Col span={8}>
              <Grid styles={{ inner: { alignItems: 'center' } }} style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                <TextInput
                  label="Ship To Location"
                  value={salesOrder?.shipLocation?.nickName}
                  placeholder="Enter Shipping location"
                  readOnly={readOnly}
                  onChange={(event) => changeHandler(event, 'nickName', 'shipLocation')}
                  style={{ flex: 1 }}
                />
                <B2BHoverCard target={renderTarget()} children={renderChildren("shipLocation")} />
              </Grid>
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput label="Delivery Date" readOnly={readOnly} onChange={(event) => changeHandler(event, 'deliveryDate')} value={moment(salesOrder?.deliveryDate).format('YYYY-MM-DD') || ""} type="date" />
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput label="Shipping Date" readOnly={readOnly} onChange={(event) => changeHandler(event, 'shippingDate')} value={moment(salesOrder?.shippingDate || "").format('YYYY-MM-DD')} type="date" />
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput label="Delivery Mode" readOnly={readOnly} onChange={(event) => changeHandler(event, 'deliveryMode')} value={salesOrder?.deliveryMode || ""} placeholder="Enter Delivery Mode" />
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput label="Tracking ID" value={salesOrder?.trackingId} onChange={(event) => changeHandler(event, 'trackingId')} placeholder="Enter tracking ID" />
            </Grid.Col>
            <Grid.Col span={8}>
              <Select label="Payment Mode" readOnly={readOnly} onChange={(event) => changeHandler(event, 'paymentMode')} data={["credit-debit", "bank-transfer"]} value={salesOrder?.paymentMode} placeholder="Select payment mode" />
            </Grid.Col>
            <Grid.Col span={8}>
              <Checkbox style={{ marginBottom: '0.5rem' }} label={`Payment Received`} checked={salesOrder?.paymentStatus === "PAID"} onChange={(event) => handlePaymentReceived(event)} />
              {trackingIdIsEmpty && <span style={{ color: 'red' }}>*Please enter Tracking ID</span>}
            </Grid.Col>
          </Grid>
        </Grid.Col>

        {/* Right section */}
        <Grid.Col span={6}>
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ border: '1px solid #ccc' }}>Sales Order #:{salesOrder?.orderNo}</h2>
              <p style={{ border: '1px solid #ccc' }}>GST No: {salesOrder?.customer?.gstnNo}</p>
              <p style={{ border: '1px solid #ccc' }}>322/32, Indira nagar, Kol -71</p>
            </div>

            <Table style={styles.table} striped highlightOnHover>
              <thead>
                <tr>
                  {['Sl. No', 'Items', 'Kgs', 'Roll', 'Sell Rate', 'Total'].map((header) => (
                    <th key={header} style={styles.tableCell}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salesOrder?.items?.map((row, index) => (
                  <tr key={index}>
                    <td style={styles.tableCell}>
                      <Group spacing="xs">
                        {isUserSame && <ActionIcon size="sm" variant="default">
                          <IconMinus style={styles.iconCircle} size="14" />
                        </ActionIcon>}
                        {index + 1}
                      </Group>
                    </td>
                    <td>
                      <B2BSelect
                        searchable={true}
                        radius={"sm"}
                        className="no-class"
                        styles={{
                          root: { width: '100% !important' },
                          wrapper: { width: '100%' },
                          input: { borderRadius: '0px', fontSize: '14px' }
                        }
                        }
                        data={salesOrder.items.map(item => ({
                          label: item?.productVariant?.name,
                          value: item?.id
                        }))}
                        value={row?.id}
                        onChange={(value) => handleSelectChange(index, value)}
                      />
                    </td>
                    <td style={styles.tableCell}>{row?.qty}</td>
                    <td style={styles.tableCell}>{row?.roll}</td>
                    <td style={{ ...styles.tableCell, width: '5rem' }}>{(row?.totalAmount / row?.qty)}</td>
                    <td style={styles.tableCell}>{row?.totalAmount?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {isUserSame && <B2BButton onClick={handleAddItem}></B2BButton>}
            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '1rem', gap: '1rem' }}>
              <div style={{ display: "flex", flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold' }}>Remarks</label>
                <textarea style={{ width: '240px', height: '10rem', resize: 'none', outline: 'none', background: 'none', border: '1px solid silver', borderRadius: '5px' }}></textarea>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>Gross Total</label>
                  <input type='number' value={salesOrder?.grossTotal} readOnly={readOnly} style={{ width: '180px', outline: 'none', paddingLeft: '1rem', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>Shipping Cost</label>
                  <input type='number' value={salesOrder?.shippingCost} readOnly={readOnly} style={{ width: '180px', outline: 'none', paddingLeft: '1rem', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>GST</label>
                  <input type='text' value={salesOrder?.totalGst} readOnly={readOnly} style={{ width: '180px', paddingLeft: '1rem', outline: 'none', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>Total Amount</label>
                  <input type='text' value={getTotalAmount()} readOnly={readOnly} style={{ width: '180px', paddingLeft: '1rem', outline: 'none', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
              </div>
            </div>

            <Group position="right" mt="md">
              <B2BButton name={"Save"} onClick={handleSaveOrder}></B2BButton>
              <Button>Print</Button>
              <Button>Email</Button>
            </Group>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default SalesOrder;

