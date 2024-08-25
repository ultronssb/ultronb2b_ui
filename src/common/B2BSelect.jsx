import { Select } from '@mantine/core'
import React from 'react'

const B2BSelect = ({ placeholder, value, data, required, onChange, style, styles, clearable, scroll }) => {
    
    return (
        <Select
            className='input-textField'
            style={style}
            styles={{...styles}}
            placeholder={placeholder}
            value={value}
            data={data}
            required={required}
            onChange={onChange}
            clearable={clearable}
            withScrollArea={scroll}
            searchable
            comboboxProps={{ shadow: 'md' }}
            radius="sm"
            size='md'
        />
    )
}

export default B2BSelect
