import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Form, Input, Button, message } from 'antd';
import request from '@/services/fetch';
import styles from './index.module.scss';

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 4 },
};

const UserProfile = () => {
  const [form] = Form.useForm();

  useEffect(() => {
    request.get('/api/user/detail').then((res: any) => {
      if (res?.code === 0) {
        form.setFieldsValue(res?.data?.userInfo);
      }
    });
  }, [form]);

  const handleSubmit = (values: any) => {
    request.post('/api/user/update', { ...values }).then((res: any) => {
      if (res?.code === 0) {
        message.success('edit success');
      } else {
        message.error(res?.msg || 'edit fail');
      }
    });
  };

  return (
    <div className="content-layout">
      <div className={styles.userProfile}>
        <h2>userinfo</h2>
        <div>
          <Form
            {...layout}
            form={form}
            className={styles.form}
            onFinish={handleSubmit}
          >
            <Form.Item label="username" name="nickname">
              <Input placeholder="please input your username" />
            </Form.Item>
            <Form.Item label="position" name="job">
              <Input placeholder="please input your job position" />
            </Form.Item>
            <Form.Item label="introduction" name="introduce">
              <Input placeholder="please input your introduction" />
            </Form.Item>
            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit">
                save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default observer(UserProfile);
