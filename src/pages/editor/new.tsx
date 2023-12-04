import { NextPage } from 'next';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import dynamic from 'next/dynamic';
import { ChangeEvent, useEffect, useState } from 'react';
import styles from './index.module.scss';
import { Button, Input, Select, message } from 'antd';
import request from '@/services/fetch';
import { useRouter } from 'next/router';
import { useAuth } from '@/context';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const MdEditor: NextPage = () => {
  const { user } = useAuth();
  const { userId } = user;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagIds, setTagIds] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const { push } = useRouter();

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        setAllTags(res?.data?.allTags || []);
      }
    });
  }, []);

  const handlePublish = () => {
    if (!title) {
      message.warning('please input article title');
      return;
    }
    request
      .post('/api/article/publish', {
        title,
        content,
        tagIds,
      })
      .then((res: any) => {
        if (res?.code === 0) {
          userId ? push(`/user/${userId}`) : push('/');
          message.success('publish success');
        } else {
          message.error(res?.msg || 'publish fail');
        }
      });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event?.target?.value);
  };

  const handleContentChange = (content: any) => {
    setContent(content);
  };

  const handleSelectTag = (value: []) => {
    setTagIds(value);
  };
  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          mode="multiple"
          allowClear
          placeholder="请选择标签"
          onChange={handleSelectTag}
        >
          {allTags?.map((tag: any) => (
            <Select.Option key={tag?.id} value={tag?.id}>
              {tag?.title}
            </Select.Option>
          ))}
        </Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          submit
        </Button>
      </div>
      <MDEditor value={content} height={1080} onChange={handleContentChange} />
    </div>
  );
};

export default MdEditor;

(MdEditor as any).layout = null;
