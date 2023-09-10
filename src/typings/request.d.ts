import type { InternalAxiosRequestConfig } from 'axios';

interface ReqConfig extends InternalAxiosRequestConfig {
  noLoading?: boolean;
  noMessage?: boolean;
  isQuery?: boolean;
}

// api 响应数据结构（不含 data）
export interface Response {
  errorCode: string;
  errorMessage: string;
  success: boolean;
}

// api 响应数据结构（含 data）
export interface ResultData<T = any> extends Response {
  data?: T;
}

// api 分页响应数据结构
export interface ResultPage<T> {
  list: T[];
  pages: number;
  pageNum: number;
  pageSize: number;
  total: number;
}
