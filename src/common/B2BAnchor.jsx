import { Anchor } from '@mantine/core';
import React from 'react'

const B2BAnchor = ({ href, content, title, style, styles }) => {
    return (
        <Anchor
            title={title}
            href={href}
            style={style}
            styles={{ ...styles }}
            underline="never"
        >
            {content}
        </Anchor>
    )
}

export default B2BAnchor;