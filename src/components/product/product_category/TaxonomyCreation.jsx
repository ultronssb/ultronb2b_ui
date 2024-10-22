import React, { useEffect, useState } from 'react';
import { B2B_API } from '../../../api/Interceptor';
import B2BButton from '../../../common/B2BButton';
import notify from '../../../utils/Notification';
import './Taxonomy.css';

const TaxonomyCreation = ({ setIsCreateTaxonomy, taxonomyId, setTaxonomyId }) => {
    const initialData = {
        name: "",
        status: "ACTIVE"
    }
    const [taxonomy, setTaxonomy] = useState(initialData);

    const addTaxonomy = async (event) => {
        event.preventDefault();
        try {
            const response = await B2B_API.post(`taxonomy`, { json: taxonomy }).json();
            setTaxonomy(initialData);
            notify({
                message: response.message,
                success: true,
                error: false
            })
            setIsCreateTaxonomy(false)
        } catch (error) {
            notify({
                message: error.message,
                success: false,
                error: true
            });
        }
    }

    useEffect(() => {
        if (taxonomyId !== '') {
            fetchTaxonomy()
        }
    }, [taxonomyId])

    const fetchTaxonomy = async () => {
        try {
            const res = await B2B_API.get(`taxonomy/${taxonomyId}`).json();
            setTaxonomy(res?.response);
            console.log(res.response);
        } catch (error) {
            notify({ error: true, success: false, title: error?.message });
        }
    };

    const handleChange = (event, key) => {
        const value = event.target.type === 'radio' ? event.target.value : event.target.value;
        setTaxonomy(prev => ({
            ...prev, [key]: key === 'name' ? value.toUpperCase() : value
        }));
    };

    const handleCancel = () => {
        setIsCreateTaxonomy(false)
        setTaxonomyId('')
    };

    return (
        <div className='layout'>
            <form onSubmit={(event) => addTaxonomy(event)} className='form-layout'>
                <header>{taxonomy?.id ? 'Update' : 'Create'} Taxonomy</header>
                <div className='layout-fields'>
                    <label className='layout-fields-label'>Name</label>
                    <input
                        value={taxonomy?.name || ''}
                        className='layout-fields-input'
                        required
                        type="text"
                        onChange={(event) => handleChange(event, 'name')}
                        placeholder="Taxonomy Name"
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
                                checked={taxonomy?.status === "ACTIVE"}
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
                                checked={taxonomy?.status === "INACTIVE"}
                                name="status"
                                id="status-inactive"
                            />
                            <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                        </div>
                    </div>
                </div>
                <div className='layout-fields-btn'>
                    <B2BButton type='button' color={'red'} onClick={handleCancel} name="Cancel" />
                    <B2BButton type='submit' name={taxonomy?.id ? 'Update' : "Save"} />
                </div>
            </form>
        </div>
    )
}

export default TaxonomyCreation
