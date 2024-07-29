import { css } from '@emotion/react';
import { Anchor, AppShell, Avatar, Container, Grid, Group, Stack, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import logo from "../assets/logo.webp";
import { ModuleJson } from '../moduleData/ModuleJson';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import B2BTabs from '../common/B2BTabs';


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
  const [headerData, setHeaderData] = useState([])
  const [childTabs,setChildTabs] = useState([])
  const [childParentId, setChildParentId] = useState()
  const [buttonGroup, setButtonGroup] = useState([])

  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect (() => {
    if(parentId === null) {
      setHeaderData(getTabsData())
    } else {
        const childJson = getTabsData() || [];
        setChildTabs(childJson)
        const childId = childJson.length > 1 ? childJson[0].id : null
        setButtonGroup(childId ? ModuleJson(childId): null)
        setChildParentId(childId)
        
    }
  },[parentId])


  useEffect(() => {
     if(state != null) {
        setParentId(state.parentId)
        setHeaderData(ModuleJson(null))
        const childparentId = state.childParentId;
        if(childparentId) {
            setChildParentId(childparentId)
            setButtonGroup(state.buttonGroup)
        }
     }
  },[state])



  const handleLinkClick = (index, tab) => {
    setActiveIndex(index);
    setParentId(tab.id);
    navigate(tab.path, {state: {parentId: tab.id, from: "header", activeIndex: index}})
  };

  const getTabsData = () =>{
        return ModuleJson(parentId)    
  }

  const handleChildButtonClick = (tabs) => {
    console.log(tabs)
    navigate(tabs.path, { state : {parentId: parentId, from:'button',childParentId: childParentId , buttonGroup: buttonGroup }})
  }

  const getButtonGroups = (tabs) => {
    setChildParentId(tabs.id)
    setButtonGroup(ModuleJson(tabs.id))
  }
  

  const renderLinks = () => {
    return _.map(headerData, (headernav, index) => (
      <UnstyledButton
        key={headernav.id}
        sx={(theme) => ({
          color: index === activeIndex ? theme.colors.blue[6] : theme.colors.gray[6],
          '&:hover': {
            backgroundColor: theme.colors.gray[1],
          },
        })}
        onClick={() => handleLinkClick(index, headernav)}
      >
        <Stack justify='center' align='center' gap={0}>
          {headernav.icon}
          {headernav.name}
        </Stack>
      </UnstyledButton>
    ));
  }

  return (
    <AppShell
      header={{ height: 80 }}
      padding="md"
    >
      <AppShell.Header>
        <Grid align='center' style={{ '--grid-margin': 'unset' }} display={"flex"} mih={"100%"}>
          <Grid.Col span={2}>
            <Anchor
              variant="gradient"
              aria-label="Gradient Logo"
              gradient={{
                from: '#003366', to: '#B3669E', deg:
                  45
              }}
              style={{ marginLeft: "1rem"}}
              radius="xl"
              sx={{ cursor: 'pointer' }}
              fw={500}
              fz="lg"
              href="https://skillsort.in"
              className={GradientText} // Apply the styled component

            >
              SWATCHLINE
            </Anchor>
          </Grid.Col>
          <Grid.Col span={6} visibleFrom="md">
            <Group gap={5} justify='space-between'>
            {renderLinks()}
            </Group>
          </Grid.Col>
          <Grid.Col span={3} offset={1} style={{justifyContent: 'flex-end'}} display={"flex"} ml={10}>
            <Group gap={5}>
              <span className="material-symbols-outlined">
                notifications
              </span>
              <Avatar src={logo} alt={"logo"} radius="xl" size={20} />
            </Group>
           
          </Grid.Col>
        </Grid>
      </AppShell.Header>
      <AppShell.Main>
        {_.size(childTabs) > 1 && <B2BTabs tabsdData={childTabs} justify={"flex-start"} onClick={getButtonGroups}/>}
        {_.size(buttonGroup) > 1 && <B2BTabs tabsdData={buttonGroup} justify={"flex-start"} onClick={handleChildButtonClick} />}
        <Container>
            <Outlet/>
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}