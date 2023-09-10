import { ReqConfig, ResultData } from '@/typings/request';
import type {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  AxiosResponse,
} from 'axios';
import axios from 'axios';
import { ApiCode, TIMEOUT, TOKEN_NAME, httpStatus } from './config';
import { hideLoading, showLoading } from './loading';
import showMessage from './message';
import pending from './pending';
import { handleMessage } from './utils';

const axiosConfig: ReqConfig = {
  baseURL: '/', // 可根据 process.env 区分环境
  timeout: TIMEOUT,
  withCredentials: true,
  headers: {} as AxiosHeaders,
};

/**
 * request 使用示例
 */
// import request from '@/utils/request';

// 常规请求
// request.get(`/list/${id}`);

// 文件下载
// request.post('/download', data, { responseType: 'blob'})

// 文件上传
// request.post('/upload', formData)

// 设置请求头
// request.get('/logout`, { noLoading: true, noMessage: true });

class Request {
  instance: AxiosInstance;

  constructor(config: ReqConfig) {
    /**
     * 创建 axios 实例
     */
    this.instance = axios.create(config);

    /**
     * Request 拦截器
     */
    this.instance.interceptors.request.use(
      (config: ReqConfig) => {
        // Ensure headers is an object
        config.headers = config.headers || {};

        // Add pending
        const signalConfig = pending.add(config) || {};
        Object.assign(config, signalConfig);

        // Show loading
        if (!config?.noLoading) {
          showLoading();
        }

        // Add token
        const token = localStorage.getItem(TOKEN_NAME);
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
      },

      (error: AxiosError) => {
        return Promise.reject(error);
      },
    );
    /**
     * Response 拦截器
     */
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        const { data, config } = response;

        // 移除 pending
        pending.remove(config);

        // 结束 loading
        hideLoading();

        // 文件下载响应
        if (data instanceof Blob) {
          return data;
        }

        // 常规 JSON 响应
        if (data.success && data.errorCode !== ApiCode.SUCCESS) {
          // 显示提示信息
          if (!(config as ReqConfig)?.noMessage) {
            handleMessage(response);
          }
          return Promise.resolve(data);
        }
        return data;
      },

      async (error: AxiosError) => {
        // 移除 pending
        pending.remove(config);

        // 结束 loading
        hideLoading();

        // 超时处理 - 超时响应没有 error.response
        if (error.message.includes('timeout')) {
          showMessage('请求超时，请稍后重试');
        }

        // 处理响应错误
        if (error.response) {
          const errorStatus = error.response.status as keyof typeof httpStatus;
          const errorMessage =
            httpStatus[errorStatus] || '请求失败，请稍后重试';
          showMessage(errorMessage);
        }

        // 服务器无响应，跳转到指定页面
        if (!window.navigator.onLine) {
          location.replace('/500');
        }

        // 请求被取消
        if (axios.isCancel(error)) {
          return Promise.resolve({});
        }

        // 抛出请求异常
        return Promise.reject(error);
      },
    );
  }

  request(config: ReqConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  get<T>(url: string, config?: ReqConfig): Promise<ResultData<T>> {
    return this.instance.get(url, config);
  }

  post<T>(url: string, data?: any, config?: ReqConfig): Promise<ResultData<T>> {
    return this.instance.post(url, data, config);
  }

  put<T>(url: string, data?: any, config?: ReqConfig): Promise<ResultData<T>> {
    return this.instance.put(url, data, config);
  }

  delete<T>(url: string, config?: ReqConfig): Promise<ResultData<T>> {
    return this.instance.delete(url, config);
  }
}

const request = new Request(axiosConfig);

export default request;
