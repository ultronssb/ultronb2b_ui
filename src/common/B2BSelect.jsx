import { Select } from '@mantine/core'
import React from 'react'

const B2BSelect = (props) => {
    return (
        <Select
            className='input-textField'
            placeholder={props.placeholder}
            data={props.data}
            onChange={props.onChange}
            clearable
            comboboxProps={{ shadow: 'md' }}
            radius="sm"
        />

    )
}

export default B2BSelect
