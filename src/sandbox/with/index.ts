import type {
  microAppWindowType,
  WithSandBoxInterface,
  plugins,
  MicroLocation,
  SandBoxAdapter,
  SandBoxStartParams,
  SandBoxStopParams,
  CommonEffectHook,
  releaseGlobalEffectParams,
} from '@micro-app/types'
import globalEnv from '../../libs/global_env'
import microApp from '../../micro_app'
import bindFunctionToRawTarget from '../bind_function'
import {
  EventCenterForMicroApp,
  rebuildDataCenterSnapshot,
  recordDataCenterSnapshot,
  resetDataCenterSnapshot,
} from '../../interact'
import {
  initEnvOfNestedApp,
} from '../../libs/nest_app'
import {
  getEffectivePath,
  isArray,
  isPlainObject,
  isString,
  isUndefined,
  removeDomScope,
  unique,
  throttleDeferForSetAppName,
  rawDefineProperty,
  rawDefineProperties,
  rawHasOwnProperty,
  pureCreateElement,
  assign,
} from '../../libs/utils'
import {
  createProxyDocument,
} from './document'
import {
  patchWindowEffect,
} from './window'
import {
  patchElementAndDocument,
  releasePatchElementAndDocument,
} from '../../source/patch'
import {
  router,
  createMicroRouter,
  initRouteStateWithURL,
  clearRouteStateFromURL,
  addHistoryListener,
  removePathFromBrowser,
  updateBrowserURLWithLocation,
  patchHistory,
  releasePatchHistory,
} from '../router'
import Adapter, {
  fixBabelPolyfill6,
  patchElementTree,
} from '../adapter'
import {
  createMicroFetch,
  useMicroEventSource,
  createMicroXMLHttpRequest,
} from '../request'

// TODO: 放到global.d.ts
export type MicroAppWindowDataType = {
  __MICRO_APP_ENVIRONMENT__: boolean,
  __MICRO_APP_NAME__: string,
  __MICRO_APP_URL__: string,
  __MICRO_APP_PUBLIC_PATH__: string,
  __MICRO_APP_BASE_URL__: string,
  __MICRO_APP_BASE_ROUTE__: string,
  __MICRO_APP_UMD_MODE__: boolean,
  __MICRO_APP_PRE_RENDER__: boolean
  microApp: EventCenterForMicroApp,
  rawWindow: Window,
  rawDocument: Document,
  removeDomScope: () => void,
}

export type MicroAppWindowType = Window & MicroAppWindowDataType
export type proxyWindow = WindowProxy & MicroAppWindowDataType

const { createMicroEventSource, clearMicroEventSource } = useMicroEventSource()
const globalPropertyList: Array<PropertyKey> = ['window', 'self', 'globalThis']

export default class WithSandBox implements WithSandBoxInterface {
  static activeCount = 0 // number of active sandbox
  private active = false
  private windowEffect: CommonEffectHook
  private documentEffect: CommonEffectHook
  private removeHistoryListener!: CallableFunction
  private adapter: SandBoxAdapter
  /**
   * Scoped global Properties(Properties that can only get and set in microAppWindow, will not escape to rawWindow)
   * Fix https://github.com/micro-zoe/micro-app/issues/234
   */
  private scopeProperties: PropertyKey[] = []
  // Properties that can be escape to rawWindow
  private escapeProperties: PropertyKey[] = []
  // Properties escape to rawWindow, cleared when unmount
  private escapeKeys = new Set<PropertyKey>()
  // Properties newly added to microAppWindow
  private injectedKeys = new Set<PropertyKey>()
  public proxyWindow!: proxyWindow // Proxy
  public microAppWindow = {} as MicroAppWindowType // Proxy target

  constructor (appName: string, url: string) {
    this.adapter = new Adapter()
    // get scopeProperties and escapeProperties from plugins
    this.getSpecialProperties(appName)
    // rewrite window of child app
    this.windowEffect = this.patchWithWindow(appName, this.microAppWindow)
    // rewrite document of child app
    this.documentEffect = this.patchWithDocument(appName, this.microAppWindow)
    // inject global properties
    this.initStaticGlobalKeys(appName, url, this.microAppWindow)
  }

