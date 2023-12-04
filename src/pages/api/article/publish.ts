import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { ironOption } from '@/config';
import { ISession } from '..';

import { prepareConnection } from '@/db';
import { User, Article, Tag } from 'src/db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';

const publish = async (req: NextApiRequest, res: NextApiResponse) => {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { title = '', content = '', tagIds } = req.body;
  const db = await prepareConnection();
  const userRepo = db?.getRepository(User);
  const articleRepo = db?.getRepository(Article);
  const TagRepo = db?.getRepository(Tag);

  const user = await userRepo?.findOne({
    where: {
      id: session.userId,
    },
  });

  const tags = await TagRepo?.find({
    where: tagIds?.map((tagId: number) => ({ id: tagId })),
  });

  const article = new Article();
  article.title = title;
  article.content = content;
  article.create_time = new Date();
  article.update_time = new Date();
  article.is_delete = 0;
  article.views = 0;

  if (user) {
    article.user = user;
  }

  if (tags) {
    const newTags = tags?.map((tag) => {
      tag.article_count = tag?.article_count + 1;
      return tag;
    });
    article.tags = newTags;
  }

  const resArticle = await articleRepo?.save(article);

  if (resArticle) {
    res.status(200).json({ code: 0, data: resArticle, msg: 'publish success' });
  } else {
    res.status(200).json(EXCEPTION_ARTICLE.PUBLISH_FAILED);
  }
};

export default publish;
