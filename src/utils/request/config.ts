// 请求超时时间
export const TIMEOUT = 8000; // 8s
export const TOKEN_NAME = 'requestToken';

// api 状态码
export enum ApiCode {
  SUCCESS = '200',
  FORBIDDEN = '403',
  ERROR = '500',
  TOKEN_EMPTY = '1001',
  TOKEN_EXPIRED = '1004',
  TOKEN_DUPLICATE = '1006',
}

// 请求状态码
export const httpStatus = {
  400: '请求失败，请稍后重试',
  401: '登录失效，请重新登录',
  403: '当前账号无访问权限',
  404: '您访问的资源不存在',
  405: '提交内容可能对网站造成安全威胁',
  408: '请求超时，请稍后重试',
  500: '服务异常，请稍后重试',
  502: '网络错误，请稍后重试',
  503: '服务不可用，请稍后重试',
  504: '网络超时，请稍后重试',
};
