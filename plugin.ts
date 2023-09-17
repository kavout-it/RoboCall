import type { IApi } from 'umi';

export default (api: IApi) => {
  // 向 HTML 里添加 meta 标签
  api.addHTMLMetas(() => {
    return [
      {
        name: 'renderer',
        content: 'webkit',
      },
      {
        name: 'force-rendering',
        content: 'webkit',
      },
      {
        'http-equiv': 'X-UA-Compatible',
        content: 'IE=edge,chrome=1',
      },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1.0, user-scalable=0, minimum-scale=1.0, maximum-scale=1.0, viewport-fit=cover',
      },
    ];
  });
  // 向 HTML 里添加 link 标签
  api.addHTMLLinks(() => {
    return [
      {
        rel: 'stylesheet',
        type: 'text/css',
        href: '//g.alicdn.com/chatui/sdk-v2/0.3.2/sdk.css',
      },
    ];
  });
  // 向 HTML 的 <head> 元素里添加 script 标签
  api.addHTMLScripts(() => {
    return [
      {
        src: '//g.alicdn.com/chatui/sdk-v2/0.3.2/sdk.js',
      },
      {
        src: '//g.alicdn.com/chatui/extensions/0.1.3/isv-parser.js',
      },
      {
        src: '//g.alicdn.com/chatui/icons/2.0.2/index.js',
        async: true,
      },
    ];
  });
};
