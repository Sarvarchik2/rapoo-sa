import type { FetchOptions } from 'ofetch'
declare module '#app' {
  interface NuxtApp {
    $api: <T = any>(url: string, opts?: FetchOptions) => Promise<T>
    $tapi: <T = any>(url: string, opts?: FetchOptions) => Promise<T>
    $auth: <T = any>(url: string, opts?: FetchOptions) => Promise<T>
  }
}
declare module 'vue' {
  interface ComponentCustomProperties {
    $api: <T = any>(url: string, opts?: FetchOptions) => Promise<T>
    $tapi: <T = any>(url: string, opts?: FetchOptions) => Promise<T>
    $auth: <T = any>(url: string, opts?: FetchOptions) => Promise<T>
  }
}
export {}
