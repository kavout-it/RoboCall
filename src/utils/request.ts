/* eslint-disable @typescript-eslint/no-unused-expressions */
/**
 * 请求相关工具函数
 */

import { API_CODE, ResponseStructure } from '@/constants/request';

export const isTokenError = (errorCode: string) =>
  [
    API_CODE.TOKEN_EMPTY,
    API_CODE.TOKEN_EXPIRED,
    API_CODE.TOKEN_DUPLICATE,
  ].includes(errorCode);

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

export function isSafari() {
  const ua = navigator.userAgent;
  return ua.includes('Safari') && ua.indexOf('Chrome') === -1;
}

/**
 * @description 获取浏览器默认语言
 * @return string
 */
export function getBrowserLang() {
  const browserLang = navigator.language
    ? navigator.language
    : navigator.browserLanguage;
  let defaultBrowserLang = '';
  if (
    browserLang.toLowerCase() === 'cn' ||
    browserLang.toLowerCase() === 'zh' ||
    browserLang.toLowerCase() === 'zh-cn'
  ) {
    defaultBrowserLang = 'zh';
  } else {
    defaultBrowserLang = 'en';
  }
  return defaultBrowserLang;
}

export function isId(value: any) {
  return (
    (typeof value === 'string' && value.trim()) ||
    (typeof value === 'number' && !isNaN(value))
  );
}

const sizeMappings: Record<string, number> = {
  KB: 1024,
  MB: 1024 * 1024,
  GB: 1024 * 1024 * 1024,
};

export const parseMaxsize = (maxSize: string) => {
  const [num, unit] = maxSize.split(' ');
  const count = parseInt(num) || 0;
  return count * (sizeMappings[unit] || 1);
};

export const uploadFile = async (
  url: string,
  file: File,
  onprogress?: (percent: number) => void,
) => {
  const fd = new FormData();
  fd.append('file', file);
  return new Promise<ResponseStructure>((resolve, reject) => {
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
        const response = JSON.parse(xhr.response || '{}') as ResponseStructure;
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
