import { Menu } from '@mantine/core'
import _ from 'lodash'
import React from 'react'

const routeJson = {
    "Create Product": { "path": "/product/product/create", "parentId": "2", "childParentId": "9" },
    "View Products": { "path": "/product/product/articles", "parentId": "2", "childParentId": "9" },
    "View Customers": { "path": "/crm/customer", "parentId": "5", "childParentId": "61" },
    "View Variants": { "path": "/product/variants", "parentId": "2", "childParentId": "8" },
    "Categories": { "path": "/product/product-hierarchy", "parentId": "2", "childParentId": "8" },
    "Users": { "path": "/settings/user-management", "parentId": "7", "childParentId": "84" },

}
const HeaderMenu = ({ onMenuClick }) => {
    return (
        <Menu trigger="click-hover" openDelay={100} closeDelay={400}>
            <Menu.Target>
                <button style={{ color: 'black', position: 'relative', top: '3rem', left: '1rem', width: '30px', height: '30px', borderRadius: '25px', backgroundColor: 'white', outline: 'none', border: 'none', cursor: 'pointer', boxShadow:'0px 0.5px 0px 1px #0780B2', fontSize:'16px' }}>+</button>
            </Menu.Target>
            <Menu.Dropdown>
                {Object.keys(routeJson).map(menu => <Menu.Item onClick={() => onMenuClick(routeJson[menu])}>
                    {menu}
                </Menu.Item>)}
                {/* <Menu.Item>
            Create product
        </Menu.Item> */}
            </Menu.Dropdown>
        </Menu>
    )
}

export default HeaderMenu