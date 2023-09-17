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
        avatarWhiteList: ['knowledge', 'recommend'],

        // 顶部导航
        navbar: {
          // logo: 'https://gw.alicdn.com/tfs/TB1Wbldh7L0gK0jSZFxXXXWHVXa-168-33.svg',
          title: '智能助理',
        },

        // 机器人信息
        robot: {
          avatar:
            'https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg',
        },

        // 首屏消息
        messages: [
          {
            type: 'text',
            content: {
              text: '智能助理为您服务，请问有什么可以帮您？',
            },
          },
          {
            type: 'card',
            content: {
              code: 'switch-location',
            },
          },
        ],

        // 加号扩展
        toolbar: [],

        // 快捷短语
        quickReplies: [
          { name: '我要查社保' },
          { name: '办理居住证需要什么材料' },
          { name: '公共支付平台' },
          { name: '智能问诊' },
        ],

        // 输入方式
        inputType: '',

        // 输入框占位符
        placeholder: '输入任何您想执行的操作',

        // 右侧边栏
        sidebar: [
          {
            code: 'sidebar-suggestion',
            data: [
              {
                label: '疫情问题',
                list: [
                  '身边有刚从湖北来的人，如何报备',
                  '接触过武汉人，如何处理？',
                  '发烧或咳嗽怎么办？',
                  '去医院就医时注意事项',
                  '个人防护',
                  '传播途径',
                  '在家消毒',
                ],
              },
              {
                label: '法人问题',
                list: [
                  '企业设立',
                  '企业运行',
                  '企业变更',
                  '企业服务',
                  '企业注销',
                  '社会团体',
                  '民办非企业',
                ],
              },
            ],
          },
          {
            code: 'sidebar-tool',
            title: '常用工具',
            data: [
              {
                name: '咨询表单',
                icon: 'clipboard-list',
                url: 'http://www.zjzxts.gov.cn/wsdt.do?method=suggest&xjlb=0&ymfl=1&uflag=1',
              },
              {
                name: '投诉举报',
                icon: 'exclamation-shield',
                url: 'http://www.zjzxts.gov.cn/wsdt.do?method=suggest&xjlb=1',
              },
              {
                name: '办事进度',
                icon: 'history',
                url: 'http://www.zjzwfw.gov.cn/zjzw/search/progress/query.do?webId=1',
              },
            ],
          },
          {
            code: 'sidebar-phone',
            title: '全省统一政务服务热线',
            data: ['12345'],
          },
        ],
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
