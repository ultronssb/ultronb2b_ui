import { css } from '@emotion/react';
import { Anchor, AppShell, Avatar, Grid, Group, Stack, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import logo from "../assets/logo.webp";
import { Body } from '../components/home/Body';
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
  const [headerData, setHeaderData] = useState([])
  const [childTabs,setChildTabs] = useState([])

  useEffect (() => {
    if(parentId === null) {
      setHeaderData(getTabsData())
    } else {
        setChildTabs(getTabsData())
    }
  },[parentId])


  const handleLinkClick = (index, parentId) => {
    setActiveIndex(index);
    setParentId(parentId);
  };

  const getTabsData = () =>{
        return ModuleJson(parentId)    
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
        onClick={() => handleLinkClick(index, headernav.id)}
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
        <Body tabsJson={childTabs} />
      </AppShell.Main>
    </AppShell>
  );
}