  /**
   * open sandbox and perform some initial actions
   * @param umdMode is umd mode
   * @param baseroute base route for child
   * @param useMemoryRouter use virtual router
   * @param defaultPage default page when mount child base on virtual router
   * @param disablePatchRequest prevent patchRequestApi
   */
  public start ({
    umdMode,
    baseroute,
    useMemoryRouter,
    defaultPage,
    disablePatchRequest,
  }: SandBoxStartParams): void {
    if (this.active) return
    this.active = true
    // TODO: with沙箱关闭虚拟路由保持和iframe一致
    if (useMemoryRouter) {
      if (isUndefined(this.microAppWindow.location)) {
        this.setMicroAppRouter(
          this.microAppWindow.__MICRO_APP_NAME__,
          this.microAppWindow.__MICRO_APP_URL__,
          this.microAppWindow,
        )
      }
      this.initRouteState(defaultPage)
      // unique listener of popstate event for sub app
      this.removeHistoryListener = addHistoryListener(
        this.microAppWindow.__MICRO_APP_NAME__,
      )
    } else {
      this.microAppWindow.__MICRO_APP_BASE_ROUTE__ = this.microAppWindow.__MICRO_APP_BASE_URL__ = baseroute
    }

    /**
     * Target: Ensure default mode action exactly same to first time when render again
     * 1. The following globalKey maybe modified when render, reset them when render again in default mode
     * 2. Umd mode will not delete any keys during sandBox.stop, ignore umd mode
     * 3. When sandbox.start called for the first time, it must be the default mode
     */
    if (!umdMode) {
      this.initGlobalKeysWhenStart(
        this.microAppWindow.__MICRO_APP_NAME__,
        this.microAppWindow.__MICRO_APP_URL__,
        this.microAppWindow,
        disablePatchRequest,
      )
    }

    if (++globalEnv.activeSandbox === 1) {
      patchElementAndDocument()
      patchHistory()
    }

    if (++WithSandBox.activeCount === 1) {
      // effectDocumentEvent()
      initEnvOfNestedApp()
    }

    fixBabelPolyfill6()
  }

  /**
   * close sandbox and perform some clean up actions
   * @param umdMode is umd mode
   * @param keepRouteState prevent reset route
   * @param destroy completely destroy, delete cache resources
   * @param clearData clear data from base app
   * @param useMemoryRouter use virtual router
   */
  public stop ({
    umdMode,
    keepRouteState,
    destroy,
    clearData,
    useMemoryRouter,
  }: SandBoxStopParams): void {
    if (!this.active) return
    this.recordAndReleaseEffect({ umdMode, clearData, destroy }, !umdMode || destroy)

    if (useMemoryRouter) {
      this.clearRouteState(keepRouteState)
    }

    // release listener of popstate for child app
    this.removeHistoryListener?.()

    /**
     * NOTE:
     *  1. injectedKeys and escapeKeys must be placed at the back
     *  2. if key in initial microAppWindow, and then rewrite, this key will be delete from microAppWindow when stop, and lost when restart
     *  3. umd mode will not delete global keys
     */
    if (!umdMode || destroy) {
      clearMicroEventSource(this.microAppWindow.__MICRO_APP_NAME__)

      this.injectedKeys.forEach((key: PropertyKey) => {
        Reflect.deleteProperty(this.microAppWindow, key)
      })
      this.injectedKeys.clear()

      this.escapeKeys.forEach((key: PropertyKey) => {
        Reflect.deleteProperty(globalEnv.rawWindow, key)
      })
      this.escapeKeys.clear()
    }

    if (--globalEnv.activeSandbox === 0) {
      releasePatchElementAndDocument()
      releasePatchHistory()
    }

    if (--WithSandBox.activeCount === 0) {
      // releaseEffectDocumentEvent()
    }

    this.active = false
  }

