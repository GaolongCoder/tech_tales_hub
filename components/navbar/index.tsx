import { NextPage } from 'next';
import styles from './index.module.scss';
import { navs } from './config';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { useState } from 'react';
import Login from 'components/login';

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);

  const handleGotoEditPage = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

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
        <Button type="primary" onClick={handleLogin}>
          login
        </Button>
      </section>
      <Login isShow={isShowLogin} onClose={handleClose} />
    </div>
  );
};

export default Navbar;
