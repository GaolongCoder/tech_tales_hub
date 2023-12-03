import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { Cookie } from 'next-cookie';
import { ironOption } from '@/config';
import { ISession } from '..';

import { prepareConnection } from '@/db';
import { User, UserAuth } from 'src/db/entity';
import { setCookie } from '@/utils';

const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const session: ISession = await getIronSession(req, res, ironOption);
  const cookies = Cookie.fromApiRoute(req, res);
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  const db = await prepareConnection();
  const userAuthRepo = db?.getRepository(UserAuth);

  if (String(session.verifyCode) === String(verify)) {
    const userAuth = await userAuthRepo?.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: ['user'],
    });

    if (userAuth) {
      const user = userAuth.user;
      const { id, nickname, avatar } = user;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookies, { userId: id, nickname, avatar });
      res.status(200).json({ code: 0, data: user, msg: 'login success' });
    } else {
      const user = new User();
      user.nickname = `user_${Math.floor(Math.random() * 10000)}`;
      user.avatar = '/images/default_avatar.png';
      user.job = 'empty';
      user.introduce = 'empty';

      const userAuth = new UserAuth();
      userAuth.identifier = phone;
      userAuth.identity_type = identity_type;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      const resUserAuth = await userAuthRepo?.save(userAuth);
      if (!resUserAuth) {
        res.status(200).json({ code: -1, data: null, msg: 'unknown error' });
        return;
      }
      const {
        user: { id, nickname, avatar },
      } = resUserAuth;

      session.userId = id;
      session.nickname = nickname;
      session.avatar = avatar;
      await session.save();
      setCookie(cookies, { userId: id, nickname, avatar });
      res
        .status(200)
        .json({ code: 0, data: resUserAuth?.user, msg: 'login success' });
    }
  } else {
    res
      .status(200)
      .json({ code: -1, data: null, msg: 'verify code incorrect' });
  }
};

export default login;
