import type { SandBoxAdapter, AppInterface } from '@micro-app/types'
import globalEnv from '../libs/global_env'
import { defer, rawDefineProperty, rawDefineProperties, isNode } from '../libs/utils'
import { appInstanceMap, isIframeSandbox } from '../create_app'

export default class Adapter implements SandBoxAdapter {
  constructor () {
    this.injectReactHMRProperty()
  }

  // keys that can only assigned to rawWindow
  public escapeSetterKeyList: PropertyKey[] = [
    'location',
  ]

  // keys that can escape to rawWindow
  public staticEscapeProperties: PropertyKey[] = [
    'System',
    '__cjsWrapper',
  ]

  // keys that scoped in child app
  public staticScopeProperties: PropertyKey[] = [
    'webpackJsonp',
    'webpackHotUpdate',
    'Vue',
  ]

  // adapter for react
  private injectReactHMRProperty (): void {
    if (__DEV__) {
      // react child in non-react env
      this.staticEscapeProperties.push('__REACT_ERROR_OVERLAY_GLOBAL_HOOK__')
      // in react parent
      if (globalEnv.rawWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__) {
        this.staticScopeProperties = this.staticScopeProperties.concat([
          '__REACT_ERROR_OVERLAY_GLOBAL_HOOK__',
          '__reactRefreshInjected',
        ])
      }
    }
  }
}

// Fix conflict of babel-polyfill@6.x
export function fixBabelPolyfill6 (): void {
  if (globalEnv.rawWindow._babelPolyfill) globalEnv.rawWindow._babelPolyfill = false
}

/**
 * Fix error of hot reload when parent&child created by create-react-app in development environment
 * Issue: https://github.com/micro-zoe/micro-app/issues/382
 */
export function fixReactHMRConflict (app: AppInterface): void {
  if (__DEV__) {
    const rawReactErrorHook = globalEnv.rawWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__
    const childReactErrorHook = app.sandBox?.proxyWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__
    if (rawReactErrorHook && childReactErrorHook) {
      globalEnv.rawWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = childReactErrorHook
      defer(() => {
        globalEnv.rawWindow.__REACT_ERROR_OVERLAY_GLOBAL_HOOK__ = rawReactErrorHook
      })
    }
  }
}

/**
 * reDefine parentNode of html
 * Scenes:
 *  1. element-ui@2/lib/utils/popper.js
 *    var parent = element.parentNode;
 *    // root is child app window
 *    if (parent === root.document) ...
 */
export function throttleDeferForParentNode (microDocument: Document): void {
  const html = globalEnv.rawDocument.firstElementChild
  if (html?.parentNode === globalEnv.rawDocument) {
    setParentNode(html, microDocument)
    defer(() => {
      setParentNode(html, globalEnv.rawDocument)
    })
  }
}

/**
 * Modify the point of parentNode
 * @param target target Node
 * @param value parentNode
 */
export function setParentNode (target: Node, value: Document | Element): void {
  const descriptor = Object.getOwnPropertyDescriptor(target, 'parentNode')
  if (!descriptor || descriptor.configurable) {
    rawDefineProperty(target, 'parentNode', {
      value,
      configurable: true,
    })
  }
}

// this events should be sent to the specified app
const formatEventList = ['unmount', 'appstate-change']

/**
 * Format event name
 * @param eventName event name
 * @param appName app name
 */
export function formatEventName (eventName: string, appName: string): string {
  if (
    !isIframeSandbox(appName) && (
      formatEventList.includes(eventName) ||
      (
        (eventName === 'popstate' || eventName === 'hashchange') &&
        appInstanceMap.get(appName)?.useMemoryRouter
      )
    )
  ) {
    return `${eventName}-${appName}`
  }

  return eventName
}

/**
 * update dom tree of target dom
 * @param container target dom
 * @param appName app name
 */
export function patchElementTree (container: Element | ShadowRoot, appName: string): void {
  const children = Array.from(container.children)

  children.length && children.forEach((child) => {
    patchElementTree(child, appName)
  })

  for (const child of children) {
    updateElementInfo(child, appName)
  }
}

/**
 * rewrite baseURI, ownerDocument, __MICRO_APP_NAME__ of target node
 * @param node target node
 * @param appName app name
 * @returns target node
 */
export function updateElementInfo <T> (node: T, appName: string): T {
  const proxyWindow = appInstanceMap.get(appName)?.sandBox?.proxyWindow
  if (
    isNode(node) &&
    !node.__MICRO_APP_NAME__ &&
    !node.__PURE_ELEMENT__ &&
    proxyWindow
  ) {
    /**
     * TODO:
     *  1. 测试baseURI和ownerDocument在with沙箱中是否正确
     *    经过验证with沙箱不能重写ownerDocument，否则react点击事件会触发两次
     *  2. with沙箱所有node设置__MICRO_APP_NAME__都使用updateElementInfo
     *  3. 性能: defineProperty的性能肯定不如直接设置
    */
    rawDefineProperties(node, {
      baseURI: {
        configurable: true,
        get: () => proxyWindow.location.href,
      },
      __MICRO_APP_NAME__: {
        configurable: true,
        writable: true,
        value: appName,
      },
    })

    if (isIframeSandbox(appName)) {
      rawDefineProperty(node, 'ownerDocument', {
        configurable: true,
        get: () => proxyWindow.document,
      })
    }
  }

  return node
}
