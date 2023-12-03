import { NextApiRequest, NextApiResponse } from 'next';
import { getIronSession } from 'iron-session';
import { Cookie } from 'next-cookie';
import { ironOption } from '@/config';

import { ISession } from '..';
import { clearCookie } from '@/utils';

async function logout(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = await getIronSession(req, res, ironOption);
  const cookies = Cookie.fromApiRoute(req, res);

  await session.destroy();
  clearCookie(cookies);

  res.status(200).json({
    code: 0,
    msg: 'logout success',
    data: null,
  });
}

export default logout;
