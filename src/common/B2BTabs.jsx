import { Tabs } from "@mantine/core";
import React, { useEffect } from "react";
import PropTypes from 'prop-types';

const B2BTabs = ({ tabsData = [], grow, justify, onClick, variant, margin, activeId }) => {

  return (
    <Tabs key={activeId} defaultValue={activeId} onChange={(value) => onClick(tabsData.find(tab => tab.id === value))} variant={variant} style={{ marginBottom: margin }}>
      <Tabs.List grow={grow} justify={justify}>
        {tabsData.map((tab) => (
          <Tabs.Tab key={tab.id} value={tab.id} style={{ outline: "none" }}>
            {tab.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>
    </Tabs>
  );
};

export default B2BTabs;

B2BTabs.propTypes = {
  tabsData: PropTypes.array,
  grow: PropTypes.bool,
  justify: PropTypes.string,
  onClick: PropTypes.func,
  variant: PropTypes.string,
  margin: PropTypes.string,
  activeId: PropTypes.string
};
