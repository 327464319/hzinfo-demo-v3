/// <reference types="vite/client" />
// import { AxiosRequestConfig } from 'axios'

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// interface Window {
//   ENV_CONFIG: {
//     VITE_GLOB_API_URL: string;
//     VITE_GLOB_CLIENT_ID: string;
//   };
//   __POWERED_BY_QIANKUN__?: boolean;
//   __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string;
// }


// declare module 'axios' {
//   export interface AxiosInstance {
//     <T = any>(config: AxiosRequestConfig): Promise<T>;
//     request<T = any> (config: AxiosRequestConfig): Promise<T>;
//     get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
//     delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
//     head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>;
//     post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//     put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//     patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
//   }
// }
