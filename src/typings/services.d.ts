// * 请求响应参数(不含data)
export interface Result {
  code?: string;
  errorCode: string;
  errorMessage: string;
  success: boolean;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
  data?: T;
}

// * 分页响应参数
export interface ResPage<T> {
  list: T[];
  pages: number;
  pageNum: number;
  pageSize: number;
  total: number;
}

// * 分页请求参数
export interface ReqPage {
  pageNum: number;
  pageSize: number;
}
