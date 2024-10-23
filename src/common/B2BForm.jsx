import React from 'react'
import B2BButton from './B2BButton'

const B2BForm = ({ json, onSave, handleCancel }) => {

    return (
        <div className='layout'>
            <form onSubmit={(event) => onSave(event)} className='form-layout'>
                {json.map((e, index) => (
                    <div key={index} className={e.className ? e.className : "form-group"}>
                        {e.type == "radio" && (
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
                        }
                        {e.type === 'text' && <div className='layout-fields'>
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
                        {e.type == 'textArea' && <div className='layout-fields'>
                            <label className='layout-fields-label'>{e.label}</label>
                            <textarea
                                value={e.value}
                                className='layout-fields-input'
                                disabled={e.disabled}
                                onChange={e.onChange}
                                type={e.type}
                                required={e.required}
                                placeholder={e.placeholder}
                                style={e.style}
                            />
                        </div>}

                    </div>
                ))}
                <div className='layout-fields-btn'>
                    <B2BButton type='button' color={'red'} onClick={handleCancel} name="Cancel" />
                    <B2BButton type='submit' name={"Save"} />
                </div>
            </form>
        </div>
    )
}

export default B2BForm