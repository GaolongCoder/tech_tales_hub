import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { ironOption } from '@/config';
import { ISession } from '..';
import { prepareConnection } from '@/db';
import { Tag, User } from '@/db/entity';
import { EXCEPTION_USER, EXCEPTION_TAG } from '@/pages/api/config/codes';

async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { userId = 0 } = session;
  const { tagId, type } = req?.body || {};
  const db = await prepareConnection();
  const tagRepo = db?.getRepository(Tag);
  const userRepo = db?.getRepository(User);

  const user = await userRepo?.findOne({
    where: {
      id: userId,
    },
  });

  const tag = await tagRepo?.findOne({
    relations: ['users'],
    where: {
      id: tagId,
    },
  });

  if (!user) {
    res?.status(200).json({
      ...EXCEPTION_USER?.NOT_LOGIN,
    });
    return;
  }

  if (tag?.users) {
    if (type === 'follow') {
      tag.users = tag?.users?.concat([user]);
      tag.follow_count = tag?.follow_count + 1;
    } else if (type === 'unfollow') {
      tag.users = tag?.users?.filter((user) => user.id !== userId);
      tag.follow_count = tag?.follow_count - 1;
    }
  }

  if (tag) {
    const resTag = await tagRepo?.save(tag);
    res?.status(200)?.json({
      code: 0,
      msg: '',
      data: resTag,
    });
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_TAG?.FOLLOW_FAILED,
    });
  }
}

export default follow;
