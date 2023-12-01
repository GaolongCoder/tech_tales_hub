import { NextPage } from 'next';
import Navbar from 'components/navbar';
import Footer from 'components/footer';
import { ReactNode } from 'react';

interface PropsType {
  children: ReactNode;
}

const Layout: NextPage<PropsType> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
