import { Burger, Container, Text, Menu, rem } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAuth } from '../../context/auth';
import classes from './HeaderMenu.module.css';
import '@mantine/core/styles.css';
import { IconLogout } from '@tabler/icons-react';
import { Avatar } from '@mantine/core';
import logo from '../../assets/logo.png';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <header
      className={classes.header}
      style={{ display: !isAuthenticated ? 'none' : 'block' }}
    >
      <Container fluid>
        <div className={classes.inner}>
          <img
            src={logo}
            width={35}
            height={35}
            onClick={() => navigate('/dashboard')}
          />
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Avatar style={{ cursor: 'pointer' }} color="indigo" />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={
                  <IconLogout style={{ width: rem(12), height: rem(12) }} />
                }
                onClick={() => {
                  logout();
                }}
              >
                <Text size="xs" c="#8b0000">
                  Logout
                </Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
          <Burger opened={opened} onClick={toggle} size="sm" hiddenFrom="sm" />
        </div>
      </Container>
    </header>
  );
};
