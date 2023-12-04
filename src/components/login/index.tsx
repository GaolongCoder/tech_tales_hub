import { NextPage } from 'next';
import styles from './index.module.scss';
import { ChangeEvent, useState } from 'react';
import CountDown from '@/components/countDown';
import request from '@/services/fetch';
import { message } from 'antd';
import { useAuth } from '@/context';

interface IProps {
  isShow: boolean;
  onClose: () => void;
}

const Login: NextPage<IProps> = ({ isShow, onClose }) => {
  const { setUser } = useAuth();
  const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });
  const handleClose = () => {
    onClose && onClose();
  };

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleGetVerifyCode = () => {
    if (!form.phone) {
      message.warning('please input your phone number');
      return;
    }

    request
      .post('/api/user/sendVerifyCode', {
        to: form?.phone,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          setIsShowVerifyCode(true);
        } else {
          message.error(res?.msg || 'unknown error');
        }
      });
  };

  const handleLogin = () => {
    request
      .post('/api/user/login', {
        ...form,
        identity_type: 'phone',
      })
      .then((res: any) => {
        if (res?.code === 0) {
          const user = res.data;
          setUser({
            userId: user.id,
            avatar: user.avatar,
            nickname: user.nickname,
          });
          onClose && onClose();
        } else {
          message.error(res?.msg || 'unknown error');
        }
      });
  };

  const handleOAuthGithub = () => {};

  const handleCountDownEnd = () => {
    setIsShowVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>use phone login</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>
        <input
          type="text"
          name="phone"
          placeholder="please input phone number"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            type="text"
            name="verify"
            placeholder="please input verify code"
            value={form.verify}
            onChange={handleFormChange}
          />
          <span className={styles.verifyCode} onClick={handleGetVerifyCode}>
            {isShowVerifyCode ? (
              <CountDown time={10} onEnd={handleCountDownEnd} />
            ) : (
              'verify code'
            )}
          </span>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          github
        </div>
        <div className={styles.loginPrivacy}>
          by signing up, you agree{' '}
          <a href="https://moco.imooc.com/privacy.html" target="_blank">
            privacy
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default Login;
