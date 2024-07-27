import { Button, } from '@mantine/core'
import React from 'react'
import PropTypes from 'prop-types';

const B2BButton = ({ style , variant, color, size, radius, onClick, disabled, name }) => {
    return (
        <Button
            style={{ outline: 'none',...style }}
            variant={variant}
            color={color}
            size={size}
            radius={radius}
            onClick={onClick}
            disabled={disabled}
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
}
