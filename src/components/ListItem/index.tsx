import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { markdownToTxt } from 'markdown-to-txt';
import styles from './index.module.scss';
import { IArticle } from '@/pages/api';

interface IProps {
  article: IArticle;
}

const ListItem = (props: IProps) => {
  const { article } = props;
  const { user } = article;

  return (
    <Link href={`/article/${article.id}`} className={styles.container}>
      <div className={styles.article}>
        <div className={styles.userInfo}>
          <span className={styles.name}>{user?.nickname}</span>
          <span className={styles.date}>
            {formatDistanceToNow(new Date(article?.update_time))}
          </span>
        </div>
        <h4 className={styles.title}>{article?.title}</h4>
        <p className={styles.content}>{markdownToTxt(article?.content)}</p>
        <div className={styles.statistics}>
          <EyeOutlined />
          <span className={styles.item}>{article?.views}</span>
        </div>
      </div>
      <Avatar src={user?.avatar} size={48} />
    </Link>
  );
};

export default ListItem;
