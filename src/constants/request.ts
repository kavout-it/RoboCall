// API 响应码
export const API_CODE = {
  SUCCESS: '200',
  FORBIDDEN: '403',
  INTERNAL_ERROR: '500',
  TOKEN_EMPTY: '1001',
  TOKEN_EXPIRED: '1004',
  TOKEN_DUPLICATE: '1006',
  VALIDATE_ERROR: '000',
};

// API 响应结构
export interface ResponseStructure {
  data?: any;
  errorCode: string;
  errorMessage?: string;
  success: boolean;
}

// 请求异常信息
export const responseError = {
  '404': '请求的数据不存在',
  '405': '提交内容可能对网站造成安全威胁',
  '408': '请求超时，请稍后重试',
};
