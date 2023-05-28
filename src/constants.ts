export enum ObservedAttrName {
  NAME = 'name',
  URL = 'url',
}

// app status
export enum appStates {
  CREATED = 'created',
  LOADING = 'loading',
  LOAD_FAILED = 'load_failed',
  MOUNTING = 'mounting',
  MOUNTED = 'mounted',
  UNMOUNT = 'unmount',
}

// lifecycles
export enum lifeCycles {
  CREATED = 'created',
  BEFOREMOUNT = 'beforemount',
  MOUNTED = 'mounted',
  UNMOUNT = 'unmount',
  ERROR = 'error',
  // 👇 keep-alive only
  BEFORESHOW = 'beforeshow',
  AFTERSHOW = 'aftershow',
  AFTERHIDDEN = 'afterhidden',
}

// global event of child app
export enum microGlobalEvent {
  ONMOUNT = 'onmount',
  ONUNMOUNT = 'onunmount',
}

// custom event of child app
export const microAppCustomEvent = [
  'unmount',
  'appstate-change',
]

// keep-alive status
export enum keepAliveStates {
  KEEP_ALIVE_SHOW = 'keep_alive_show',
  KEEP_ALIVE_HIDDEN = 'keep_alive_hidden',
}

// micro-app config
export enum MicroAppConfig {
  DESTROY = 'destroy',
  DESTORY = 'destory',
  INLINE = 'inline',
  DISABLESCOPECSS = 'disableScopecss',
  DISABLESANDBOX = 'disableSandbox',
  DISABLE_SCOPECSS = 'disable-scopecss',
  DISABLE_SANDBOX = 'disable-sandbox',
  DISABLE_MEMORY_ROUTER = 'disable-memory-router',
  DISABLE_PATCH_REQUEST = 'disable-patch-request',
  KEEP_ROUTER_STATE = 'keep-router-state',
  HIDDEN_ROUTER = 'hidden-router',
  KEEP_ALIVE = 'keep-alive',
  CLEAR_DATA ='clear-data',
  SSR = 'ssr',
  FIBER = 'fiber',
}

export const PREFETCH_LEVEL: number[] = [1, 2, 3]

export const ROUTER_MODE_LIST: string[] = ['search', 'history', 'custom']
/**
 * global key must be static key, they can not rewrite
 * e.g.
 * window.Promise = newValue
 * new Promise ==> still get old value, not newValue, because they are cached by top function
 * NOTE:
 * 1. Do not add fetch, XMLHttpRequest, EventSource
 */
export const GLOBAL_CACHED_KEY = 'window,self,globalThis,document,Document,Array,Object,String,Boolean,Math,Number,Symbol,Date,Function,Proxy,WeakMap,WeakSet,Set,Map,Reflect,Element,Node,RegExp,Error,TypeError,JSON,isNaN,parseFloat,parseInt,performance,console,decodeURI,encodeURI,decodeURIComponent,encodeURIComponent,navigator,undefined,location,history'
