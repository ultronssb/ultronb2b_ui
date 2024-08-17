import { Textarea } from '@mantine/core'
import React from 'react'

const B2BTextarea = ({ placeholder, value, onChange, required }) => {
    return (
        <Textarea
            className="input-textField"
            placeholder={placeholder}
            value={value}
            radius="sm"
            required={required}
            autosize
            minRows={2}
            onChange={onChange}
            maxRows={2}
        />
    )
}

export default B2BTextarea
