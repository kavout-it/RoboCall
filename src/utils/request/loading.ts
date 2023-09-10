/**
 * 全局 loading
 */

const startLoading = (loadingText: string) => {
  console.log(loadingText);
};

const endLoading = () => {
  console.clear();
};

// 合并同一时刻 loading
let loadingCount = 0;

export const showLoading = (loadingText = '加载中') => {
  if (loadingCount === 0) {
    startLoading(loadingText);
  }
  loadingCount++;
};

export const hideLoading = () => {
  loadingCount--;
  loadingCount = Math.max(loadingCount, 0);
  if (loadingCount === 0) {
    endLoading();
  }
};
