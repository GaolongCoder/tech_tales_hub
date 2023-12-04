import { NextPage } from 'next';
import styles from './index.module.scss';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Login from '@/components/login';
import { LoginOutlined, HomeOutlined } from '@ant-design/icons';
import request from '@/services/fetch';
import { useAuth } from '@/context';
import { Button, Avatar, Dropdown, message, MenuProps } from 'antd';

const Navbar: NextPage = () => {
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const { user, setUser } = useAuth();

  const { userId, avatar } = user;

  const handleGotoEditPage = () => {
    if (userId) {
      push('/editor/new');
    } else {
      message.warning('please login first');
    }
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleGotoPersonalPage = () => {
    push(`/user/${userId}`);
  };

  const handleLogout = () => {
    request.post('/api/user/logout').then((res: any) => {
      if (res?.code === 0) {
        setUser({
          userId: '',
          avatar: '',
          nickname: '',
        });
      }
    });
  };

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === '1') {
      handleGotoPersonalPage();
    }
    if (key === '2') {
      handleLogout();
    }
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: 'user info',
      icon: <HomeOutlined />,
    },
    {
      key: '2',
      label: 'logout',
      icon: <LoginOutlined />,
    },
  ];

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG-C</section>
      <section className={styles.linkArea}>
        {navs?.map((nav) => (
          <Link
            key={nav.label}
            href={nav.value}
            className={pathname === nav?.value ? styles.active : ''}
          >
            {nav.label}
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditPage}>create article</Button>
        {userId ? (
          <>
            <Dropdown menu={{ items, onClick }} placement="bottomLeft">
              <Avatar src={avatar} size={32} />
            </Dropdown>
          </>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            login
          </Button>
        )}
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
