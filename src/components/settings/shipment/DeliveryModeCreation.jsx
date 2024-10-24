import React, { useEffect, useState } from 'react'
import notify from '../../../utils/Notification';
import B2BButton from '../../../common/B2BButton';
import { createB2BAPI } from '../../../api/Interceptor';

const DeliveryModeCreation = ({ setIsCreateDeliveryMode, deliveryModeId, setDeliveryModeId }) => {
    const initialData = {
        name: '',
        status: 'ACTIVE'
    };
    const [deliveryMode, setDeliveryMode] = useState(initialData);
    const B2B_API = createB2BAPI();

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

    useEffect(() => {
        if (deliveryModeId !== '') {
            fetchDeliveryMode()
        }
    }, [deliveryModeId])

    const fetchDeliveryMode = async () => {
        try {
            const res = await B2B_API.get(`delivery-mode/${deliveryModeId}`).json();
            setDeliveryMode(res?.response);
        } catch (error) {
            notify({ error: true, success: false, title: error?.message });
        }
    };

    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setDeliveryMode((prev) => ({
            ...prev,
            [key]: key === 'name' ? value.toUpperCase() : value
        }));
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

    const handleCancel = () => {
        setIsCreateDeliveryMode(false)
        setDeliveryModeId('')
    };

    return (
        <div className='layout'>
            <form onSubmit={createDeliveryMode} className='form-layout'>
                {json.map((e, index) => (
                    <div key={index} className={e.className || "form-group"}>
                        {e.type === "radio" ? (
                            <div className='layout-fields'>
                                <label className='layout-fields-label'>{e.label}</label>
                                <div className='layout-fields-status-input'>
                                    {e.options.map((option, idx) => (
                                        <div className='layout-fields-status-radio' key={idx}>
                                            <input id={`${e.name}-${option.value.toLowerCase()}`} value={option.value} onChange={e.onChange} checked={e.value === option.value} type={e.type} />
                                            <label className='form-span radio' htmlFor={`${e.name}-${option.value.toLowerCase()}`} >{option.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='layout-fields'>
                                <label className='layout-fields-label'>{e.label}</label>
                                <input
                                    value={e.value}
                                    className='layout-fields-input'
                                    onChange={e.onChange}
                                    type={e.type}
                                    required
                                    placeholder={e.placeholder}
                                />
                            </div>
                        )}
                    </div>
                ))}
                <div className='layout-fields-btn'>
                    <B2BButton type='button' color={'red'} onClick={handleCancel} name="Cancel" />
                    <B2BButton type='submit' name={deliveryMode?.deliveryModeId ? 'Update' : "Save"} />
                </div>
            </form>
        </div>
    )
}

export default DeliveryModeCreation
