import { ActionIcon, Button, Grid, Group, Select, Table, TextInput } from '@mantine/core';
import { IconMinus } from '@tabler/icons-react';
import React from 'react';

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
  const orderNo = "1";
  const createdDate = "04/10/2024";
  const createdBy = "Srithar";

  return (
    <div style={{ padding: '20px' }}>
      <Grid style={{ marginBottom: '30px', fontSize: '16px' }} >
        <Grid.Col span={4}>
          <p><strong>Order No:</strong> {orderNo}</p>
        </Grid.Col>
        <Grid.Col span={4}>
          <p><strong>Created Date:</strong> {createdBy} - {createdDate}</p>
        </Grid.Col>
        <Grid.Col span={4}>
          <p><strong>Created By:</strong> {createdBy}</p>
        </Grid.Col>
      </Grid>


      <Grid>
        {/* Left section */}
        <Grid.Col span={6}>
          <Grid>
            <Grid.Col span={6}>
              <TextInput label="Customer Name" placeholder="Enter customer name" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Mobile No" placeholder="Enter mobile number" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Email" placeholder="Enter email" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Bill To Location" placeholder="Enter billing location" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Ship To Location" placeholder="Enter shipping location" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Delivery Date" type="date" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Shipping Date" type="date" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Delivery Mode" placeholder="Enter Delivery Mode" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Tracking ID" placeholder="Enter tracking ID" />
            </Grid.Col>
            <Grid.Col span={6}>
              <Select label="Payment Mode" data={['Credit', 'Debit', 'Cash']} placeholder="Select payment mode" />
            </Grid.Col>
          </Grid>
        </Grid.Col>

        {/* Right section */}
        <Grid.Col span={6}>
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ border: '1px solid #ccc' }}>Sales Order #:001</h2>
              <p style={{ border: '1px solid #ccc' }}>GST No: 327674SDFFGG</p>
              <p style={{ border: '1px solid #ccc' }}>322/32, Indira nagar, Kol -71</p>
            </div>

            <Table style={styles.table} striped highlightOnHover>
              <thead>
                <tr>
                  {['Sl. No', 'Items', 'Roll', 'Kgs', 'Sell Rate', 'Total'].map((header) => (
                    <th key={header} style={styles.tableCell}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[{ item: 'Fabric Plain', roll: 1, kgs: 230, rate: 30, total: 150 },
                { item: 'Fabric Cotton', roll: 1, kgs: 225, rate: 32, total: 150 }]
                  .map((row, index) => (
                    <tr key={index}>
                      <td style={styles.tableCell}>
                        <Group spacing="xs">
                          <ActionIcon size="sm" variant="default">
                            <IconMinus style={styles.iconCircle} size="14" />
                          </ActionIcon>
                          {index + 1}
                        </Group>
                      </td>
                      <td style={styles.tableCell}>{row.item}</td>
                      <td style={styles.tableCell}>{row.roll}</td>
                      <td style={styles.tableCell}>{row.kgs}</td>
                      <td style={styles.tableCell}>{row.rate}</td>
                      <td style={styles.tableCell}>{row.total}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>

            <div style={{ display: 'flex', flexDirection: 'row', marginTop: '1rem', gap: '1rem' }}>
              <div style={{ display: "flex", flexDirection: 'column' }}>
                <label style={{ fontWeight: 'bold' }}>Remarks</label>
                <textarea style={{ width: '240px', height: '10rem', resize: 'none', outline: 'none', background: 'none', border: '1px solid silver', borderRadius: '5px' }}></textarea>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>Gross Total</label>
                  <input type='text' readOnly style={{ width: '180px', outline: 'none', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>Shipping Cost</label>
                  <input type='text' readOnly style={{ width: '180px', outline: 'none', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>GST</label>
                  <input type='text' readOnly style={{ width: '180px', outline: 'none', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
                  <label style={{ width: '120px', fontWeight: 'bold', }}>Total Amount</label>
                  <input type='text' readOnly style={{ width: '180px', outline: 'none', background: 'none', color: '#666666', border: '1px solid silver', height: '2.5rem', borderRadius: '5px' }} />
                </div>
              </div>
            </div>

            <Group position="right" mt="md">
              <Button>Save</Button>
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

