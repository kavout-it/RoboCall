import { Icon } from 'umi';
import styles from './index.less';

export default function HomePage() {
  return (
    <div className={styles.chatui}>
      <Icon icon="local:robo" width="64" height="64" />
    </div>
  );
}