  /**
   * inject global properties to microAppWindow
   * @param appName app name
   * @param url app url
   * @param microAppWindow micro window
   */
  private initStaticGlobalKeys (
    appName: string,
    url: string,
    microAppWindow: microAppWindowType,
  ): void {
    microAppWindow.__MICRO_APP_ENVIRONMENT__ = true
    microAppWindow.__MICRO_APP_NAME__ = appName
    microAppWindow.__MICRO_APP_URL__ = url
    microAppWindow.__MICRO_APP_PUBLIC_PATH__ = getEffectivePath(url)
    microAppWindow.__MICRO_APP_BASE_ROUTE__ = ''
    microAppWindow.__MICRO_APP_WINDOW__ = microAppWindow
    microAppWindow.__MICRO_APP_PRE_RENDER__ = false
    microAppWindow.__MICRO_APP_UMD_MODE__ = false
    microAppWindow.rawWindow = globalEnv.rawWindow
    microAppWindow.rawDocument = globalEnv.rawDocument
    microAppWindow.microApp = assign(new EventCenterForMicroApp(appName), {
      removeDomScope,
      pureCreateElement,
      router,
    })
    this.setMappingPropertiesWithRawDescriptor(microAppWindow)
  }

  /**
   * Record global effect and then release (effect: global event, timeout, data listener)
   * Scenes:
   * 1. unmount of default/umd app
   * 2. hidden keep-alive app
   * 3. after init prerender app
   * @param options {
   *  @param clearData clear data from base app
   *  @param isPrerender is prerender app
   *  @param keepAlive is keep-alive app
   * }
   * @param preventRecord prevent record effect events
   */
  public recordAndReleaseEffect (
    options: releaseGlobalEffectParams,
    preventRecord = false,
  ): void {
    if (preventRecord) {
      this.resetEffectSnapshot()
    } else {
      this.recordEffectSnapshot()
    }
    this.releaseGlobalEffect(options)
  }

  /**
   * reset effect snapshot data in default mode or destroy
   * Scenes:
   *  1. unmount hidden keep-alive app manually
   *  2. unmount prerender app manually
   */
  public resetEffectSnapshot (): void {
    this.windowEffect.reset()
    this.documentEffect.reset()
    resetDataCenterSnapshot(this.microAppWindow.microApp)
  }

  /**
   * record umd snapshot before the first execution of umdHookMount
   * Scenes:
   * 1. exec umdMountHook in umd mode
   * 2. hidden keep-alive app
   * 3. after init prerender app
   */
  public recordEffectSnapshot (): void {
    this.windowEffect.record()
    this.documentEffect.record()
    recordDataCenterSnapshot(this.microAppWindow.microApp)
  }

  // rebuild umd snapshot before remount umd app
  public rebuildEffectSnapshot (): void {
    this.windowEffect.rebuild()
    this.documentEffect.rebuild()
    rebuildDataCenterSnapshot(this.microAppWindow.microApp)
  }

  /**
   * clear global event, timeout, data listener
   * Scenes:
   * 1. unmount of default/umd app
   * 2. hidden keep-alive app
   * 3. after init prerender app
   * @param umdMode is umd mode
   * @param clearData clear data from base app
   * @param isPrerender is prerender app
   * @param keepAlive is keep-alive app
   * @param destroy completely destroy
   */
  public releaseGlobalEffect ({
    umdMode = false,
    clearData = false,
    isPrerender = false,
    keepAlive = false,
    destroy = false,
  }: releaseGlobalEffectParams): void {
    // default mode(not keep-alive or isPrerender)
    this.windowEffect.release((!umdMode && !keepAlive && !isPrerender) || destroy)
    this.documentEffect.release()
    this.microAppWindow.microApp?.clearDataListener()
    this.microAppWindow.microApp?.clearGlobalDataListener()
    if (clearData) {
      microApp.clearData(this.microAppWindow.__MICRO_APP_NAME__)
      this.microAppWindow.microApp?.clearData()
    }
  }

  /**
   * get scopeProperties and escapeProperties from plugins & adapter
   * @param appName app name
   */
  private getSpecialProperties (appName: string): void {
    this.scopeProperties = this.scopeProperties.concat(this.adapter.staticScopeProperties)
    if (isPlainObject(microApp.options.plugins)) {
      this.commonActionForSpecialProperties(microApp.options.plugins.global)
      this.commonActionForSpecialProperties(microApp.options.plugins.modules?.[appName])
    }
  }

