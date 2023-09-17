/* eslint-disable */
import { useEffect, useRef } from 'react';
import './index.less';

export default () => {
  const wrapper = useRef(null);
  const canRecord = false; // 判断是否支持语音输入

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
        // 默认情况下卡片消息都没有头像，如果需要的话可以通过 config.avatarWhiteList 配置
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

        // 输入方式
        inputType: canRecord ? 'voice' : 'text', // text | voice

        // 输入框占位符
        placeholder: '输入任何您想执行的操作',

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
              code: 'recommend',
              data: {
                list: [
                  {
                    title: '如何办理居住证？',
                  },
                  {
                    title: '社保报销成功后在哪里看？',
                  },
                  {
                    title: '去百度一下（链接形式）',
                    url: 'https://www.baidu.com/',
                  },
                ],
              },
            },
          },
        ],

        // 输入扩展
        toolbar: [
          {
            type: 'speech',
            icon: 'mic',
            title: '语音输入',
          },
          {
            type: 'image', // 类型
            icon: 'image', // 图标（svg），与下面的 img 二选一即可
            img: '', // 图片（img），推荐用 56x56 的图，会覆盖 icon
            title: '相册', // 名称
          },
        ],

        // 快捷短语
        quickReplies: [
          {
            name: '发送文本',
            isHighlight: true,
          },
          {
            name: '可见文本',
            type: 'text',
            text: '实际发送的文本',
            isNew: true,
          },
          {
            name: '点击跳转',
            type: 'url',
            url: 'https://www.taobao.com/',
          },
          {
            name: '唤起卡片',
            type: 'card',
            card: { code: 'knowledge', data: {} },
          },
          {
            name: '执行指令',
            type: 'cmd',
            cmd: { code: 'agent_join' },
          },
        ],

        // 右侧边栏
        sidebar: [
          {
            title: '公告',
            code: 'richtext',
            data: {
              text: '<p>这里是富文本内容，支持<a href="https://chatui.io/sdk/getting-started">链接</a>，可展示图片<img src="//pic.mksucai.com/00/27/46/fa08295d19b90523.webp" width="16" height="16" alt="通知图标" title="通知图标"></p>',
            },
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
        send(msg) {
          // 文本消息
          if (msg.type === 'text') {
            return {
              url: '/xiaomi/ask.do',
              data: {
                q: data.text,
              },
            };
          }
          // ... 其它消息类型的处理
        },

        // 联想输入
        autoComplete(data) {
          return {
            url: '/xiaomi/associate.do',
            data: {
              q: data.text,
            },
          };
        },
      },

      // 其它处理函数配置
      handlers: {
        // 消息数据后处理函数
        parseResponse(res, requestType) {
          // 根据 requestType 处理数据
          if (requestType === 'send' && res.Messages) {
            // 用 isv 消息解析器处理数据
            return isvParser({ data: res });
          }

          // 联想输入的数据处理
          if (requestType === 'autoComplete') {
            console.log(res);
            return {
              list: [{ title: '' }],
              keyword: '',
            };
          }

          // 如果点的是“语音”
          if (item.type === 'speech') {
            // 这里改成 App 提供的 bridge 方法
            nativeInvoke('speech', (text) => {
              if (text) {
                // 通过 setText 更新输入框内容
                bot.appRef.current.setText(text);
              }
            });
          }

          // 如果点的是“相册”
          if (item.type === 'image') {
            ctx.util.chooseImage({
              // multiple: true, // 是否可多选
              success(e) {
                if (e.files) {
                  // 如果有 h5 上传的图
                  const file = e.files[0];
                  // 先展示图片
                  ctx.appendMessage({
                    type: 'image',
                    content: {
                      picUrl: URL.createObjectURL(file),
                    },
                    position: 'right',
                  });

                  // 发起请求，具体自行实现，这里以 OCR 识别后返回文本为例
                  requestOcr({ file }).then((res) => {
                    ctx.postMessage({
                      type: 'text',
                      content: {
                        text: res.text,
                      },
                      quiet: true, // 不展示
                    });
                  });
                } else if (e.images) {
                  // 如果有 app 上传的图
                  // ..与上面类似
                }
              },
            });
          }

          // 不需要处理的数据直接返回
          return res;
        },

        // 点击扩展中的按钮
        onToolbarClick: function (item, ctx) {
          // item 即为上面 toolbar 中被点击的那一项，可通过 item.type 区分
          // ctx 为上下文，可用 ctx.appendMessage 渲染消息等
        },
      },

      // 组件映射配置
      components: {
        // 这样注册 会有一个隐私的转化 adaptable-action-card 会到全局上 取 AlimeComponentAdaptableActionCard 对象
        'adaptable-action-card':
          '//g.alicdn.com/alime-components/adaptable-action-card/0.1.7/index.js',
        // 推荐主动指定 name 属性
        'adaptable-action-card': {
          name: 'AlimeComponentAdaptableActionCard',
          url: '//g.alicdn.com/alime-components/adaptable-action-card/0.1.7/index.js',
        },
      },

      // 语音输入配置
      makeRecorder({ ctx }) {
        return {
          // 是否支持语音输入
          canRecord: true,
          onStart() {
            console.log('开始录音');
          },
          onEnd() {
            console.log('停止录音');
            // 识别到文本后要 ctx.postMessage
          },
          onCancel() {
            console.log('取消录音');
          },
        };
      },

      // 长连接配置
      makeSocket({ ctx }) {},
    });

    bot.run();
  }, []);

  // 注意 wrapper 的高度
  return <div style={{ height: '100%' }} ref={wrapper} />;
};
