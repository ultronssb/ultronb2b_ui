import React, { useEffect, useState } from 'react'
import '../../../css/formstyles/Formstyles.css';
import B2BInput from '../../../common/B2BInput';
import B2BTextarea from '../../../common/B2BTextarea';
import B2BSelect from '../../../common/B2BSelect';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import B2BTableGrid from '../../../common/B2BTableGrid';
import { Flex, Text, Tooltip } from '@mantine/core';
import { IconEdit, IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import notify from '../../../utils/Notification';
import { ERROR_MESSAGE } from '../../../common/CommonResponse';


const Channel = () => {

    const initialState = {
        channelId: '',
        description: '',
        name: '',
        companyId: '',
        status: 'ACTIVE'
    }

    const [channel, setChannel] = useState(initialState);
    const [companies, setCompanies] = useState([]);
    const [channels, setChannels] = useState([]);
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 5 })
    const [rowCount, setRowCount] = useState(0);
    const [createChannel, setCreateChannel] = useState(false);

    useEffect(() => {
        fetchCompany();
    }, [])

    useEffect(() => {
        fetchAllChannels()
    }, [pagination.pageIndex, pagination.pageSize])

    const columns = [
        {
            header: 'S.No',
            accessorFn: (_, index) => index + 1,
            size: 100,
            mantineTableHeadCellProps: {
                align: 'center'
            },
            mantineTableBodyCellProps: {
                align: 'center'
            },
        },
        {
            header: 'Channel ID',
            accessorKey: 'channelId',
        },
        {
            header: 'Channel Name',
            accessorKey: 'name',
        },
        {
            header: 'Description',
            accessorKey: 'description',
            maxSize: 600,
            size: 300,
            onFocus: () => (
                <Flex gap="md">
                    <Tooltip label="Edit">

                    </Tooltip>
                </Flex>
            )
        },
        {
            header: 'Company ID',
            accessorKey: 'companyName',
        },
        {
            header: 'Status',
            accessorKey: 'status',
            size: 150
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
                        <IconPencil onClick={() => editChannel(original)} style={{ cursor: 'pointer', color: 'teal' }} stroke={2} />
                    </div>
                )
            }
        }
    ]

    const editChannel = (channelObj) => {
        setCreateChannel(true)
        setChannel((prev) => ({ ...prev, ...channelObj }))
    }

    const fetchCompany = async () => {
        const response = await B2B_API.get('company/get-all').json();
        setCompanies(response?.response)
    }

    const fetchAllChannels = async () => {
        const response = await B2B_API.get(`channel/get-all?page=${pagination.pageIndex}&pageSize=${pagination.pageSize}`).json();
        const data = response.response
        setChannels(data.content)
        setRowCount(data.totalElements)
    }

    const handleChange = (event, key) => {
        setChannel((prev) => ({ ...prev, [key]: event.target.value }))
    }

    const handleCompanyChange = (value, key) => {
        setChannel((prev) => ({ ...prev, [key]: value }))
    }

    const handleCreateChannel = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post("channel/save", { json: channel }).json();
            setCreateChannel(false)
            fetchAllChannels();
            notify({
                id: 'channel_post_error',
                title: "Success!!!",
                message: channel.channelId ? "Channel Updated" : response.message,
                success: true,
                error: false
            })
        } catch (error) {
            notify({
                id: 'channel_post_error',
                title: "Oops!!!",
                message: error.message,
                success: false,
                error: true
            })
        }
    }

    const handleCancel = () => {
        setCreateChannel(false)
        setChannel(initialState)
    }

    return (
        <div className='grid-container'>
            {!createChannel && <>
                <div className='user--container'>
                    <Text size='lg'>Channel Details</Text>
                    <div className='right--section'>
                        <B2BButton
                            style={{ color: '#000' }}
                            name={"Create Channel"}
                            onClick={() => setCreateChannel(true)}
                            leftSection={<IconPlus size={15} />}
                            color={"rgb(207, 239, 253)"}
                        />
                    </div>
                </div>
                <B2BTableGrid
                    data={channels}
                    columns={columns}
                    enableTopToolbar={true}
                    enableGlobalFilter={true}
                    pagination={pagination}
                    rowCount={rowCount}
                    onPaginationChange={setPagination}
                    enableFullScreenToggle={true}
                />
            </>}
            {createChannel && <form onSubmit={handleCreateChannel} className='form-container centered'>
                <div className="form-group">
                    <label className='form-label'>Company ID</label>
                    <B2BSelect
                        value={channel.companyId}
                        className='form-input'
                        clearable={true}
                        data={companies.map(company => ({ label: company.name, value: company.companyId }))}
                        styles={{ input: { fontSize: '14px' } }}
                        type="text"
                        required={true}
                        placeholder="Company ID"
                        onChange={(value) => handleCompanyChange(value, "companyId")}
                    />
                </div>
                <div className="form-group">
                    <label className='form-label'>Channel ID</label>
                    <B2BInput
                        value={channel.channelId}
                        className='form-input'
                        disabled
                        type="text"
                        placeholder="Channel ID"
                        onChange={(event) => handleChange(event, "channelId")}
                    />
                </div>
                <div className="form-group">
                    <label className='form-label'>Channel Name</label>
                    <B2BInput
                        value={channel.name}
                        className='form-input'
                        type="text"
                        required={true}
                        placeholder="Channel Name"
                        onChange={(event) => handleChange(event, "name")}
                    />
                </div>
                <div className="form-group">
                    <label className='form-label'>Description</label>
                    <B2BTextarea
                        value={channel.description}
                        className='form-input'
                        required={true}
                        styles={{ input: { fontSize: '14px' } }}
                        type="text"
                        placeholder="Company Description"
                        onChange={(event) => handleChange(event, "description")}
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
                                checked={channel.status === "ACTIVE"}
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
                                checked={channel.status === "INACTIVE"}
                                name="status"
                                id="status-inactive"
                            />
                            <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                        </div>
                    </div>
                </div>
                <div className='save-button-container' style={{ paddingBlock: '2rem', paddingInline: 0, justifyContent: 'center', alignItems: 'center' }}>
                    <B2BButton type='button' onClick={() => handleCancel()} name={"Cancel"} color={"red"} />
                    <B2BButton type='submit' name={channel.channelId ? "Update" : "Save"} />
                </div>
            </form>}
        </div>
    )
}

export default Channel