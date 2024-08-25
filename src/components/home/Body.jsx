import { Grid } from '@mantine/core'
import _ from 'lodash'
import React, { useEffect, useState } from 'react'
import B2BTabs from '../../common/B2BTabs'
import { ModuleJson } from '../../moduleData/ModuleJson'

export function Body({ tabsJson, path }) {
    const [childJson, setChildJson] = useState([])
    useEffect(() => {
        if (_.size(tabsJson) > 0) {
            const json = ModuleJson(tabsJson[0]?.id)
            if (json) {
                setChildJson(json)
            }
        } else {
            setChildJson([])
        }
    }, [tabsJson])

    const hanleOnclickTabs = (parentId) => {
        setChildJson(ModuleJson(parentId))
    }


    return (
        <div>
            <Grid>
                <Grid.Col span={12}>
                    <B2BTabs tabsdData={tabsJson} onClick={(parentId) => hanleOnclickTabs(parentId)} />
                </Grid.Col>
                <Grid.Col>
                    <B2BTabs tabsdData={childJson} />
                </Grid.Col>
            </Grid>

        </div>
    )
}