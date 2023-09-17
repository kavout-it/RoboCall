/* eslint-disable */
import { useEffect, useRef } from 'react';
import './index.less';

export default () => {
  const wrapper = useRef(null);

  useEffect(() => {
    const bot = new window.ChatSDK({
      root: wrapper.current,

      /**
       * 界面相关配置
       */
      config: {
        // 当前语言
        lang: 'zh-CN', // zh-CN | en-US

        // 头像白名单
        avatarWhiteList: [],

        // 顶部导航
        navbar: {
          title: '智能助理',
        },

        // 机器人信息
        robot: {
          avatar:
            'https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg',
        },

        // 初始化消息
        messages: [
          {
            type: 'text',
            content: {
              text: '智能助理为您服务，请问有什么可以帮您？',
            },
          },
        ],

        // 加号扩展
        toolbar: [],

        // 快捷短语
        quickReplies: [],

        // 输入方式
        inputType: '',

        // 输入框占位符
        placeholder: '',

        // 侧边栏
        sidebar: '',
      },

      /**
       * jsbridge 配置
       */
      bridge: {
        // 打开新窗口
        openWindow(url) {},

        // 关闭页面
        popWindow() {},

        // 选择图片
        takePhoto(opts) {},

        // 预览大图
        previewImage(data) {},
      },

      /**
       * 请求配置
       */
      requests: {
        baseUrl: '',
        // 发送接口
        send(msg) {},

        // 联想输入接口
        autoComplete(data) {},
      },

      // 其它处理函数配置
      handlers: {
        // 消息数据后处理函数
        parseResponse(res, requestType) {},

        // 点击加号扩展中的按钮
        onToolbarClick(item, ctx) {},
      },

      // 组件映射配置
      components: {},

      // 语音输入配置
      makeRecorder({ ctx }) {},

      // 长连接配置
      makeSocket({ ctx }) {},
    });

    bot.run();
  }, []);

  // 注意 wrapper 的高度
  return <div style={{ height: '100%' }} ref={wrapper} />;
};
