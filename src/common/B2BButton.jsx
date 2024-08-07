import { Button, } from '@mantine/core'
import React from 'react'
import PropTypes from 'prop-types';

const B2BButton = ({ style , variant, color, size, radius, onClick, disabled, name, leftSection, rightSection, loading, loaderProps = '', type=""}) => {
    return (
        <Button
            style={{ outline: 'none',...style }}
            loaderProps={loaderProps}
            loading={loading}
            variant={variant}
            color={color}
            size={size}
            type={type}
            radius={radius}
            onClick={onClick}
            disabled={disabled}
            leftSection={leftSection}
            rightSection={rightSection}
        >
            {name}
        </Button>
    )
}

export default B2BButton

B2BButton.propTypes = {
    style: PropTypes.object,
    variant: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.string,
    radius: PropTypes.string,
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    name: PropTypes.string,
    leftSection: PropTypes.node,
    rightSection: PropTypes.node,
}
