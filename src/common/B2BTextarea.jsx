import { Textarea } from '@mantine/core'
import React from 'react'

const B2BTextarea = ({ placeholder }) => {
    return (
        <Textarea
            className="input-textField"
            placeholder={placeholder}
            radius="sm"
            autosize
            minRows={4}
            maxRows={4}
        />
    )
}

export default B2BTextarea
