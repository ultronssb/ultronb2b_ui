import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppShell, Avatar, Button, Container, Group, rem } from '@mantine/core';
import { IconLogout, IconUserCircle } from '@tabler/icons-react';
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import ultron_logo from "../assets/ultron-logo.png";
import avatar from '../avatar.jpg';
import B2BMenu from '../common/B2BMenu';
import B2BTabs from '../common/B2BTabs';
import '../css/Header.css';
import { ModuleJson } from '../moduleData/ModuleJson';
import { LogOut } from '../utils/Utilities';
import { B2B_API } from '../api/Interceptor';
import B2BButton from '../common/B2BButton';
import CustomPopup from '../utils/Custompopup';
import UseInactivityLogout from '../utils/UseInactivityLogout';

export const ScrollContext = createContext(null);
export const ActiveTabContext = createContext(null)
export default function Layout() {
  const [stateData, setStateData] = useState({
    parentId: null,
    activeIndex: 0,
    childTabs: [],
    childParentId: null,
    buttonGroup: []
  });
  const [userName, setUserName] = useState('');

  const [opened, setOpened] = useState(false);
  const openModal = () => setOpened(true);
  const closeModal = () => setOpened(false);
  const { isPopupVisible,  handleLogout } = UseInactivityLogout();
  const navigate = useNavigate();
  const { state } = useLocation();
  const appShellRef = useRef(null)
  const headerData = useMemo(() => ModuleJson(null), []);


  const menuItems = [
    {
      key: "User Settings",
      value: () => { },
      icon: <IconLogout style={{ width: rem(14), height: rem(14) }} />
    },
    {

      key: "Log Out",
      value: () => LogOut(),
      icon: <IconUserCircle style={{ width: rem(14), height: rem(14) }} />
    }
  ]

  const scrollToTop = () => {
    if (appShellRef.current) {
      appShellRef.current.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

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

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    let userId = JSON.parse(localStorage.getItem('user'))?.userId
    const response = await B2B_API.get(`user/${userId}`).json();
    const { firstName } = response.response
    setUserName(firstName)
  }


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
    if (tabs.modal === true) {
      openModal();
    }
  }, [navigate, stateData]);

  const checkCurrentPathMatch = (button) => {
    return button.path === window.location.pathname;
  }

  return (
    <ActiveTabContext.Provider value={{ stateData }}>
      <ScrollContext.Provider value={scrollToTop}>
        <AppShell header={{ height: 60 }} ref={appShellRef} padding="md" style={{height: '100vh' }}>
          <AppShell.Header style={{ borderBottom: 'none' }}>
            <nav className='nav-bar'>
              <div style={{ display: 'flex' }}>
                <img className='ultron_logo' src={ultron_logo} style={{ marginRight: '1rem' }} />
                {headerData.map((headernav, index) => (
                  <div key={headernav.id} className="nav-header" onClick={() => handleLinkClick(index, headernav)}>
                    <span>{headernav.icon}</span>
                    <span style={{ fontWeight: index === stateData.activeIndex ? 'bolder' : '500', letterSpacing: '0.6px', whiteSpace: 'nowrap' }}>{headernav.name}</span>
                    <span className={`active ${index === stateData.activeIndex ? 'visible' : ''}`}></span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                {/* <B2BMenu trigger="click" menuItems={floatButtonItems}> */}
                <button onClick={() => alert("Work in progress!!!")} style={{ color: 'white', position: 'absolute', top: '3rem', right: '10rem', width: '30px', height: '30px', borderRadius: '25px', backgroundColor: '#022d46', outline: 'none', border: 'none', cursor: 'pointer' }}>+</button>
                {/* </B2BMenu> */}
                <B2BMenu trigger="hover" menuItems={menuItems}>
                  <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '10rem', justifyContent: 'flex-end' }}>
                    <div style={{ paddingRight: '2rem' }}>
                      <label className="person_name">Hi, {userName}</label>
                    </div>
                    <Avatar styles={{ image: { padding: 0 } }} className="avatar" src={avatar} alt="Sachin's Avatar" />
                  </div>
                </B2BMenu>
              </div>
            </nav>
          </AppShell.Header>
          <AppShell.Main>
            {stateData.childTabs?.length > 1 && <B2BTabs tabsData={stateData.childTabs} justify={"flex-start"} onClick={handleTabClick} activeId={stateData.childParentId} variant='default' margin='10px' />}
            {stateData.buttonGroup.length > 1 && (
              <Group styles={{ root: { padding: '1rem' } }}>
                {stateData.buttonGroup.map((button) => (
                  <Button
                    className='button-group'
                    key={button.id}
                    // leftSection={!checkCurrentPathMatch(button) && <FontAwesomeIcon style={{ fontSize: '20px', color: "#1492cd" }} icon={faCirclePlus} />}
                    styles={{ root: { background: checkCurrentPathMatch(button) ? '#cfeffd' : 'linear-gradient(180deg, rgba(251, 251, 251, 1) 0%, rgba(231, 231, 231, 1) 100%)' }, label: { color: '#4e595e', fontWeight: checkCurrentPathMatch(button) ? "900" : "500" } }}
                    variant={checkCurrentPathMatch(button) ? 'filled' : 'default'}
                    onClick={() => handleButtonClick(button)}
                  >
                    + {button.name}
                  </Button>
                ))}
              </Group>
            )}
            <Container size="responsive" ref={appShellRef}>
              <Outlet />
            </Container>
          </AppShell.Main>
          <AppShell.Footer h={5}></AppShell.Footer>
        </AppShell>
         {isPopupVisible && (
        <CustomPopup onLogout={handleLogout} />
      )}
      </ScrollContext.Provider>
    </ActiveTabContext.Provider>
  );
}
