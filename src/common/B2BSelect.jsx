import { Select } from '@mantine/core'
import React from 'react'

const B2BSelect = ({ placeholder,name, value, data, required, onChange, style, styles, clearable, scroll, leftSection, leftSectionPointerEvents, error, disabled }) => {
    
    return (
        <Select
            className='input-textField'
            style={style}
            name={name}
            styles={{...styles}}
            placeholder={placeholder}
            value={value}
            data={data}
            required={required}
            onChange={onChange}
            clearable={clearable}
            withScrollArea={scroll}
            searchable
            disabled={disabled}
            leftSectionPointerEvents={leftSectionPointerEvents}
            leftSection= {leftSection}
            comboboxProps={{ shadow: 'md' }}
            radius="sm"
            size='md'
            error={error}
        />
    )
}

export default B2BSelect
