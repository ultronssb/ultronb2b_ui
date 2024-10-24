import { Select } from '@mantine/core'
import React from 'react'

const B2BSelect = ({ searchable, className, radius, defaultValue, placeholder, value, data, required, onChange, style, styles, clearable, scroll, leftSection, leftSectionPointerEvents, error, disabled, name }) => {
    
    return (
        <Select
            className={className ?? 'input-textField'}
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
            searchable={searchable}
            defaultValue={defaultValue}
            disabled={disabled}
            leftSectionPointerEvents={leftSectionPointerEvents}
            leftSection= {leftSection}
            comboboxProps={{ shadow: 'md' }}
            radius={radius || "sm"}
            size='md'
            error={error}
        />
    )
}

export default B2BSelect
