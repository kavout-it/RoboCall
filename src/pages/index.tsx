import { useEffect, useRef } from 'react';
import './index.less';

export default () => {
  const wrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,
      config: {
        navbar: {
          title: '智能助理',
        },
        robot: {
          avatar:
            'https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg',
        },
        messages: [
          {
            type: 'text',
            content: {
              text: '智能助理为您服务，请问有什么可以帮您？',
            },
          },
        ],
      },
      requests: {
        /* ... */
      },
      handlers: {
        /* ... */
      },
    });

    bot.run();
  }, []);

  // 注意 wrapper 的高度
  return <div style={{ height: '100%' }} ref={wrapper} />;
};
