import React, { useState } from 'react';
import './Header.css';
import { Avatar } from '@mantine/core';
import avatar from '../avatar.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faChartLine, faDoorClosed, faGear, faGlobe, faHandHoldingHeart, faMagnifyingGlass, faTruckRampBox } from '@fortawesome/free-solid-svg-icons';



const B2BHeader = () => {
    const [activeIndex, setActiveIndex] = useState(1);

    const handleClick = (index) => {
        setActiveIndex(index);
    };

    console.log(activeIndex);

    return (
        <>
            <nav>
                <a  className={activeIndex === 1 ? 'active' : ''} onClick={() => handleClick(1)} href="#">
                    <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '30px' }} />
                    <span>Dashboard</span>
                </a>
                <a  className={activeIndex === 2 ? 'active' : ''} onClick={() => handleClick(2)} href="#">
                    <FontAwesomeIcon icon={faDoorClosed} style={{ fontSize: '30px' }} />
                    <span>Product</span>
                </a>
                <a  className={activeIndex === 3 ? 'active' : ''} onClick={() => handleClick(3)} href="#">
                    <FontAwesomeIcon icon={faCartShopping} style={{ fontSize: '30px' }} />
                    <span>Sales</span>
                </a>
                <a  className={activeIndex === 4 ? 'active' : ''} onClick={() => handleClick(4)} href="#">
                    <FontAwesomeIcon icon={faTruckRampBox} style={{ fontSize: '30px' }} />
                    <span>Inventory</span>
                </a>
                <a  className={activeIndex === 5 ? 'active' : ''} onClick={() => handleClick(5)} href="#">
                    <FontAwesomeIcon icon={faHandHoldingHeart} style={{ fontSize: '30px' }} />
                    <span>CRM</span>
                </a>
                <a  className={activeIndex === 6 ? 'active' : ''} onClick={() => handleClick(6)} href="#">
                    <FontAwesomeIcon icon={faGlobe} style={{ fontSize: '30px' }} />
                    <span>eCommerce</span>
                </a>
                <a  className={activeIndex === 7 ? 'active' : ''} onClick={() => handleClick(7)} href="#">
                    <FontAwesomeIcon icon={faGear} style={{ fontSize: '30px' }} />
                    <span>Settings</span>
                </a>
                <div className="animation start-home"></div>
                <div className="search_icon">
                    <input type="search" placeholder="Search" />
                    <label className="icon">
                        <FontAwesomeIcon icon={faMagnifyingGlass}/>
                    </label>
                </div>
                <label className="person_name">Hi Sachin</label>
                <Avatar className='avatar' component="a" href="#" target="_blank" src={avatar} alt="it's me" />
            </nav>
        </>
    );
};

export default B2BHeader;
