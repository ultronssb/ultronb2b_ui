import { TextInput } from '@mantine/core';
import React from 'react';

const B2BInput = ({ value, styles, onChange, placeholder, variant, required, error, type, radius, disabled }) => {
    return (
        <TextInput
            className='input-textField'
            styles={{input: {fontSize: '14px'}, ...styles}}
            placeholder={placeholder}
            value={value}
            type={type}
            variant={variant}
            required={required}
            size='md'
            radius="sm"
            disabled={disabled}
            onChange={onChange}
            error={error}
        />
    );
}

export default B2BInput;
