import { Button, } from '@mantine/core'
import React from 'react'

const B2BButton = (props) => {
    return (
        <Button
            style={{ outline: 'none' }}
            variant={props.variant}
            color={props.color}
            size={props.size}
            radius={props.radius}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.name}
        </Button>
    )
}

export default B2BButton
