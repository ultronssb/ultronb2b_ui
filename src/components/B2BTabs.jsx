import { Tabs } from '@mantine/core';
import React from 'react';

const B2BTabs = (props) => {
    console.log(props);

    const tabs = [
        { label: 'First Tab', value: 'first' },
        { label: 'Second Tab', value: 'second' },
        { label: 'Third Tab', value: 'third' },
        { label: 'Fourth Tab', value: 'fourth' }
    ];

    return (
        <Tabs defaultValue="first">
            <Tabs.List grow={props.grow} justify={props.justify}>
                {tabs.map((tab) => (
                    <Tabs.Tab key={tab.value} value={tab.value} style={{ outline: 'none' }}>
                        {tab.label}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
        </Tabs>
    );
}

export default B2BTabs;
