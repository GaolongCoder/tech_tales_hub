import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { ironOption } from '@/config';
import { ISession } from '..';
import { prepareConnection } from '@/db';
import { User, Article, Comment } from '@/db/entity';
import { EXCEPTION_COMMENT } from '@/pages/api/config/codes';

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { articleId = 0, content = '' } = req.body;
  const db = await prepareConnection();
  const commentRepo = db?.getRepository(Comment);

  const comment = new Comment();
  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();

  const user = await db?.getRepository(User).findOne({
    where: {
      id: session?.userId,
    },
  });

  const article = await db?.getRepository(Article).findOne({
    where: {
      id: articleId,
    },
  });

  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }

  const resComment = await commentRepo?.save(comment);

  if (resComment) {
    res.status(200).json({
      code: 0,
      msg: 'comment success',
      data: resComment,
    });
  } else {
    res.status(200).json({
      ...EXCEPTION_COMMENT.PUBLISH_FAILED,
    });
  }
}

export default publish;
