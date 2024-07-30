import { css } from '@emotion/react';
import { AppShell, Avatar, Button, Container, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import avatar from '../avatar.jpg';
import B2BTabs from '../common/B2BTabs';
import '../common/Header.css';
import { ModuleJson } from '../moduleData/ModuleJson';



const GradientText = css`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    marigin-left: 5rem;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, var(--color1), var(--color2), var(--color3), var(--color4));
    z-index: -1;
    pointer-events: none;
  }
`;
export default function Layout() {
  const [opened, { toggle }] = useDisclosure();
  const [parentId, setParentId] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [childTabs, setChildTabs] = useState([])
  const [childParentId, setChildParentId] = useState()
  const [buttonGroup, setButtonGroup] = useState([])

  const navigate = useNavigate();
  const { state } = useLocation();
  const headerData = useMemo(() => ModuleJson(null), [])

  useEffect(() => {
    if (parentId !== null) {
      const childJson = getTabsData() || [];
      setChildTabs(childJson)
      const childId = childJson.length > 1 ? childJson[0].id : null
      setButtonGroup(childId ? ModuleJson(childId) : null)
      setChildParentId(childId)
    }
  }, [parentId])

  useEffect(() => {
    if (state != null) {
      setParentId(state.parentId)
      setActiveIndex(state.activeIndex)
      const childparentId = state.childParentId;
      if (childparentId) {
        setChildParentId(childparentId)
        setButtonGroup(state.buttonGroup)
      }
    }
  }, [state?.parentId, state?.childParentId])
  
  console.log(state?.activeIndex,"activeIndex",state?.childParentId,childParentId)

  const handleLinkClick = (index, tab) => {
    navigate(tab.path, { state: { parentId: tab.id, from: "header", activeIndex: index } })
  };

  const handleChildButtonClick = (tabs) => {
    navigate(tabs.path, { state: { parentId: parentId, from: 'button', childParentId: childParentId, buttonGroup: buttonGroup, activeIndex: state?.activeIndex } })

  }

  const getButtonGroups = (tabs) => {
    navigate(tabs.path,{ state: { parentId: parentId, from: 'button', childParentId: tabs.id, buttonGroup: buttonGroup, activeIndex: state?.activeIndex } })
  }

  const getTabsData = () => {
    return ModuleJson(parentId)
  }


  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header style={{ borderBottom: 'none' }}>
        <nav>
          <h1>Swatchline</h1>
          {headerData.map((headernav, index) => (
            <div key={headernav.id} className="header" onClick={() => handleLinkClick(index, headernav)} >
              <span>{headernav.icon}</span>
              <span>{headernav.name}</span>
              <span className={`active ${index === activeIndex ? 'visible' : ''}`}></span>
            </div>
          ))}
          <label className="person_name">Hi Sachin</label>
          <Avatar className="avatar" component="a" href="#" target="_blank" src={avatar} alt="Sachin's Avatar" />
        </nav>
      </AppShell.Header>
      <AppShell.Main>
        {_.size(childTabs) > 1 && <B2BTabs tabsData={childTabs} justify={"flex-start"} onClick={getButtonGroups} activeId={childParentId} variant='default' margin='10px' />}
        {
          _.size(buttonGroup) > 1 && (
            <Group>
              {buttonGroup.map((button) => (
                <Button
                  key={button.id}
                  variant={button.path === window.location.pathname ? 'filled' : 'default'}
                  onClick={() => handleChildButtonClick(button)}
                >
                  {button.name}
                </Button>
              ))}
            </Group>
          )
        }
        {/* <B2BTabs tabsData={buttonGroup} justify={"flex-start"} onClick={handleChildButtonClick} /> */}
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
      <AppShell.Footer h={5}></AppShell.Footer>
    </AppShell>
  );
}