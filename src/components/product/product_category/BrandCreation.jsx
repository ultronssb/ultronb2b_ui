import React, { useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import notify from '../../../utils/Notification';
import './Taxonomy.css';

const BrandCreation = ({ setIsCreateBrand, brandId, setBrandId, }) => {
    const initialData = {
        name: "",
        description: "",
        status: "ACTIVE",
    }
    const [brand, setBrand] = useState(initialData);

    const addBrand = async (event) => {
        event.preventDefault();
        try {
            const res = await B2B_API.post(`brand`, { json: brand }).json();
            setBrand(initialData);
            notify({
                message: res.message,
                success: true,
                error: false
            })
            setIsCreateBrand(false)
        } catch (error) {
            notify({
                message: error.message,
                success: false,
                error: true
            });
        }
    }

    useEffect(() => {
        if (brandId !== '') {
            fetchBrand()
        }
    }, [brandId])

    const fetchBrand = async () => {
        try {
            const res = await B2B_API.get(`brand/${brandId}`).json();
            setBrand(res?.response);
        } catch (error) {
            notify({ error: true, success: false, title: error?.message });
        }
    };

    const handleChange = (event, key) => {
        setBrand((prev) => (
            { ...prev, [key]: event.target.value }
        ))
    }

    const json = [
        {
            label: "Brand Id",
            value: brand?.brandId,
            onChange: (event) => handleChange(event, "brandId"),
            style: { cursor: 'not-allowed', backgroundColor: '#e2e2e2' },
            disabled: true,
            type: "text",
            placeholder: "BrandID"
        },
        {
            label: "Brand Name",
            value: brand?.name,
            required: true,
            onChange: (event) => handleChange(event, "name"),
            type: "text",
            placeholder: "Brand Name"
        },
        {
            label: "Description",
            value: brand?.description,
            onChange: (event) => handleChange(event, "description"),
            type: "text",
            placeholder: "Description"
        },
        {
            label: "Status",
            value: brand?.status,
            onChange: (event) => handleChange(event, "status"),
            type: "radio",
            className: "form-group status-container",
            placeholder: "Status",
            options: [
                { value: "ACTIVE", label: "ACTIVE" },
                { value: "INACTIVE", label: "INACTIVE" }
            ]
        }
    ]

    const handleCancel = () => {
        setIsCreateBrand(false);
        setBrandId('');
    };

    return (
        <div className='layout'>
            <form onSubmit={(event) => addBrand(event)} className='form-layout'>
                <header>{brand?.brandId ? 'Update' : 'Create'} Brand</header>
                {json.map((e, index) => (
                    <div key={index} className={e.className ? e.className : "form-group"}>
                        {e.type == "radio" ? (
                            <div className='layout-fields'>
                                <label className='layout-fields-label'>{e.label}</label>
                                <div className='layout-fields-status-input'>
                                    {e.options.map((option, idx) => (
                                        <div className='layout-fields-status-radio' key={idx}>
                                            <input
                                                id={`${e.name}-${option.value.toLowerCase()}`}
                                                value={option.value}
                                                style={e.style && e.style}
                                                onChange={(event) => e.onChange(event, e.name)}
                                                checked={e.value === option.value}
                                                type={e.type}
                                                placeholder={e.placeholder}
                                            />
                                            <label className='form-span radio' htmlFor={`${e.name}-${option.value.toLowerCase()}`}>{option.label}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                            :
                            <div className='layout-fields'>
                                <label className='layout-fields-label'>{e.label}</label>
                                <input
                                    value={e.value}
                                    className='layout-fields-input'
                                    disabled={e.disabled}
                                    onChange={e.onChange}
                                    type={e.type}
                                    required={e.required}
                                    placeholder={e.placeholder}
                                    style={e.style}
                                />
                            </div>
                        }

                    </div>
                ))}
                <div className='layout-fields-btn'>
                    <B2BButton type='button' color={'red'} onClick={handleCancel} name="Cancel" />
                    <B2BButton type='submit' name={brandId ? "Update" : "Save"} />
                </div>
            </form>
        </div>
    )
}

export default BrandCreation
