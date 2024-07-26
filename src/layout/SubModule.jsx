import React from 'react';

const SubModule = ({subMenus}) => {

  return (
    <div className="sub-navbar">
      {subMenus.map((subMenu, index) => (
        <button key={index}>{subMenu.name}</button>
      ))}
    </div>
  );
};

export default SubModule;
