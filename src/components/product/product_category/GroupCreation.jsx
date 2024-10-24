import React, { useEffect, useState } from 'react';
import B2BButton from '../../../common/B2BButton';
import notify from '../../../utils/Notification';
import { createB2BAPI } from '../../../api/Interceptor';

const GroupCreation = ({ setIsCreateGroup, groupId, setGroupId }) => {
    const initialData = {
        name: "",
        status: "ACTIVE"
    }
    const [group, setGroup] = useState(initialData);
    const B2B_API = createB2BAPI();

    const addGroup = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post(`group/save`, { json: group }).json();
            setGroup(initialData);
            setIsCreateGroup(false)
            notify({ id: 'create_group', message: response.message, success: true, error: false })
        } catch (error) {
            notify({ id: "add_group_error", message: error.message, success: false, error: true });
        }
    }

    useEffect(() => {
        if (groupId) {
            fetchGroup()
        }
    }, [groupId])

    const fetchGroup = async () => {
        try {
            const res = await B2B_API.get(`group/${groupId}`).json();
            setGroup(res?.response);
        } catch (error) {
            notify({ error: true, success: false, title: error?.message });
        }
    };

    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setGroup(prev => ({
            ...prev, [key]: key === 'name' ? value.toUpperCase() : value
        }));
    };

    const handleCancel = () => {
        setIsCreateGroup(false)
        setGroupId('')
    };

    return (
        <div className='layout'>
            <form onSubmit={(event) => addGroup(event)} className='form-layout'>
                <header>{group?.id ? 'Update' : 'Create'} Group</header>
                <div className='layout-fields'>
                    <label className='layout-fields-label'>Name</label>
                    <input
                        value={group.name || ''}
                        className='layout-fields-input'
                        required
                        type="text"
                        onChange={(event) => handleChange(event, 'name')}
                        placeholder="Group Name"
                    />
                </div>
                <div className='layout-fields'>
                    <label className='layout-fields-label'>Status</label>
                    <div className='layout-fields-status-input'>
                        <div className='layout-fields-status-radio'>
                            <input
                                type="radio"
                                value="ACTIVE"
                                onChange={(event) => handleChange(event, 'status')}
                                checked={group.status === "ACTIVE"}
                                name="status"
                                id="status-active"
                            />
                            <label className='form-span radio' htmlFor="status-active">ACTIVE</label>
                        </div>
                        <div className='layout-fields-status-radio'>
                            <input
                                type="radio"
                                value="INACTIVE"
                                onChange={(event) => handleChange(event, 'status')}
                                checked={group.status === "INACTIVE"}
                                name="status"
                                id="status-inactive"
                            />
                            <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                        </div>
                    </div>
                </div>
                <div className='layout-fields-btn'>
                    <B2BButton type='button' color={'red'} onClick={handleCancel} name="Cancel" />
                    <B2BButton type='submit' name={group?.id ? 'Update' : "Save"} />
                </div>
            </form>
        </div>
    )
}

export default GroupCreation
