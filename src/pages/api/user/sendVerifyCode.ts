import { NextApiRequest, NextApiResponse } from 'next';
import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import request from '@/services/fetch';
import { getIronSession } from 'iron-session';
import { ironOption } from '@/config';
import { ISession } from '..';

const sendVerifyCode = async (req: NextApiRequest, res: NextApiResponse) => {
  const session: ISession = await getIronSession(req, res, ironOption);
  const { to = '', templateId = '1' } = req.body;
  const appId = '2c94811c8b1e335b018c2cdc15a73ece';
  const accountSid = '2c94811c8b1e335b018c2cdc141a3ec7';
  const authToken = '13d584c086c04a97b0428d94e7ced6cd';
  const nowDate = format(new Date(), 'yyyyMMddHHmmss');
  const SigParameter = md5(`${accountSid}${authToken}${nowDate}`);
  const Authorization = encode(`${accountSid}:${nowDate}`);

  const verifyCode = Math.floor(Math.random() * 8999) + 1000;
  const expireMinute = '5';
  const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountSid}/SMS/TemplateSMS?sig=${SigParameter}`;

  const response = await request.post(
    url,
    {
      to,
      templateId,
      appId,
      datas: [verifyCode, expireMinute],
    },
    {
      headers: { Authorization },
    }
  );

  const {statusCode, statusMsg, templateSMS} = response as any;

  if (statusCode === "000000") {
    session.verifyCode = verifyCode;
    await session.save()
    res.status(200).json({
      code: 0,
      msg: statusMsg,
      data: {templateSMS}
    });
  } else {
    res.status(200).json({
      code: statusCode,
      msg: statusMsg,
    });
  }
};

export default sendVerifyCode;
