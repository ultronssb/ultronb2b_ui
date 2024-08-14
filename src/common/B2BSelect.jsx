import { Select } from '@mantine/core';
import React from 'react';

const B2BSelect = ({ placeholder, data, onChange, className, value }) => {
    return (

        <Select
            placeholder={placeholder}
            data={data}
            onChange={onChange}
            value={value}
            searchable
            clearable
            comboboxProps={{ shadow: 'md' }}
        />


    )
}

export default B2BSelect
