import React, { useState } from 'react';
import { ModuleJson } from '../ModuleData/ModuleJson';
import SubModule from './SubModule';
import _, { isEmpty } from 'lodash';

const MainModule = () => {

    const [activeMenu, setActiveMenu] = useState(null);
    const [subMenu, setSubMenu] = useState([]);
    const [menuData, setMenuData] = useState(ModuleJson())

    const handleMenuClick = (menu) => {
        setSubMenu(menu?.children)
        setActiveMenu(menu.id);
    };

    return (
        <div>
            <div className="navbar">
                {menuData.map((menu, index) => (
                    <button key={index} onClick={() => handleMenuClick(menu)}>
                        {menu.name}
                    </button>
                ))}
            </div>
            {activeMenu && (
                <SubModule subMenus={subMenu} />
            )}
        </div>
    );
};

export default MainModule;
