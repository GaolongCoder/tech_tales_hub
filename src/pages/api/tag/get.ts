import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { ironOption } from '@/config';
import { ISession } from '..';
import { prepareConnection } from '@/db';
import { Tag } from '@/db/entity';

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { userId = 0 } = session;
  const db = await prepareConnection();
  const tagRepo = db?.getRepository(Tag);

  const followTags = await tagRepo
    ?.createQueryBuilder('tag')
    .innerJoinAndSelect('tag.users', 'user', 'user.id = :id', {
      id: Number(userId),
    })
    .getMany();

  const allTags = await tagRepo?.find({
    relations: ['users'],
  });

  res?.status(200)?.json({
    code: 0,
    msg: '',
    data: {
      followTags,
      allTags,
    },
  });
}

export default get;
