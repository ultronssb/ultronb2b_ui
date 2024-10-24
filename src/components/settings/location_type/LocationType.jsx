import { IconArrowLeft, IconPencil, IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import B2BButton from '../../../common/B2BButton';
import B2BInput from '../../../common/B2BInput';
import B2BTableGrid from '../../../common/B2BTableGrid';
import notify from '../../../utils/Notification';
import { createB2BAPI } from '../../../api/Interceptor';
import B2BForm from '../../../common/B2BForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faFilterCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Text } from '@mantine/core';

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
    const B2B_API = createB2BAPI();
    const [isCreateLocation, setIsCreateLocation] = useState(false);
    const [status, setStatus] = useState('ACTION');
    const [openMenubar, setOpenMenubar] = useState(false);

    useEffect(() => {
        fetchLocationTypes();
    }, [pagination.pageIndex, pagination.pageSize, status]);

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
            header: (
                <div style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
                    <div onClick={() => setOpenMenubar(prev => !prev)}>Status({status})</div>
                    <FontAwesomeIcon icon={openMenubar ? faFilterCircleXmark : faFilter} onClick={() => setOpenMenubar(!openMenubar)} />
                    {openMenubar && <div className='status-dropdown'>
                        <div onClick={() => handleStatusChange('ACTIVE')} className='select-status'>
                            <Text size="xs" fw={800}>ACTIVE</Text>
                        </div>
                        <div onClick={() => handleStatusChange('INACTIVE')} className='select-status'>
                            <Text size="xs" fw={800}>INACTIVE</Text>
                        </div>
                    </div>}
                </div>
            ),
            accessorKey: 'status',
            size: 100,
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
    ], [status,openMenubar]);

    const handleStatusChange = (newStatus) => {
        setIsCreateLocation(false)
        setStatus(newStatus)
        setOpenMenubar(false)
    }

    const editLocationType = (obj) => {
        setLocationType(obj);
        setIsCreateLocation(true)
    };

    const fetchLocationTypes = async () => {
        setIsLoading(true);
        try {
            const res = await B2B_API.get(`location-type/view?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}&status=${status}`).json();
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
            fetchLocationTypes()
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

    const handleBack = () => {
        setIsCreateLocation(false);
        setLocationType(initialData);
    }

    const handleCreate = () => {
        setIsCreateLocation(true)
        setLocationType(initialData);
    }

    const handleCancel = () => {
        setIsCreateLocation(false)
        setLocationType(initialData);
    }

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <header>Location Type Details</header>
                <div className='left--section'>
                    {
                        isCreateLocation ?
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
                                name={"Create Role"}
                                onClick={handleCreate}
                                leftSection={<IconPlus size={15} />}
                                color={"rgb(207, 239, 253)"}
                            />
                    }
                </div>
            </div>
            {
                isCreateLocation ?
                    <B2BForm
                        json={json}
                        handleChange={handleChange}
                        onSave={createLocationType}
                        handleCancel={handleCancel}
                    />

                    : <B2BTableGrid
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
            }
        </div >
    );
};

export default LocationType;
