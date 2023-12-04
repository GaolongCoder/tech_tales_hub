import ListItem from '@/components/ListItem';
import { prepareConnection } from '@/db';
import { Article } from '@/db/entity';
import { NextPage } from 'next';
import { IArticle } from './api';
import { Divider } from 'antd';
import { Fragment } from 'react';

interface IProps {
  articles: IArticle[];
}

const Home: NextPage<IProps> = ({ articles }) => {
  return (
    <div className="content-layout">
      {articles.map((article: IArticle) => (
        <Fragment key={article.id}>
          <ListItem article={article} />
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

export async function getServerSideProps() {
  const db = await prepareConnection();
  const articles =
    (await db?.getRepository(Article).find({
      relations: ['user'],
    })) || [];

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)),
    },
  };
}

export default Home;
