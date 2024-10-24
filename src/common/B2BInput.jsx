import { TextInput } from '@mantine/core';
import React from 'react';

const B2BInput = ({ value, styles, edit, onChange, placeholder, variant, required, error, type, radius, disabled, rightSection }) => {
    return (
        <TextInput
            className='input-textField'
            styles={{ input: { fontSize: '14px', cursor: edit === true ? 'not-allowed' : 'text' }, ...styles }}
            placeholder={placeholder}
            value={value || ''}
            type={type}
            variant={variant}
            required={required}
            size='md'
            radius={radius || "sm"}
            disabled={disabled}
            onChange={onChange}
            error={error}
            rightSection={rightSection}
        />
    );
}

export default B2BInput;
