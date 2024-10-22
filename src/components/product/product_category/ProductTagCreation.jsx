import React, { useEffect, useState } from 'react'
import B2BButton from '../../../common/B2BButton';
import { B2B_API } from '../../../api/Interceptor';

const ProductTagCreation = ({ setIsCreateTag, tagId, setTagId }) => {
    const initialData = {
        name: "",
        status: "ACTIVE"
    }
    const [tag, setTag] = useState(initialData);

    const addGroup = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post(`product-tag`, { json: tag }).json();
            setTag(initialData);
            notify({
                id: 'create_tag',
                message: response.message || "Tag added successfully",
                success: true,
                error: false
            })
            setIsCreateTag(false)
        } catch (error) {
            notify({
                id: "add_tag_error",
                message: error.message,
                success: false,
                error: true
            });
        }
    }

    useEffect(() => {
        if (tagId) {
            fetchTag()
        }
    }, [tagId])

    const fetchTag = async () => {
        try {
            const res = await B2B_API.get(`product-tag/${tagId}`).json();
            setTag(res?.response);
            console.log(res.response);
        } catch (error) {
            notify({ error: true, success: false, title: error?.message });
        }
    };

    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setTag(prev => ({
            ...prev, [key]: key === 'name' ? _.capitalize(value) : value
        }));
    };

    const handleCancel = () => {
        setIsCreateTag(false)
        setTagId('')
    };

    return (
        <div className='layout'>
            <form onSubmit={(event) => addGroup(event)} className='form-layout'>
            <header>{tag?.id ? 'Update' : 'Create'} Product Tag</header>
                <div className="layout-fields">
                    <label className='layout-fields-label'>Name</label>
                    <input
                        value={tag?.name || ''}
                        className='layout-fields-input'
                        required
                        type="text"
                        onChange={(event) => handleChange(event, 'name')}
                        placeholder="Tag Name"
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
                                checked={tag?.status === "ACTIVE"}
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
                                checked={tag?.status === "INACTIVE"}
                                name="status"
                                id="status-inactive"
                            />
                            <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                        </div>
                    </div>
                </div>
                <div className='layout-fields-btn'>
                    <B2BButton type='button' color={'red'} onClick={handleCancel} name="Cancel" />
                    <B2BButton type='submit' name={tag?.id ? 'Update' : "Save"} />
                </div>
            </form>
        </div>
    )
}

export default ProductTagCreation