  // common action for global plugins and module plugins
  private commonActionForSpecialProperties (plugins: plugins['global']) {
    if (isArray(plugins)) {
      for (const plugin of plugins) {
        if (isPlainObject(plugin)) {
          if (isArray(plugin.scopeProperties)) {
            this.scopeProperties = this.scopeProperties.concat(plugin.scopeProperties)
          }
          if (isArray(plugin.escapeProperties)) {
            this.escapeProperties = this.escapeProperties.concat(plugin.escapeProperties)
          }
        }
      }
    }
  }

  // create proxyWindow with Proxy(microAppWindow)
  private createProxyWindow (appName: string, microAppWindow: microAppWindowType) {
    const rawWindow = globalEnv.rawWindow
    const descriptorTargetMap = new Map<PropertyKey, 'target' | 'rawWindow'>()
    return new Proxy(microAppWindow, {
      get: (target: microAppWindowType, key: PropertyKey): unknown => {
        throttleDeferForSetAppName(appName)
        if (
          Reflect.has(target, key) ||
          (isString(key) && /^__MICRO_APP_/.test(key)) ||
          this.scopeProperties.includes(key)
        ) return Reflect.get(target, key)

        return bindFunctionToRawTarget(Reflect.get(rawWindow, key), rawWindow)
      },
      set: (target: microAppWindowType, key: PropertyKey, value: unknown): boolean => {
        /**
         * TODO:
         * 1、location域名相同，子应用内部跳转时的处理
         */
        if (this.adapter.escapeSetterKeyList.includes(key)) {
          Reflect.set(rawWindow, key, value)
        } else if (
          // target.hasOwnProperty has been rewritten
          !rawHasOwnProperty.call(target, key) &&
          rawHasOwnProperty.call(rawWindow, key) &&
          !this.scopeProperties.includes(key)
        ) {
          const descriptor = Object.getOwnPropertyDescriptor(rawWindow, key)
          const { configurable, enumerable, writable, set } = descriptor!
          // set value because it can be set
          rawDefineProperty(target, key, {
            value,
            configurable,
            enumerable,
            writable: writable ?? !!set,
          })

          this.injectedKeys.add(key)
        } else {
          !Reflect.has(target, key) && this.injectedKeys.add(key)
          Reflect.set(target, key, value)
        }

        if (
          (
            this.escapeProperties.includes(key) ||
            (
              this.adapter.staticEscapeProperties.includes(key) &&
              !Reflect.has(rawWindow, key)
            )
          ) &&
          !this.scopeProperties.includes(key)
        ) {
          !Reflect.has(rawWindow, key) && this.escapeKeys.add(key)
          Reflect.set(rawWindow, key, value)
        }

        return true
      },
      has: (target: microAppWindowType, key: PropertyKey): boolean => {
        if (this.scopeProperties.includes(key)) return key in target
        return key in target || key in rawWindow
      },
      // Object.getOwnPropertyDescriptor(window, key)
      getOwnPropertyDescriptor: (target: microAppWindowType, key: PropertyKey): PropertyDescriptor|undefined => {
        if (rawHasOwnProperty.call(target, key)) {
          descriptorTargetMap.set(key, 'target')
          return Object.getOwnPropertyDescriptor(target, key)
        }

        if (rawHasOwnProperty.call(rawWindow, key)) {
          descriptorTargetMap.set(key, 'rawWindow')
          const descriptor = Object.getOwnPropertyDescriptor(rawWindow, key)
          if (descriptor && !descriptor.configurable) {
            descriptor.configurable = true
          }
          return descriptor
        }

        return undefined
      },
      // Object.defineProperty(window, key, Descriptor)
      defineProperty: (target: microAppWindowType, key: PropertyKey, value: PropertyDescriptor): boolean => {
        const from = descriptorTargetMap.get(key)
        if (from === 'rawWindow') {
          return Reflect.defineProperty(rawWindow, key, value)
        }
        return Reflect.defineProperty(target, key, value)
      },
      // Object.getOwnPropertyNames(window)
      ownKeys: (target: microAppWindowType): Array<string | symbol> => {
        return unique(Reflect.ownKeys(rawWindow).concat(Reflect.ownKeys(target)))
      },
      deleteProperty: (target: microAppWindowType, key: PropertyKey): boolean => {
        if (rawHasOwnProperty.call(target, key)) {
          this.injectedKeys.has(key) && this.injectedKeys.delete(key)
          this.escapeKeys.has(key) && Reflect.deleteProperty(rawWindow, key)
          return Reflect.deleteProperty(target, key)
        }
        return true
      },
    })
  }

