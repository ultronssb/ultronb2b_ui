import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppShell, Burger, Group, Grid, TextInput, Card, Text, Title, Image, Checkbox } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { faHeadphones, faBars, faHouse, faPercent, faShirt, faChevronRight, faXmark, faSearch, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.webp';
import fabric from '../assets/fabric.jpg';
import white from '../assets/white.jpeg';
import blue from '../assets/blue.jpeg';
import { useEffect, useState } from 'react';
import B2BButton from '../common/B2BButton';
import '../common/CustomerHeader.css';

function CustomerLayout() {

  const products = [
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:fabric
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:white
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:blue
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:blue
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:white
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:fabric
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:blue
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:fabric
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:white
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image:blue
    },
  ];

  const data = [
    {
      id: 1,
      category: 'Active Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    },
    {
      id: 1,
      category: 'Active Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    },
    {
      id: 1,
      category: 'Active Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    },
    {
      id: 1,
      category: 'Active Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    },
    {
      id: 1,
      category: 'Active Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    },
    {
      id: 1,
      category: 'Active Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const handleToggle = () => {
    setVisible(false)
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };



  return (
    <>
      <AppShell
        header={{ height: 60 }}
        padding="md"
      >
        <AppShell.Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Group>
            <li style={{ listStyle: 'none' }}><span className='logo'>swatchline</span><FontAwesomeIcon className='home_icon' icon={faHouse} /></li>
            <span style={{ borderLeft: '1.5px solid #000000', width: '10px', height: '25px' }}></span>
            <li style={{ listStyle: 'none' }}><button className='libraryBtn'>Fabric Library</button></li>
          </Group>
          <Group spacing="md" mr={15}>
            <li style={{ listStyle: 'none' }}><FontAwesomeIcon icon={faHeadphones} className='help_icon' /><span className='help'>Help Center</span></li>
            <span style={{ borderLeft: '1.5px solid #000000', width: '10px', height: '25px' }}></span>
            <li className='btns' style={{ listStyle: 'none' }}>
              <button className='signinBtn'>Sign In</button>
              <span style={{ borderLeft: '1.5px solid #000000', width: '10px', height: '25px', marginTop: '9px' }}></span>
              <button className='signupBtn'>Sign Up</button>
            </li>
            <li style={{ listStyle: 'none' }}><span className='menu'>Menu</span><FontAwesomeIcon className='menu_icon' icon={faBars} /></li>
          </Group>
        </AppShell.Header>
        <div style={{ height: '100vh', overflow: 'hidden' }}>
          <Grid style={{ marginTop: '60px' }} gutter="md">
            <Grid.Col span={3}  style={{ height: '100vh', overflow: 'auto' }}>
              <div style={{ minHeight: '100vh', marginLeft: '15px' }}>
                <div style={{ marginTop: '30px' }}>
                  <TextInput
                    placeholder="Search for filters or Item number"
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '25px', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faPercent} style={{ color: '#b8324a', marginLeft: '3px' }} />
                    <span style={{ color: '#b8324a', marginLeft: '20px' }}>SALE</span>
                  </div>
                  <Checkbox size="xs" />
                </div>
                <div className='group_name'>
                  <div>POPULAR CATEGORIES</div>
                </div>
                <div className='button_filter' onClick={handleToggle}>
                  <div className='flex-row items-center'>
                    <div className='symbol'>
                      <FontAwesomeIcon icon={faShirt}></FontAwesomeIcon>
                    </div>
                    <div>Garment Type</div>
                  </div>
                  <div className='flex-row items-center g-8' >
                    <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
                  </div>
                </div>
                {isOpen && (
                  <div className='filter-panel grand-scheme' style={{display: visible ? "none" : "block",overflowY: 'auto'}}>
                    <div className='values-filtered'>
                      <FontAwesomeIcon icon={faXmark} onClick={()=>setVisible(true)} className='closer'></FontAwesomeIcon>
                      <div className='head'>
                        <div className='title'>Garment Type</div>
                      </div>
                    </div>

                    <div className='filter-explorer filter-component'>
                      <div className='left-panel filter-panel'>
                        <div>
                          <TextInput
                            placeholder="Start Typing..."
                            icon={<FontAwesomeIcon icon={faSearch} style={{ backgroundColor: 'red' }} />}
                          />
                        </div>
                        <div style={{ height:'25rem', overflowY:'auto'}}>
                          {data.map(item => (
                            <div className='leaf' key={item.id}>
                              <div className='name-count'>
                                <div>
                                  <Checkbox size="xs" />
                                </div>
                                <div style={{ marginLeft: '1rem' }}>{item.category}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Grid.Col>
            <div>
            </div>

            <Grid.Col onClick={()=>setVisible(true)} span={9} style={{ height: '100vh', overflow: 'auto' }}>
              <TextInput style={{ width: '150px', marginTop: '10px', float: 'right' }}
                placeholder="Search"
              />
              <div style={{ minHeight: '100vh', display: 'flex', flexWrap: 'wrap', marginTop: '50px' }}>
                {products.map((product) => (
                  <Grid.Col span={3} >
                    <Card shadow="sm" padding="xs" radius="md" withBorder >
                      <Card.Section>
                        <Image
                          src={product.image}
                          height={160}
                          alt="Norway"
                        />
                      </Card.Section>
                      <Text mt="md">{product.ql}</Text>
                      <Title order={4} mt="md">{product.title}</Title>
                      <Text mt="md" size="lg" fw={700}>{product.price}</Text>
                    </Card>

                  </Grid.Col>
                ))}
              </div>
            </Grid.Col>
          </Grid>
          <div className='go-to-top' onClick={scrollToTop}>
              <FontAwesomeIcon icon={faArrowUp}></FontAwesomeIcon>

            </div>
        </div>
      </AppShell>
    </>
  );
}

export default CustomerLayout;
