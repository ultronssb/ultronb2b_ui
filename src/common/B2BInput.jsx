import { TextInput } from '@mantine/core';
import React from 'react';

const B2BInput = ({ placeholder, variant, radius, disabled }) => {
    return (
        <TextInput
            className='input-textField'
            placeholder={placeholder}
            variant={variant}
            size='md'
            radius="sm"
            disabled={disabled}
        />
    );
}

export default B2BInput;
