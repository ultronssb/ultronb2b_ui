import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import DeliveryModeCreation from './DeliveryModeCreation';
import B2BForm from '../../../common/B2BForm';

const DeliveryMode = () => {
    const [deliveryModeList, setDeliveryModeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [rowCount, setRowCount] = useState(0);
    const [isCreateDeliveryMode, setIsCreateDeliveryMode] = useState(false);
    const [deliveryModeId, setDeliveryModeId] = useState('');
    const initialData = {
        name: '',
        status: 'ACTIVE'
    };
    const [deliveryMode, setDeliveryMode] = useState(initialData);

    useEffect(() => {
        fetchDeliveryModes();
    }, [pagination.pageIndex, pagination.pageSize]);

    const fetchDeliveryModes = async () => {
        setIsLoading(true);
        try {
            const res = await B2B_API.get(`delivery-mode/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
            const data = res?.response?.content || [];
            setRowCount(res?.response?.totalElements || 0);
            setDeliveryModeList(data);
        } catch (error) {
            setIsError(true);
            notify({ error: true, success: false, title: error?.message });
        } finally {
            setIsLoading(false);
        }
    };

    const json = [
        {
            label: "Name",
            value: deliveryMode.name,
            onChange: (event) => handleChange(event, 'name'),
            type: "text",
            placeholder: "Delivery Mode Name"
        },
        {
            label: "Status",
            type: "radio",
            name: "status",
            className: "form-group status-container",
            options: [
                { value: "ACTIVE", label: "ACTIVE" },
                { value: "INACTIVE", label: "INACTIVE" }
            ],
            value: deliveryMode.status,
            onChange: (event) => handleChange(event, 'status')
        }
    ];

    const columns = useMemo(() => [
        {
            header: 'S.No',
            accessorFn: (_, index) => index + 1,
            size: 100,
            mantineTableHeadCellProps: { align: 'center' },
            mantineTableBodyCellProps: { align: 'center' },
        },
        {
            header: 'Delivery Mode Name',
            accessorKey: 'name',
            size: 120
        },
        {
            header: 'Created Date',
            accessorKey: 'createdDate',
            accessorFn: (row) => dayjs(row.createdDate).format('DD/MM/YYYY'),
            size: 100,
        },
        {
            header: 'Status',
            accessorKey: 'status',
            size: 100,
            Cell: ({ cell, row }) => {
                const status = row.original.status;
                return (
                    <span style={{ color: status === 'ACTIVE' ? 'green' : 'red' }}> {status} </span>
                );
            },
        },
        {
            header: 'Actions',
            mantineTableHeadCellProps: { align: 'center' },
            mantineTableBodyCellProps: { align: 'center' },
            size: 100,
            Cell: ({ row }) => {
                const { original } = row;
                return (
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <IconPencil onClick={() => editDeliveryMode(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
                    </div>
                );
            }
        }
    ], []);

    const createDeliveryMode = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post('delivery-mode', { json: deliveryMode }).json();
            setDeliveryMode(initialData);
            notify({ message: response.message, success: true, error: false });
            setIsCreateDeliveryMode(false)
        } catch (error) {
            notify({ message: error.message, success: false, error: true });
        }
    };

    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setDeliveryMode((prev) => ({
            ...prev,
            [key]: key === 'name' ? value.toUpperCase() : value
        }));
    };


    const editDeliveryMode = (obj) => {
        setDeliveryMode(obj);
        setIsCreateDeliveryMode(true);
    };

    const handleCreate = () => {
        setIsCreateDeliveryMode(true)
        setDeliveryMode(initialData)
    }

    const handleBack = () => {
        setIsCreateDeliveryMode(false)
        setDeliveryMode(initialData)
    }

    const handleCancel = () => {
        setIsCreateDeliveryMode(false)
        setDeliveryMode(initialData)
    };

    return (
        <div>
            <div className='user--container'>
                <header>Delivery Mode Details</header>
                <div className='right--section'>
                    {
                        isCreateDeliveryMode ?
                            <B2BButton
                                style={{ color: '#000' }}
                                name={"Back"}
                                onClick={handleBack}
                                leftSection={<IconArrowLeft size={15} />}
                                color={"rgb(207, 239, 253)"}
                            />
                            :
                            <B2BButton
                                style={{ color: '#000' }}
                                name={"Create Delivery Mode"}
                                onClick={handleCreate}
                                leftSection={<IconPlus size={15} />}
                                color={"rgb(207, 239, 253)"}
                            />
                    }
                </div>
            </div>
            {
                isCreateDeliveryMode ?
                    <B2BForm
                        json={json}
                        handleChange={handleChange}
                        onSave={createDeliveryMode}
                        handleCancel={handleCancel}
                    />
                    :
                    <B2BTableGrid
                        columns={columns}
                        data={deliveryModeList}
                        isLoading={isLoading}
                        isError={isError}
                        enableTopToolbar
                        enableGlobalFilter
                        pagination={pagination}
                        rowCount={rowCount}
                        onPaginationChange={setPagination}
                        enableFullScreenToggle
                    />
            }
        </div>
    );
};

export default DeliveryMode
