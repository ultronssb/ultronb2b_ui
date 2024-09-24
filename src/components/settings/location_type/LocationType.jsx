import React, { useEffect, useMemo, useState } from 'react';
import B2BTableGrid from '../../../common/B2BTableGrid';
import B2BButton from '../../../common/B2BButton';
import { IconPencil } from '@tabler/icons-react';
import B2BInput from '../../../common/B2BInput';
import dayjs from 'dayjs';
import notify from '../../../utils/Notification';
import { B2B_API } from '../../../api/Interceptor';

const LocationType = () => {
    const initialData = {
        name: '',
        status: 'ACTIVE'
    };

    const [locationType, setLocationType] = useState(initialData);
    const [locationTypes, setLocationTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 });
    const [rowCount, setRowCount] = useState(0);

    useEffect(() => {
        fetchLocationTypes();
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
            header: 'Location Type Name',
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
                        <IconPencil
                            onClick={() => editLocationType(original)}
                            style={{ cursor: 'pointer', color: 'teal' }}
                            stroke={2}
                        />
                    </div>
                );
            }
        }
    ], []);

    const editLocationType = (obj) => {
        setLocationType((prev) => ({ ...prev, ...obj }));
    };

    const fetchLocationTypes = async () => {
        setIsLoading(true);
        try {
            const res = await B2B_API.get(`location-type/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
            const data = res?.response?.content || [];
            setRowCount(res?.response?.totalElements || 0);
            setLocationTypes(data);
        } catch (error) {
            setIsError(true);
            notify({ error: true, success: false, title: error?.message });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setLocationType((prev) => ({
            ...prev,
            [key]: key === 'name' ? value.toUpperCase() : value
        }));
    };

    const createLocationType = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post('location-type', { json: locationType }).json();
            setLocationType(initialData);
            fetchLocationTypes();
            notify({ id: "add_location_type", message: response.message, success: true, error: false });
        } catch (error) {
            notify({ id: "add_location_type_error", message: error.message, success: false, error: true });
        }
    };

    const json = [
        {
            label: "Location Type Name",
            value: locationType.name,
            onChange: (event) => handleChange(event, 'name'),
            type: "text",
            placeholder: "Location Type Name"
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
            value: locationType.status,
            onChange: (event) => handleChange(event, 'status')
        }
    ];

    return (
        <div>
            <div className='grid-container'>
                <form onSubmit={createLocationType} className='form-container'>
                    {json.map((e, index) => (
                        <div key={index} className={e.className || "form-group"}>
                            <label className='form-label'>{e.label}</label>
                            {e.type === "radio" ? (
                                <div className='radio-label-block'>
                                    {e.options.map((option, idx) => (
                                        <div key={idx} className='radio-group'>
                                            <div className='status-block'>
                                                <input
                                                    id={`${e.name}-${option.value.toLowerCase()}`}
                                                    value={option.value}
                                                    onChange={e.onChange}
                                                    checked={e.value === option.value}
                                                    type={e.type}
                                                />
                                                <label
                                                    className='form-span radio'
                                                    htmlFor={`${e.name}-${option.value.toLowerCase()}`}
                                                >
                                                    {option.label}
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <B2BInput
                                    value={e.value}
                                    className='form-input'
                                    onChange={e.onChange}
                                    type={e.type}
                                    required
                                    placeholder={e.placeholder}
                                />
                            )}
                        </div>
                    ))}
                    <div className='save-button-container'>
                        <B2BButton type='button' color='red' onClick={() => setLocationType(initialData)} name="Cancel" />
                        <B2BButton type='submit' name={locationType?.locationTypeId ? 'Update' : "Save"} />
                    </div>
                </form>
            </div>
            <B2BTableGrid
                columns={columns}
                data={locationTypes}
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

export default LocationType;
