import { useState } from 'react';
import Link from 'next/link';
import { Avatar, Input, Button, message, Divider } from 'antd';
import MarkDown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { prepareConnection } from '@/db';
import { Article } from '@/db/entity';
import { IArticle } from '@/pages/api';
import styles from './index.module.scss';
import request from '@/services/fetch';
import { useAuth } from '@/context';

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }: any) {
  const articleId = params?.id;
  const db = await prepareConnection();
  const articleRepo = db?.getRepository(Article);
  const article = await articleRepo?.findOne({
    where: {
      id: articleId,
    },
    relations: ['user', 'comments', 'comments.user'],
  });

  if (article) {
    article.views = article?.views + 1;
    await articleRepo?.save(article);
  }

  return {
    props: {
      article: article ? JSON.parse(JSON.stringify(article)) : null,
    },
  };
}

const ArticleDetail = (props: IProps) => {
  const { article } = props;
  const { user } = useAuth();
  const {
    user: { nickname, avatar, id },
  } = article;
  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState(article?.comments || []);

  const handleComment = () => {
    request
      .post('/api/comment/publish', {
        articleId: article?.id,
        content: inputVal,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          message.success('comment success');
          const newComments = [
            {
              id: Math.random(),
              create_time: new Date(),
              update_time: new Date(),
              content: inputVal,
              user: {
                avatar: user?.avatar,
                nickname: user?.nickname,
              },
            },
          ].concat([...(comments as any)]);
          setComments(newComments);
          setInputVal('');
        } else {
          message.error('comment fail');
        }
      });
  };

  return (
    <div>
      <div className="content-layout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}
              </div>
              <div>read {article?.views}</div>
              {Number(user?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>edit</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
      <div className={styles.divider}></div>
      <div className="content-layout">
        <div className={styles.comment}>
          <h3>comment</h3>
          {user?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="please input comments"
                  rows={4}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  submit comments
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd hh:mm:ss'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
