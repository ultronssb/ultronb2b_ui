import { AppShell, Avatar, Button, Container, Group } from '@mantine/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import avatar from '../avatar.jpg';
import B2BTabs from '../common/B2BTabs';
import '../common/Header.css';
import { ModuleJson } from '../moduleData/ModuleJson';
import logo from '../assets/logo.webp';
import { LogOut } from '../utils/Utilities';

export default function Layout() {
  const [stateData, setStateData] = useState({
    parentId: null,
    activeIndex: 0,
    childTabs: [],
    childParentId: null,
    buttonGroup: []
  });

  const navigate = useNavigate();
  const { state } = useLocation();
  const headerData = useMemo(() => ModuleJson(null), []);

  useEffect(() => {
    if (state) {
      setStateData({
        parentId: state.parentId,
        activeIndex: state.activeIndex,
        childTabs: state.tabs,
        childParentId: state.childParentId,
        buttonGroup: state.childParentId ? ModuleJson(state.childParentId) : []
      });
    }
  }, [state]);

  // This Funtion is used to navigate page from header 
  const handleLinkClick = useCallback((index, tab) => {
    navigate(tab.path, { state: { parentId: tab.id, tabs: tab.children, childParentId: tab.defaultChildId, activeIndex: index } });
  }, [navigate]);

  // This Funtion is used to navigate page from Tab click
  const handleTabClick = useCallback((tabs) => {
    navigate(tabs.path, { state: { parentId: stateData.parentId, tabs: stateData.childTabs, buttonGroup: tabs.children, childParentId: tabs.id, activeIndex: state?.activeIndex } });
  }, [navigate, stateData]);

  // This Funtion is used to navigate page from Button click
  const handleButtonClick = useCallback((tabs) => {
    navigate(tabs.path, { state: { parentId: stateData.parentId, tabs: stateData.childTabs, buttonGroup: stateData.buttonGroup, childParentId: tabs.parent_id, activeIndex: state?.activeIndex } });
  }, [navigate, stateData]);

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header style={{ borderBottom: 'none'}}>
        <nav>
          <img src={logo} />
          {headerData.map((headernav, index) => (
            <div key={headernav.id} className="header" onClick={() => handleLinkClick(index, headernav)}>
              <span>{headernav.icon}</span>
              <span>{headernav.name}</span>
              <span className={`active ${index === stateData.activeIndex ? 'visible' : ''}`}></span>
            </div>
          ))}
          <label className="person_name">Hi Sachin</label>
          <Avatar className="avatar" onClick={() => LogOut()} src={avatar} alt="Sachin's Avatar" />
        </nav>
      </AppShell.Header>
      <AppShell.Main>
        {stateData.childTabs.length > 1 && <B2BTabs tabsData={stateData.childTabs} justify={"flex-start"} onClick={handleTabClick} activeId={stateData.childParentId} variant='default' margin='10px' />}
        {stateData.buttonGroup.length > 1 && (
          <Group>
            {stateData.buttonGroup.map((button) => (
              <Button
                key={button.id}
                variant={button.path === window.location.pathname ? 'filled' : 'default'}
                onClick={() => handleButtonClick(button)}
                radius={15}
              >
                {button.name}
              </Button>
            ))}
          </Group>
        )}
        <Container size="responsive">
          <Outlet />
        </Container>
      </AppShell.Main>
      <AppShell.Footer h={5}></AppShell.Footer>
    </AppShell>
  );
}