  /**
   * create proxyWindow, rewrite window event & timer of child app
   * @param appName app name
   * @param microAppWindow Proxy target
   */
  private patchWithWindow (appName: string, microAppWindow: microAppWindowType): CommonEffectHook {
    // create proxyWindow with Proxy(microAppWindow)
    this.proxyWindow = this.createProxyWindow(appName, microAppWindow)
    // rewrite global event & timeout of window
    return patchWindowEffect(appName, microAppWindow)
  }

  /**
   * create proxyDocument and MicroDocument, rewrite document of child app
   * @param appName app name
   * @param microAppWindow Proxy target
   */
  private patchWithDocument (appName: string, microAppWindow: microAppWindowType): CommonEffectHook {
    const { proxyDocument, MicroDocument, documentEffect } = createProxyDocument(appName, this)
    rawDefineProperties(microAppWindow, {
      document: {
        configurable: false,
        enumerable: true,
        get () {
          // return globalEnv.rawDocument
          return proxyDocument
        },
      },
      Document: {
        configurable: false,
        enumerable: false,
        get () {
          // return globalEnv.rawRootDocument
          return MicroDocument
        },
      }
    })

    return documentEffect
  }

  // set __MICRO_APP_PRE_RENDER__ state
  public setPreRenderState (state: boolean): void {
    this.microAppWindow.__MICRO_APP_PRE_RENDER__ = state
  }

  public markUmdMode (state: boolean): void {
    this.microAppWindow.__MICRO_APP_UMD_MODE__ = state
  }

  // properties associated with the native window
  private setMappingPropertiesWithRawDescriptor (microAppWindow: microAppWindowType): void {
    let topValue: Window, parentValue: Window
    const rawWindow = globalEnv.rawWindow
    if (rawWindow === rawWindow.parent) { // not in iframe
      topValue = parentValue = this.proxyWindow
    } else { // in iframe
      topValue = rawWindow.top
      parentValue = rawWindow.parent
    }

    // TODO: 用rawDefineProperties
    rawDefineProperty(
      microAppWindow,
      'top',
      this.createDescriptorForMicroAppWindow('top', topValue)
    )

    rawDefineProperty(
      microAppWindow,
      'parent',
      this.createDescriptorForMicroAppWindow('parent', parentValue)
    )

    globalPropertyList.forEach((key: PropertyKey) => {
      rawDefineProperty(
        microAppWindow,
        key,
        this.createDescriptorForMicroAppWindow(key, this.proxyWindow)
      )
    })
  }

  private createDescriptorForMicroAppWindow (key: PropertyKey, value: unknown): PropertyDescriptor {
    const { configurable = true, enumerable = true, writable, set } = Object.getOwnPropertyDescriptor(globalEnv.rawWindow, key) || { writable: true }
    const descriptor: PropertyDescriptor = {
      value,
      configurable,
      enumerable,
      writable: writable ?? !!set
    }

    return descriptor
  }

  /**
   * init global properties of microAppWindow when exec sandBox.start
   * @param microAppWindow micro window
   * @param appName app name
   * @param url app url
   * @param disablePatchRequest prevent rewrite request method of child app
   */
  private initGlobalKeysWhenStart (
    appName: string,
    url: string,
    microAppWindow: microAppWindowType,
    disablePatchRequest: boolean,
  ): void {
    microAppWindow.hasOwnProperty = (key: PropertyKey) => rawHasOwnProperty.call(microAppWindow, key) || rawHasOwnProperty.call(globalEnv.rawWindow, key)
    this.setHijackProperty(appName, microAppWindow)
    if (!disablePatchRequest) this.patchRequestApi(appName, url, microAppWindow)
    this.setScopeProperties(microAppWindow)
  }

