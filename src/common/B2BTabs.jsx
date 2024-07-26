import { Tabs } from '@mantine/core';
import React from 'react';
import { ModuleJson } from '../ModuleData/ModuleJson';

const B2BTabs = (props) => {
    const data = ModuleJson()

    const tabs = [
        { label: 'First Tab', value: 'first' },
        { label: 'Second Tab', value: 'second' },
        { label: 'Third Tab', value: 'third' },
        { label: 'Fourth Tab', value: 'fourth' }
    ];

    return (
        <Tabs defaultValue="first">
            <Tabs.List grow={props.grow} justify={props.justify}>
                {data.map((tab) => (
                    <Tabs.Tab key={tab.id} value={tab.id} style={{ outline: 'none' }}>
                        {tab.name}
                    </Tabs.Tab>
                ))}
            </Tabs.List>
        </Tabs>
    );
}

export default B2BTabs;
