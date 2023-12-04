import React, { useState, useEffect } from 'react';
import { Tabs, Button, message, TabsProps } from 'antd';
import * as ANTD_ICONS from '@ant-design/icons';
import request from '@/services/fetch';
import styles from './index.module.scss';
import { useAuth } from '@/context';

interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}

interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

const Tag = () => {
  const { user } = useAuth();
  const [followTags, setFollowTags] = useState<ITag[]>();
  const [allTags, setAllTags] = useState<ITag[]>();
  const [needRefresh, setNeedRefresh] = useState(false);
  const [tab, setTab] = useState('all');
  const { userId } = user;

  useEffect(() => {
    request('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        const { followTags = [], allTags = [] } = res?.data || {};
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    });
  }, [needRefresh]);

  const handleUnFollow = (tagId: number) => {
    request
      .post('/api/tag/follow', {
        type: 'unfollow',
        tagId,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('unsubscribe success');
          setNeedRefresh(!needRefresh);
        } else {
          message.error(res?.msg || 'unsubscribe fail');
        }
      });
  };

  const handleFollow = (tagId: number) => {
    request
      .post('/api/tag/follow', {
        type: 'follow',
        tagId,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('subscribe success');
          setNeedRefresh(!needRefresh);
        } else {
          message.error(res?.msg || 'subscribe fail');
        }
      });
  };

  const handleChangeTab = (key: string) => {
    setTab(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'follow',
      label: 'subscribed tags',
      children: (
        <div className={styles.tags}>
          {followTags?.map((tag) => (
            <div key={tag?.title} className={styles.tagWrapper}>
              <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
              <div className={styles.title}>{tag?.title}</div>
              <div>
                {tag?.follow_count} subscribe {tag?.article_count} article
              </div>
              {tag?.users?.find(
                (user) => Number(user?.id) === Number(userId)
              ) ? (
                <Button type="primary" onClick={() => handleUnFollow(tag?.id)}>
                  subscribed
                </Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>subscribe</Button>
              )}
            </div>
          ))}
        </div>
      ),
    },
    {
      key: 'all',
      label: 'all tags',
      children: (
        <div className={styles.tags}>
          {allTags?.map((tag) => (
            <div key={tag?.title} className={styles.tagWrapper}>
              <div>{(ANTD_ICONS as any)[tag?.icon]?.render()}</div>
              <div className={styles.title}>{tag?.title}</div>
              <div>
                {tag?.follow_count} subscribe {tag?.article_count} article
              </div>
              {tag?.users?.find(
                (user) => Number(user?.id) === Number(userId)
              ) ? (
                <Button type="primary" onClick={() => handleUnFollow(tag?.id)}>
                  subscribed
                </Button>
              ) : (
                <Button onClick={() => handleFollow(tag?.id)}>subscribe</Button>
              )}
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="content-layout">
      <Tabs activeKey={tab} items={items} onChange={handleChangeTab}></Tabs>
    </div>
  );
};

export default Tag;
