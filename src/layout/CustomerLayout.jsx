import { faChevronRight, faHeadphones, faHeadset, faHouse, faPercent, faSearch, faShirt, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppShell, AppShellMain, AppShellNavbar, Burger, Card, Checkbox, Divider, Grid, Group, Image, Text, TextInput } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import blue from '../assets/blue.jpeg';
import fabric from '../assets/fabric.jpg';
import white from '../assets/white.jpeg';
import '../common/CustomerHeader.css';
import B2BButton from '../common/B2BButton';

function CustomerLayout() {
  const [opened, { toggle }] = useDisclosure();
  const isMobile = useMediaQuery('(max-width: 992px)');

  const products = [
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: fabric
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: white
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: blue
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: blue
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: white
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: fabric
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: blue
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: fabric
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: white
    },
    {
      id: 1,
      ql: 'QL-048196',
      title: 'PU coated (front) Solid Vegan leather',
      price: '$7.79',
      image: blue
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
    {
      id: 2,
      category: 'Casual Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    },
    {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    }, {
      id: 2,
      category: 'Casual Wear'
    },
  ];

  const group = [
    {
      id: 2,
      category: 'Garment Type'
    }, {
      id: 2,
      category: 'Popular Fabric Type'
    }, {
      id: 2,
      category: 'Popular Fabric Content'

    }];

  const [isOpen, setIsOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const handleToggle = () => {
    setVisible(false)
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  };


  return (
    <>
      <AppShell
        className='main-app-shell'
        header={{ height: 60 }}
        padding="md"
        layout='default'
        navbar={{ width: 350, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      >
        <AppShell.Header pl={10} pr={10} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Group >
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text styles={{ root: { background: 'linear-gradient(to right, #003366, #66B2B2, #FF6F61, #B3669E)', fontSize: '35px', fontWeight: '800', backgroundClip: 'text', color: 'transparent' } }} className='logo'>Ultron</Text>
            <FontAwesomeIcon className='home_icon' icon={faHouse} />
            <div className='header_name'>
              <B2BButton color={'#FF6F61'} radius={'20'} name={"Fabric Library"} />
            </div>
          </Group>
          <Group>
            <FontAwesomeIcon icon={faHeadset} />
            <Text size='md' className='help_center' style={{ color: '#59d496' }}>Help Center</Text>
            <div className='sign_in_group'>
              <B2BButton style={{ background: 'none', color: '#FF6F61' }} name={"Sign In"} radius={'20'} />
              <B2BButton style={{ background: 'none', color: '#FF6F61', border: '2px solid transparent', borderImage: 'linear-gradient(to right, #003366, #66B2B2, #FF6F61, #B3669E)', borderImageSlice: 1 }} name={"Sign Up"} radius={'20'} />
            </div>
          </Group>
        </AppShell.Header>
        <AppShellNavbar p={10} style={{ overflowY: 'auto' }}>
          <div style={{ marginTop: '30px' }}>
            <TextInput placeholder="Search for filters or Item number" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginTop: '25px', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FontAwesomeIcon icon={faPercent} style={{ color: '#b8324a', marginLeft: '3px' }} />
              <span style={{ color: '#b8324a', paddingLeft: '20px' }}>SALE</span>
            </div>
            <Checkbox size="xs" />
          </div>


          <div className='group_name'>
            <div>POPULAR CATEGORIES</div>
          </div>
          <Divider size={'xs'} />
          <div>
            {group.map((type, index) => (
              <div className='button_filter' onClick={handleToggle}>
                <div className='symbol'>
                  <FontAwesomeIcon style={{ paddingRight: '1rem' }} icon={faShirt}></FontAwesomeIcon>
                  <Text>{type.category}</Text>
                </div>
                <FontAwesomeIcon icon={faChevronRight}></FontAwesomeIcon>
              </div>
            ))}
          </div>
        </AppShellNavbar>
        {isOpen && (
          <div className='grand-scheme'>
            <FontAwesomeIcon icon={faXmark} onClick={handleToggle} className='closer'></FontAwesomeIcon>
            <div className='values-filtered'>
              <div className='head'>
                <div className='title'>Garment Type</div>
              </div>
            </div>

            <div className='filter-explorer'>
              <div className='left-panel'>
                <div>
                  <TextInput
                    placeholder="Start Typing..."
                    icon={<FontAwesomeIcon icon={faSearch} style={{ backgroundColor: 'red' }} />}
                  />
                </div>
                <div className='absoluter-inside-content'>
                  {data.map((item, index) => (
                    <Checkbox key={index} className='leaf' label={item.category} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        <AppShellMain style={{ height: 'calc(100vh - 5rem)', overflowY: 'auto', overflowX: 'hidden' }}>
          <Grid onClick={() => setVisible(false)}>
            {/* <Grid.Col span={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

            </Grid.Col> */}
            <Grid.Col onClick={() => setVisible(true)}>
              <div className='search-header'>
                <Text style={{ fontSize: isMobile ? "14px" : "16px" }}>25,000 Items</Text>
                <TextInput style={{ display: isMobile ? "none" : "block", width: '150px' }}
                  placeholder="Search"
                />
                <Text onClick={() => setIsOpen(true)} style={{ display: !isMobile ? "none" : "block", width: '150px' }}
                  placeholder="Search"
                >Search</Text>
              </div>
              <div className='grid-container' onClick={() => setVisible(true)}>
                {products.map((product, index) => (
                  <Card key={index} shadow="sm" padding={0} radius="md" withBorder >
                    <img
                      className='product-image'
                      src={product.image}
                      alt="Norway"
                    />
                    <div style={{ padding: '12px' }}>
                      <div className='colorchips borderable'>
                        <div className='colorchip' style={{ background: 'rgb(85,85,85)' }}></div>
                        <div className='colorchip' style={{ background: 'rgb(191,190,190)' }}></div>
                        <div className='colorchip' style={{ background: 'rgb(0,47,108)' }}></div>
                        <div className='colorchip' style={{ background: 'rgb(1,1,1)' }}></div>
                        <div className='colorchip' style={{ background: 'rgb(111,68,51)' }}></div>
                        <div className='colorchip' style={{ background: 'rgb(1,1,1)' }}></div>
                      </div>
                      <div>
                        <div style={{ color: '#788191', fontWeight: '500', fontSize: '12px' }}>{product.ql}</div>
                        <div style={{ fontWeight: '600', marginBottom: '8px', minHeight: '42px' }}>{product.title}</div>
                      </div>

                      <div className='quality-price'>
                        <b className='price-container'>{product.price}</b>
                      </div>

                      <div className='quality-info'>
                        <div className='contents'>
                          <div className='f-600 item'>
                            <div>N</div>
                            <div>100</div>
                          </div>

                        </div>
                      </div>

                      <div>

                      </div>
                    </div>
                    {/* <Text mt="md">{product.ql}</Text>
                      <Title order={4} mt="md">{product.title}</Title>
                      <Text mt="md" size="lg" fw={700}>{product.price}</Text> */}
                  </Card>
                ))}
              </div>
            </Grid.Col>
          </Grid>
        </AppShellMain>
        {/* <div className='go-to-top' >
            <FontAwesomeIcon onClick={() => scrollToTop} icon={faArrowUp}></FontAwesomeIcon>
          </div> */}
        {/* </div> */}
      </AppShell>
    </>
  );
}

export default CustomerLayout;
