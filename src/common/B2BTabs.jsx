import { Tabs } from "@mantine/core";
import React from "react";
import PropTypes from 'prop-types';

const B2BTabs = ({tabsdData = [], grow, justify}) => {

  return (
    <Tabs defaultValue="first">
      <Tabs.List grow={grow} justify={justify}>
        {tabsdData.map((tab) => (
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
  tabsdData: PropTypes.array,
  grow: PropTypes.bool,
  justify: PropTypes.string
}