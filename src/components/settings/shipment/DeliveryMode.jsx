import { IconPencil } from '@tabler/icons-react';
import React, { useEffect, useMemo, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';

const DeliveryMode = () => {
    const initialData = {
        name: '',
        status: 'ACTIVE'
    };

    const [deliveryMode, setDeliveryMode] = useState(initialData);
    const [deliveryModeList, setDeliveryModeList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [rowCount, setRowCount] = useState(0);

    useEffect(() => {
        fetchDeliveryModes();
    }, [pagination.pageIndex, pagination.pageSize]);

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

    const editDeliveryMode = (obj) => {
        setDeliveryMode((prev) => ({ ...prev, ...obj }));
    };

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

    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setDeliveryMode((prev) => ({
            ...prev,
            [key]: key === 'name' ? value.toUpperCase() : value
        }));
    };

    const createDeliveryMode = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post('delivery-mode', { json: deliveryMode }).json();
            setDeliveryMode(initialData);
            fetchDeliveryModes()
            notify({ message: response.message, success: true, error: false });
        } catch (error) {
            notify({ message: error.message, success: false, error: true });
        }
    };

    const json = [
        {
            label: "Delivery Mode Name",
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

    return (
        <div>
            <div>
                <header>Delivery Mode Details</header>
            </div>
            <div className='grid-container'>
                <form onSubmit={createDeliveryMode} className='form-container'>
                    {json.map((e, index) => (
                        <div key={index} className={e.className || "form-group"}>
                            <label className='form-label'>{e.label}</label>
                            {e.type === "radio" ? (
                                <div className='radio-label-block'>
                                    {e.options.map((option, idx) => (
                                        <div key={idx} className='radio-group'>
                                            <div className='status-block'>
                                                <input id={`${e.name}-${option.value.toLowerCase()}`} value={option.value} onChange={e.onChange} checked={e.value === option.value} type={e.type} />
                                                <label className='form-span radio' htmlFor={`${e.name}-${option.value.toLowerCase()}`} >
                                                    {option.label}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <B2BInput value={e.value} className='form-input' onChange={e.onChange} type={e.type} required placeholder={e.placeholder} />
                            )}
                        </div>
                    ))}
                    <div className='save-button-container'>
                        <B2BButton type='button' color='red' onClick={() => setDeliveryMode(initialData)} name="Cancel" />
                        <B2BButton type='submit' name={deliveryMode?.deliveryModeId ? 'Update' : "Save"} />
                    </div>
                </form>
            </div>
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
        </div>
    );
};

export default DeliveryMode
