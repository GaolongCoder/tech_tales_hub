import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { Button, Avatar, Divider } from 'antd';
import {
  CodeOutlined,
  FireOutlined,
  FundViewOutlined,
} from '@ant-design/icons';
import ListItem from '@/components/ListItem';
import { prepareConnection } from '@/db';
import { User, Article } from '@/db/entity';
import styles from './index.module.scss';

export async function getStaticPaths() {
  // user/[id]
  const db = await prepareConnection();
  const users = await db?.getRepository(User).find();
  const userIds = users?.map((user) => ({ params: { id: String(user?.id) } }));

  // [{params: 1}, {params: 2}, {params: 3}]
  return {
    paths: userIds,
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }: { params: any }) {
  const userId = params?.id;
  const db = await prepareConnection();
  const user = await db?.getRepository(User).findOne({
    where: {
      id: Number(userId),
    },
  });
  const articles = await db?.getRepository(Article).find({
    where: {
      user: {
        id: Number(userId),
      },
    },
    relations: ['user', 'tags'],
  });

  return {
    props: {
      userInfo: JSON.parse(JSON.stringify(user)),
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}
const UserDetail = (props: any) => {
  const { userInfo = {}, articles = [] } = props;
  const viewsCount = articles?.reduce(
    (prev: any, next: any) => prev + next?.views,
    0
  );

  return (
    <div className={styles.userDetail}>
      <div className={styles.left}>
        <div className={styles.userInfo}>
          <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
          <div>
            <div className={styles.nickname}>{userInfo?.nickname}</div>
            <div className={styles.desc}>
              <CodeOutlined /> {userInfo?.job}
            </div>
            <div className={styles.desc}>
              <FireOutlined /> {userInfo?.introduce}
            </div>
          </div>
          <Link href="/user/profile">
            <Button>edit userinfo</Button>
          </Link>
        </div>
        <Divider />
        <div className={styles.article}>
          {articles?.map((article: any) => (
            <div key={article?.id}>
              <ListItem article={article} />
              <Divider />
            </div>
          ))}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.achievement}>
          <div className={styles.header}>achievement</div>
          <div className={styles.number}>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>created {articles?.length} articles</span>
            </div>
            <div className={styles.wrapper}>
              <FundViewOutlined />
              <span>read {viewsCount} times</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(UserDetail);
