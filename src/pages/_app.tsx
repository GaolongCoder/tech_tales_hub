import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import { StoreProvider } from '@/store';
import { AuthProvider } from '@/context';
import { NextComponentType, NextPageContext } from 'next';

interface IProps extends AppProps {
  Component: NextComponentType<NextPageContext, any, any> & {
    layout?: string;
  };
  initialValue: any;
}

export default function App({ initialValue, Component, pageProps }: IProps) {
  const renderLayout = () => {
    if (Component.layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  return (
    <AuthProvider value={initialValue.user}>
      <StoreProvider initialValue={initialValue}>
        {renderLayout()}
      </StoreProvider>
    </AuthProvider>
  );
}

App.getInitialProps = ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx.req?.cookies || {};
  return {
    initialValue: {
      user: {
        userId,
        nickname,
        avatar,
      },
    },
  };
};
