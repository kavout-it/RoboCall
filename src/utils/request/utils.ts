/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 * 请求相关工具函数
 */
import { ResultData } from '@/typings/request';
import { ApiCode } from './config';
import showMessage from './message';

/**
 * 是否 token 相关的错误
 */
export const isTokenError = (apiCode: ApiCode) =>
  [
    ApiCode.TOKEN_EMPTY,
    ApiCode.TOKEN_EXPIRED,
    ApiCode.TOKEN_DUPLICATE,
  ].includes(apiCode);

/**
 * 重新登录
 */
export const reLogin = () => {
  const LOGIN_PATH = '/login';
  localStorage.removeItem('requestToken');
  sessionStorage.setItem('redirectUrl', window.location.href);
  window.location.replace(LOGIN_PATH);
};

/**
 * @description 通用文件下载函数
 * @param {Blob} data 文件数据
 * @param {String} filename（不含扩展名）
 * @param {String} fileExtension 文件扩展名（默认为 xlsx）
 * @return void
 */
export const downloadFile = async (
  data: Blob,
  filename: string,
  fileExtension: 'xlsx' | 'pdf' = 'xlsx',
) => {
  // console.log('文件下载 data.type: ', data.type);
  // 错误处理 - 避免将 json 当做 Blob 下载（下载后无法打开）
  if (data.type.includes('json')) {
    const rawText = await data.text();
    const rawData = JSON.parse(rawText);
    console.warn('文件下载错误：', rawData);
    return;
  }
  // 构建参数 - blobURL、fullName
  const blobType = {
    xlsx: 'application/vnd.ms-excel',
    pdf: 'application/pdf',
  }[fileExtension];
  const blob =
    data instanceof Blob ? data : new Blob([data], { type: blobType });
  const blobURL = window.URL.createObjectURL(blob);
  const fullName = `${filename}.${fileExtension}`;
  // 模拟点击
  const aEl = document.createElement('a');
  aEl.href = blobURL;
  aEl.setAttribute('download', fullName);
  aEl.style.display = 'none';
  document.body.appendChild(aEl);
  aEl.click();
  // 释放资源
  document.body.removeChild(aEl);
  window.URL.revokeObjectURL(blobURL);
};

export const uploadFile = async (
  url: string,
  file: File,
  onprogress?: (percent: number) => void,
) => {
  const fd = new FormData();
  fd.append('file', file);
  return new Promise<ResultData>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    if (xhr.upload) {
      xhr.upload.onprogress = (ev) => {
        if (ev.lengthComputable) {
          const percent = (ev.loaded / ev.total) * 100;
          onprogress && onprogress(Math.min(99, percent));
        }
      };
    }
    xhr.withCredentials = true;
    xhr.setRequestHeader(
      'Authorization',
      `Bearer ${localStorage.getItem('requestToken')}`,
    );
    xhr.withCredentials = true;
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const response = JSON.parse(xhr.response || '{}') as ResultData;
        const success =
          xhr.status >= 200 && xhr.status < 300 && response.success;
        if (success) {
          onprogress && onprogress(100);
          resolve(response);
        } else {
          reject(response);
        }
      }
    };
    xhr.send(fd);
  });
};

/**
 * api 提示信息
 */
export const handleMessage = (response: any) => {
  const { data, config } = response;
  // Token错误
  if (isTokenError(data.errorCode)) {
    return reLogin();
  }

  // 内部错误
  if (data.errorCode === ApiCode.ERROR) {
    location.replace('/403');
    // return Promise.reject(data);
    return data;
  }

  // 禁止访问
  if (data.errorCode === ApiCode.FORBIDDEN) {
    location.replace('/403');
    // return Promise.reject(data);
    return data;
  }

  // 其他错误
  if (!config.headers.noMessage) {
    const { errorMessage } = data;
    // const firstMessage = errorMessage.includes(';')
    //   ? errorMessage.split(';')[0]
    //   : errorMessage;
    // showMessage(firstMessage || '请求失败，请稍后重试!');
    showMessage(errorMessage || '请求失败，请稍后重试!');
  }
};

/**
 * 文件下载提示信息
 */
export const downloadMessage = (data: any) => {
  if (isTokenError(data.errorCode)) {
    return reLogin();
  }
  showMessage(data.errorMessage || '请求失败，请稍后重试!');
  return Promise.resolve(data);
};

/**
 * 生成时间戳随机 ID
 */
export const genStampID = () => {
  const randomString = (len = 32) => {
    const chars = 'abcdefhijkmnprstwxyz';
    const maxPos = chars.length;
    let rnds = '';
    for (let i = 0; i < len; i++) {
      rnds += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return rnds;
  };
  const timestamp = new Date().getTime();
  const rndStr = randomString(5);
  return timestamp + '_' + rndStr;
};
