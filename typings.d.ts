import 'umi/typings';

declare global {
  interface Navigator {
    msSaveOrOpenBlob: (blob: Blob, fileName: string) => void;
    browserLanguage: string;
  }

  export interface Window {
    ChatSDK: any;
  }
}
