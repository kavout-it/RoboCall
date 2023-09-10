import { ReqConfig } from '@/typings/request';
import qs from 'qs';

// 存储请求标识+取消函数
let pendingMap = new Map();

// 参数序列化
export const getPendingKey = (config: ReqConfig) => {
  const { method, url, params, data, isQuery } = config;
  const key = isQuery
    ? [method, url].join('&')
    : [method, url, qs.stringify(params), qs.stringify(data)].join('&');
  return key;
};

class Pending {
  // 添加请求
  add(config: ReqConfig) {
    const key = getPendingKey(config);
    if (!pendingMap.has(key)) {
      const abortController = new AbortController();
      pendingMap.set(key, abortController);
      return {
        signal: abortController.signal,
      };
    }
    return {};
  }

  // 删除请求
  remove(config: ReqConfig) {
    const key = getPendingKey(config);
    if (pendingMap.has(key)) {
      const abortController = pendingMap.get(key);
      abortController.abort();
      pendingMap.delete(key);
    }
  }

  // 清空所有请求
  clear() {
    for (const abortController of pendingMap.values()) {
      abortController.abort();
    }
    pendingMap.clear();
  }
}

const pending = new Pending();

export default pending;
