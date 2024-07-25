import { TextInput } from '@mantine/core'
import React from 'react'
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
    div: {
        display: 'flex',
        marginBottom: '1rem',
        backgroundColor: 'red'
    },
    label: {
        width: '200px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px',
        fontFamily: 'Times New Roman", Times, serif',
    }
})
const B2BInput = (props) => {
    return (
        <div {...stylex.props(styles.div)}>
            <label {...stylex.props(styles.label)}>{props.labelName}</label>
            <TextInput
                placeholder={props.placeholder}
                variant={props.variant}
                size={props.size}
                radius={props.radius}
                disabled={props.disabled}
                style={props.style}
            />
        </div>
    )
}

export default B2BInput
