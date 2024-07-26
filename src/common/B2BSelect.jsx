import { Select } from '@mantine/core'
import React from 'react'
import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
    div: {
        display: 'flex',
        marginBottom: '1rem',
        backgroundColor: 'red',
    },
    label: {
        width: '200px',
        display: 'flex',
        alignItems: 'center',
        fontSize: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji',
    }
})

const B2BSelect = (props) => {
    return (
        <div {...stylex.props(styles.div)}>
            <label {...stylex.props(styles.label)}>{props.labelName}</label>
            <Select
                placeholder={props.placeholder}
                data={props.data}
                onChange={props.onChange}
                searchable
                clearable
                style={{ width: '206px' }}
                comboboxProps={{ shadow: 'md' }}
                searchValue={props.searchValue}
                onSearchChange={props.setSearchValue}
            />
        </div>

    )
}

export default B2BSelect
