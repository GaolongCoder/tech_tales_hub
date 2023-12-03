import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/layout';
import { StoreProvider } from '@/store';

interface IProps extends AppProps {
  initialValue: Record<any, any>;
}

export default function App({ initialValue, Component, pageProps }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

App.getInitialProps = ({ ctx }: { ctx: any }) => {
  const { userId, nickname, avatar } = ctx.req?.cookies || {};
  return {
    initialValue: {
      user: {
        userInfo: {
          userId,
          nickname,
          avatar,
        },
      },
    },
  };
};
