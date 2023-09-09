/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
/**
 * 数据相关工具函数
 */
import CryptoJS from 'crypto-js';
import currency from 'currency.js';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

/**
 * Upper case first char
 * @param {String} string
 */
export function uppercaseFirst(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * @description 判断数据类型
 * @param {Any} val
 * @return string
 */
export function isType(val: any) {
  if (val === null) {
    return 'null';
  }
  if (typeof val !== 'object') {
    return typeof val;
  }
  return Object.prototype.toString.call(val).slice(8, -1).toLocaleLowerCase();
}

/**
 * @description 是否数值类型
 * @param {Any} val
 * @return boolean
 */
export function isNumeric(val: any) {
  return !isNaN(parseFloat(val)) && isFinite(val);
}

/**
 * @description 生成随机数
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 * @return number
 */
export function randomNum(min: number, max: number): number {
  const num = Math.floor(Math.random() * (min - max) + max);
  return num;
}

/**
 * 获取小数位数
 * @param {Number} num
 * @returns {Number}
 */
export function getDecimalPlaces(num: any) {
  if (typeof num !== 'number') return 0;
  const decimalPart = num.toString().split('.')[1];
  return decimalPart ? decimalPart.length : 0;
}

/**
 * 保留小数位数
 * @param {Number} num
 * @param {Number} decimal
 * @returns {Number}
 */
export function formatDecimal(num: number, decimal = 2) {
  // return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
  /**
   * 为使前端“四舍五入”规则统一，改为采用 toFixed 求近似值
   */
  // toFixed “银行家舍入法”说明：https://www.jianshu.com/p/acbb6f6095e1
  // 1.35.toFixed(1) // 1.4
  // 1.45.toFixed(1) // 1.4
  // 0.45.toFixed(1) // 0.5
  return (+num || 0).toFixed(decimal);
}

/**
 * 千位分隔符、小数位 格式化
 * 10000 => "10,000"
 * @param {Number} num
 * @param {Number} decimal
 */
export function toThousand(
  value: number | string | null | undefined,
  decimal: number | null = null,
) {
  if (value == null || value === '' || String(value) === '-') {
    return '-';
  }

  // 小数点后全 0 的浮点数（如 11.00）要保证 0 不丢失，需依赖接口返回字符类型（如 '11.00'）
  if (typeof value === 'string') {
    let precision = value.split('.')[1]?.length ?? 0;
    if (decimal !== null) {
      precision = decimal;
    }
    const formartValue = currency(value, { symbol: '', precision }).format();
    return formartValue;
  }
  if (typeof value === 'number') {
    if (decimal !== null) {
      return currency(value, { symbol: '', precision: decimal }).format();
    }
    return value
      .toString()
      .replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','));
  }

  return '-';
}

/**
 * 千位分隔，并保留 2 位小数
 * @param {Number} number
 * @returns {String}
 */
export function toThousandDecimal2(num: number) {
  return toThousand(num, 2);
}

/**
 * 千位分隔，并保留 1 位小数
 * @param {Number} number
 * @returns {String}
 */
export function toThousandDecimal1(num: number) {
  return toThousand(num, 1);
}

/**
 * 千位分隔，并取整
 * @param {Number} number
 * @returns {String}
 */
export function toThousandInt(num: number) {
  return toThousand(num, 0);
}

export const isNull = (val: any) => val == null || val === '';
export const filterNull = (val: any) => (isNull(val) ? '-' : val);
export const isObject = (obj: any) => {
  if (typeof obj !== 'object' || obj === null) return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto;
};

/**
 * @description 格式化日期 - for ProTable
 * @param {String} date 日期
 * @param {String} format 格式
 * @return string
 * */
export function yyyymmdd(value?: string, format = 'YYYY-MM-DD') {
  if (value == null || value === '' || String(value) === '-') {
    return '-';
  }
  return value ? dayjs(value).format(format) : dayjs().format(format);
}

/**
 * 剔除对象空属性
 * */
export function omitNullValue<T extends object>(params: T): Partial<T> {
  return Object.entries(params)
    .filter(
      ([_, value]) => value !== '' && value !== null && value !== undefined,
    )
    .reduce((params, [key, value]) => ({ ...params, [key]: value }), {});
}

/**
 * 单词首字母大写
 * */
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * 日期字符串转 dayjs 对象
 */
export function dateToDayjs(dateString: string) {
  return dayjs(dateString);
}

/**
 * 日期字符串范围转 dayjs 对象
 */
export function dateRangeToDayjs(
  dateRange: [string, string],
  dateFormat = 'YYYY-MM-DD',
) {
  const [start, end] = dateRange;
  return [dayjs(start, dateFormat), dayjs(end, dateFormat)];
}

export function getFirstRoute() {
  const url = location.href;
  const urlParts = url.split('/');
  return urlParts[3];
}

export const encrypt = (text: string, secretKey = 'hackathon') =>
  CryptoJS.AES.encrypt(text, secretKey).toString();

export const decrypt = (text: string, secretKey = 'hackathon') =>
  CryptoJS.AES.decrypt(text, secretKey).toString(CryptoJS.enc.Utf8);
