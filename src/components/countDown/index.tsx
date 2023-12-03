import { useEffect, useState } from 'react';
import { NextPage } from 'next';
import styles from './index.module.scss';

interface IProps {
  time: number;
  onEnd: () => void;
}

const CountDown: NextPage<IProps> = ({ time, onEnd }) => {
  const [count, setCount] = useState(time || 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((count) => {
        if (count === 1) {
          clearInterval(timer);
          onEnd && onEnd();
          return count;
        }
        return --count;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [time, onEnd]);

  return <div className={styles.countDown}>{count}</div>;
};

export default CountDown;
