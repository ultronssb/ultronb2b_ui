import { TextInput } from '@mantine/core';
import React from 'react';

const B2BInput = ({ labelName, placeholder, variant, size, radius, disabled, style, ...props }) => {
    return (
        <TextInput
            placeholder={placeholder}
            variant={variant}
            size={size}
            radius={radius}
            disabled={disabled}
            style={style}
        />
    )
}

export default B2BInput
