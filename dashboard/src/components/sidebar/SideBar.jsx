import { useEffect, useState } from 'react';
import { Group, Anchor } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
import classes from './SideBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/auth';

const data = [{ link: '', label: 'User management', icon: IconUser }];

export function SideBar() {
  const [active, setActive] = useState('User management');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
  }, [isAuthenticated]);

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <div
      style={{
        position: 'fixed',
        height: '100vh',
        flex: '280px',
        display: isAuthenticated ? 'block' : 'none'
      }}>
      <nav className={classes.navbar}>
        <div>
          <Group className={classes.header} justify="space-between">
            <Anchor
              onClick={() => navigate('/dashboard')}
              underline="hover"
              style={{ color: 'white' }}>
              Home
            </Anchor>
          </Group>
          {links}
        </div>
      </nav>
    </div>
  );
}
