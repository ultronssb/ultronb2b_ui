import React from 'react';
import { Grid, TextInput, Textarea, Select, Button, Table, Group, ActionIcon, Space } from '@mantine/core';
import { IconMinus } from '@tabler/icons-react';

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

const Packing = () => {
  const packingNo = "1";
  const pkgDate = "04/10/2024";
  const selectOrder = "002";
  const createdBy = "Srithar";


  return (
    <div style={{ padding: '20px' }}>
      <Grid style={{ marginBottom: '30px', fontSize: '16px' }} >
        <Grid.Col span={3}>
          <p><strong>Packing No:</strong> {packingNo}</p>
        </Grid.Col>
        <Grid.Col span={3}>
          <p><strong>Pkg Date:</strong> {pkgDate}</p>
        </Grid.Col>
        <Grid.Col span={3}>
          <p><strong>Select Order:</strong> {selectOrder}</p>
        </Grid.Col>
        <Grid.Col span={3}>
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
              <TextInput label="Customer Location" placeholder="Enter location" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Mobile No" placeholder="Enter mobile number" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Email" placeholder="Enter email" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Payment Mode" placeholder="Enter Payment Mode" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Bill To Location" placeholder="Enter billing location" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Ship To Location" placeholder="Enter shipping location" />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput label="Cartoon Size" placeholder="Delivery Charges" />
            </Grid.Col>
          </Grid>
          <Group position="right" mt="md">
            <Button>Cancel</Button>
            <Button>Save</Button>
          </Group>
        </Grid.Col>

        {/* Right section */}
        <Grid.Col span={6}>
          <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ border: '1px solid #ccc' }}>Packing No. #:002</h2>
              <p style={{ border: '1px solid #ccc', fontWeight: '600' }}>GST No: 327674SDFFGG</p>
              <p style={{ border: '1px solid #ccc' }}>322/32, Indira nagar, Kol -71</p>
              <p style={{ textAlign: 'start', fontWeight: '600' }}>
                <span style={{ marginRight: '20px' }}>Order Reference: #005</span>
                <span>Invoice Reference: #002</span>
              </p>
            </div>

            <Table style={styles.table} striped highlightOnHover>
              <thead>
                <tr>
                  {['Sl. No', 'Items', 'Avail Roll', 'Commit Roll', 'Order Roll', 'Packed Roll'].map((header) => (
                    <th key={header} style={styles.tableCell}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[{ item: 'Fabric Plain', availroll: 100, comitroll: 1, orderroll: 1, pickedroll: 1 },
                { item: 'Fabric Cotton', availroll: 100, comitroll: 1, orderroll: 1, pickedroll: 1 }]
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
                      <td style={styles.tableCell}>{row.availroll}</td>
                      <td style={styles.tableCell}>{row.comitroll}</td>
                      <td style={styles.tableCell}>{row.orderroll}</td>
                      <td style={styles.tableCell}>{row.pickedroll}</td>
                    </tr>
                  ))}
              </tbody>
            </Table>

            <Textarea style={{ width: '250px', marginTop: '1rem' }} placeholder="Remark" label="Remark" minRows={4} />

            <div style={{ marginTop: '20px' }}>
              <Group>
                <TextInput label="Total Packed Qty"/>
              </Group>
            </div>

            <Group position="right" mt="md">
              <Button>Save</Button>
              <Button>Print</Button>
            </Group>
          </div>
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default Packing;