  // set hijack Properties to microAppWindow
  private setHijackProperty (appName: string, microAppWindow: microAppWindowType): void {
    let modifiedEval: unknown, modifiedImage: unknown
    rawDefineProperties(microAppWindow, {
      eval: {
        configurable: true,
        enumerable: false,
        get () {
          throttleDeferForSetAppName(appName)
          return modifiedEval || eval
        },
        set: (value) => {
          modifiedEval = value
        },
      },
      Image: {
        configurable: true,
        enumerable: false,
        get () {
          throttleDeferForSetAppName(appName)
          return modifiedImage || globalEnv.ImageProxy
        },
        set: (value) => {
          modifiedImage = value
        },
      },
    })
  }

  // rewrite fetch, XMLHttpRequest, EventSource
  private patchRequestApi (appName: string, url: string, microAppWindow: microAppWindowType): void {
    let microFetch = createMicroFetch(url)
    let microXMLHttpRequest = createMicroXMLHttpRequest(url)
    let microEventSource = createMicroEventSource(appName, url)

    rawDefineProperties(microAppWindow, {
      fetch: {
        configurable: true,
        enumerable: true,
        get () {
          return microFetch
        },
        set (value) {
          microFetch = createMicroFetch(url, value)
        },
      },
      XMLHttpRequest: {
        configurable: true,
        enumerable: true,
        get () {
          return microXMLHttpRequest
        },
        set (value) {
          microXMLHttpRequest = createMicroXMLHttpRequest(url, value)
        },
      },
      EventSource: {
        configurable: true,
        enumerable: true,
        get () {
          return microEventSource
        },
        set (value) {
          microEventSource = createMicroEventSource(appName, url, value)
        },
      },
    })
  }

  /**
   * Init scope keys to microAppWindow, prevent fall to rawWindow from with(microAppWindow)
   * like: if (!xxx) {}
   * NOTE:
   * 1. Symbol.unscopables cannot affect undefined keys
   * 2. Doesn't use for window.xxx because it fall to proxyWindow
   */
  setScopeProperties (microAppWindow: microAppWindowType): void {
    this.scopeProperties.forEach((key: PropertyKey) => {
      Reflect.set(microAppWindow, key, microAppWindow[key])
    })
  }

  // set location & history for memory router
  private setMicroAppRouter (appName: string, url: string, microAppWindow: microAppWindowType): void {
    const { microLocation, microHistory } = createMicroRouter(appName, url)
    rawDefineProperties(microAppWindow, {
      location: {
        configurable: false,
        enumerable: true,
        get () {
          return microLocation
        },
        set: (value) => {
          globalEnv.rawWindow.location = value
        },
      },
      history: {
        configurable: true,
        enumerable: true,
        get () {
          return microHistory
        },
      },
    })
  }

  private initRouteState (defaultPage: string): void {
    initRouteStateWithURL(
      this.microAppWindow.__MICRO_APP_NAME__,
      this.microAppWindow.location as MicroLocation,
      defaultPage,
    )
  }

  private clearRouteState (keepRouteState: boolean): void {
    clearRouteStateFromURL(
      this.microAppWindow.__MICRO_APP_NAME__,
      this.microAppWindow.__MICRO_APP_URL__,
      this.microAppWindow.location as MicroLocation,
      keepRouteState,
    )
  }

  public setRouteInfoForKeepAliveApp (): void {
    updateBrowserURLWithLocation(
      this.microAppWindow.__MICRO_APP_NAME__,
      this.microAppWindow.location as MicroLocation,
    )
  }

  public removeRouteInfoForKeepAliveApp (): void {
    removePathFromBrowser(this.microAppWindow.__MICRO_APP_NAME__)
  }

  /**
   * Format all html elements when init
   * @param container micro app container
   */
  public patchStaticElement (container: Element | ShadowRoot): void {
    patchElementTree(container, this.microAppWindow.__MICRO_APP_NAME__)
  }

  /**
   * action before exec scripts when mount
   * Actions:
   * 1. patch static elements from html
   * @param container micro app container
   */
  public actionBeforeExecScripts (container: Element | ShadowRoot): void {
    this.patchStaticElement(container)
  }
}
