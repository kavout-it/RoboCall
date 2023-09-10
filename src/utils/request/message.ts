type MessageType = 'error' | 'success' | 'info' | 'warning';

type MessageOptions = {
  message?: string;
  type?: MessageType;
  duration?: number;
  offset?: number;
};

const defalutOptions: MessageOptions = {
  type: 'error',
  duration: 2000,
  offset: 6,
};

/**
 * 单例模式的 message 提示
 */
let messageInstance: any = null;

const singletonMessage = (options: MessageOptions) => {
  if (messageInstance) {
    console.log('跳过本次提示');
    return;
  }
  messageInstance = console.log(options);
};

const showMessage = (message: MessageOptions | string) => {
  const options = typeof message === 'string' ? { message } : message;
  const latestOptions = Object.assign({}, defalutOptions, options);
  return singletonMessage(latestOptions);
};

export default showMessage;
