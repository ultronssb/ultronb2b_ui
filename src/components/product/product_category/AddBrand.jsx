import React from 'react'
import B2BButton from '../../../common/B2BButton'

const AddBrand = ({ modalContent, onClose, saveData, handleModalChange }) => {
    return (
        <div className='layout'>
            <form onSubmit={(e) => saveData(e, modalContent?.title)} className='form-layout'>
                <h3>{modalContent?.id ? 'Update' : 'Create'} {modalContent.title}</h3>
                <div className='layout-fields'>
                    <label className='layout-fields-label'>Name</label>
                    <input
                        value={modalContent?.name || ''}
                        className='layout-fields-input'
                        required
                        type="text"
                        onChange={(event) => handleModalChange(event, 'name')}
                        placeholder={`${modalContent?.title} Name`}
                    />
                </div>
                <div className='layout-fields'>
                    <label className='layout-fields-label'>Status</label>
                    <div className='layout-fields-status-input'>
                        <div className='layout-fields-status-radio'>
                            <input
                                type="radio"
                                value="ACTIVE"
                                onChange={(event) => handleModalChange(event, 'status')}
                                checked={modalContent?.status === "ACTIVE"}
                                name="status"
                                id="status-active"
                            />
                            <label className='form-span radio' htmlFor="status-active">ACTIVE</label>
                        </div>
                        <div className='layout-fields-status-radio'>
                            <input
                                type="radio"
                                value="INACTIVE"
                                onChange={(event) => handleModalChange(event, 'status')}
                                checked={modalContent?.status === "INACTIVE"}
                                name="status"
                                id="status-inactive"
                            />
                            <label className='form-span radio' htmlFor="status-inactive">INACTIVE</label>
                        </div>
                    </div>
                </div>
                <div className='layout-fields-btn'>
                    <B2BButton type='button' onClick={onClose} color={'red'} name="Cancel" />
                    <B2BButton type='submit' name={modalContent?.id ? 'Update' : "Save"} />
                </div>
            </form>
        </div>
    )
}

export default AddBrand