import type {
  Func,
  AppInterface,
  sourceType,
  WithSandBoxInterface,
  MountParam,
  UnmountParam,
} from '@micro-app/types'
import { HTMLLoader } from './source/loader/html'
import { extractSourceDom } from './source/index'
import { execScripts } from './source/scripts'
import WithSandBox from './sandbox/with'
import IframeSandbox from './sandbox/iframe'
import { router } from './sandbox/router'
import {
  appStates,
  lifeCycles,
  keepAliveStates,
  microGlobalEvent,
} from './constants'
import {
  isFunction,
  cloneContainer,
  isPromise,
  logError,
  getRootContainer,
  isObject,
  execMicroAppGlobalHook,
  pureCreateElement,
  isDivElement,
  removeDomScope,
} from './libs/utils'
import dispatchLifecyclesEvent, {
  dispatchCustomEventToMicroApp,
} from './interact/lifecycles_event'
import globalEnv from './libs/global_env'
import microApp from './micro_app'
import sourceCenter from './source/source_center'

// micro app instances
export const appInstanceMap = new Map<string, AppInterface>()

// params of CreateApp
export interface CreateAppParam {
  name: string
  url: string
  scopecss: boolean
  useSandbox: boolean
  inline?: boolean
  iframe?: boolean
  container?: HTMLElement | ShadowRoot
  ssrUrl?: string
  isPrefetch?: boolean
  prefetchLevel?: number
  routerMode?: string
}

export default class CreateApp implements AppInterface {
  private state: string = appStates.CREATED
  private keepAliveState: string | null = null
  private loadSourceLevel: -1|0|1|2 = 0
  private umdHookMount: Func | null = null
  private umdHookUnmount: Func | null = null
  private preRenderEvents?: CallableFunction[] | null
  public umdMode = false
  public source: sourceType
  // TODO: 类型优化，加上iframe沙箱
  public sandBox: WithSandBoxInterface | null = null
  public name: string
  public url: string
  public container: HTMLElement | ShadowRoot | null
  public scopecss: boolean
  public useSandbox: boolean
  public inline: boolean
  public iframe: boolean
  public ssrUrl: string
  public isPrefetch: boolean
  public isPrerender: boolean
  public prefetchLevel?: number
  public fiber = false
  public useMemoryRouter = true
  public routerMode: string

  constructor ({
    name,
    url,
    container,
    scopecss,
    useSandbox,
    inline,
    iframe,
    ssrUrl,
    isPrefetch,
    prefetchLevel,
    routerMode,
  }: CreateAppParam) {
    appInstanceMap.set(name, this)
    // init actions
    this.name = name
    this.url = url
    this.useSandbox = useSandbox
    this.scopecss = this.useSandbox && scopecss
    this.inline = inline ?? false
    this.iframe = iframe ?? false
    this.routerMode = routerMode ?? 'history'

    // not exist when prefetch 👇
    this.container = container ?? null
    this.ssrUrl = ssrUrl ?? ''

    // exist only prefetch 👇
    this.isPrefetch = isPrefetch ?? false
    this.isPrerender = prefetchLevel === 3
    this.prefetchLevel = prefetchLevel

    this.source = { html: null, links: new Set(), scripts: new Set() }
    this.loadSourceCode()
    this.createSandbox()
  }

  // Load resources
  public loadSourceCode (): void {
    this.setAppState(appStates.LOADING)
    HTMLLoader.getInstance().run(this, extractSourceDom)
  }

  /**
   * When resource is loaded, mount app if it is not prefetch or unmount
   */
  public onLoad (
    html: HTMLElement,
    defaultPage?: string,
    disablePatchRequest?: boolean,
  ): void {
    if (++this.loadSourceLevel === 2) {
      this.source.html = html

      if (!this.isPrefetch && !this.isUnmounted()) {
        getRootContainer(this.container!).mount(this)
      } else if (this.isPrerender) {
        /**
         * PreRender is an option of prefetch, it will render app during prefetch
         * Limit:
         * 1. fiber forced on
         * 2. only virtual router support
         *
         * NOTE: (Don't update browser url, dispatch popstateEvent, reload window, dispatch lifecycle event)
         * 1. pushState/replaceState in child can update microLocation, but will not attach router info to browser url
         * 2. prevent dispatch popstate/hashchange event to browser
         * 3. all navigation actions of location are invalid (In the future, we can consider update microLocation without trigger browser reload)
         * 4. lifecycle event will not trigger when prerender
         *
         * Special scenes
         * 1. unmount prerender app when loading
         * 2. unmount prerender app when exec js
         * 2. unmount prerender app after exec js
         */
        const container = pureCreateElement('div')
        container.setAttribute('prerender', 'true')
        this.sandBox?.setPreRenderState(true)
        this.mount({
          container,
          inline: this.inline,
          useMemoryRouter: true,
          baseroute: '',
          fiber: true,
          defaultPage: defaultPage ?? '',
          disablePatchRequest: disablePatchRequest ?? false,
        })
      }
    }
  }

  /**
   * Error loading HTML
   * @param e Error
   */
  public onLoadError (e: Error): void {
    this.loadSourceLevel = -1

    if (!this.isUnmounted()) {
      this.onerror(e)
      this.setAppState(appStates.LOAD_FAILED)
    }
  }

  /**
   * mount app
   * @param container app container
   * @param inline run js in inline mode
   * @param useMemoryRouter use virtual router
   * @param defaultPage default page of virtual router
   * @param baseroute route prefix, default is ''
   * @param disablePatchRequest prevent rewrite request method of child app
   * @param fiber run js in fiber mode
   */
  public mount ({
    container,
    inline,
    useMemoryRouter,
    defaultPage,
    baseroute,
    disablePatchRequest,
    fiber,
  }: MountParam): void {
    if (this.loadSourceLevel !== 2) {
      /**
       * container cannot be null when load end
       * NOTE:
       *  1. render prefetch app before load end
       *  2. unmount prefetch app and mount again before load end
       */
      this.container = container
      // mount before prerender exec mount (loading source), set isPrerender to false
      this.isPrerender = false
      // reset app state to LOADING
      return this.setAppState(appStates.LOADING)
    }

    this.createSandbox()

    const nextAction = () => {
      /**
       * Special scenes:
       * 1. mount before prerender exec mount (loading source)
       * 2. mount when prerender js executing
       * 3. mount after prerender js exec end
       * 4. mount after prerender unmounted
       *
       * TODO: test shadowDOM
       */
      if (
        this.isPrerender &&
        isDivElement(this.container) &&
        this.container.hasAttribute('prerender')
      ) {
        /**
         * rebuild effect event of window, document, data center
         * explain:
         * 1. rebuild before exec mount, do nothing
         * 2. rebuild when js executing, recovery recorded effect event, because prerender fiber mode
         * 3. rebuild after js exec end, normal recovery effect event
         */
        this.sandBox?.rebuildEffectSnapshot()
        // current this.container is <div prerender='true'></div>
        cloneContainer(container as Element, this.container as Element, false)
        /**
         * set this.container to <micro-app></micro-app>
         * NOTE:
         * must exec before this.preRenderEvents?.forEach((cb) => cb())
         */
        this.container = container
        this.preRenderEvents?.forEach((cb) => cb())
        // reset isPrerender config
        this.isPrerender = false
        this.preRenderEvents = null
        // attach router info to browser url
        router.attachToURL(this.name)
        this.sandBox?.setPreRenderState(false)
      } else {
        this.container = container
        this.inline = inline
        this.fiber = fiber
        // use in sandbox/effect
        this.useMemoryRouter = useMemoryRouter

        const dispatchBeforeMount = () => dispatchLifecyclesEvent(
          this.container!,
          this.name,
          lifeCycles.BEFOREMOUNT,
        )

        if (this.isPrerender) {
          (this.preRenderEvents ??= []).push(dispatchBeforeMount)
        } else {
          dispatchBeforeMount()
        }

        this.setAppState(appStates.MOUNTING)
        // TODO: 将所有cloneContainer中的'as Element'去掉，兼容shadowRoot的场景
        cloneContainer(this.container as Element, this.source.html as Element, !this.umdMode)

        this.sandBox?.start({
          umdMode: this.umdMode,
          baseroute,
          useMemoryRouter,
          defaultPage,
          disablePatchRequest,
        })

        if (!this.umdMode) {
          // update element info of html
          this.sandBox?.actionBeforeExecScripts(this.container)
          // if all js are executed, param isFinished will be true
          execScripts(this, (isFinished: boolean) => {
            if (!this.umdMode) {
              const { mount, unmount } = this.getUmdLibraryHooks()
              /**
               * umdHookUnmount can works in default mode
               * register through window.unmount
               */
              this.umdHookUnmount = unmount as Func
              // if mount & unmount is function, the sub app is umd mode
              if (isFunction(mount) && isFunction(unmount)) {
                this.umdHookMount = mount as Func
                // sandbox must exist
                this.sandBox!.markUmdMode(this.umdMode = true)
                try {
                  this.handleMounted(this.umdHookMount(microApp.getData(this.name, true)))
                } catch (e) {
                  logError('An error occurred in window.mount \n', this.name, e)
                }
              } else if (isFinished === true) {
                this.handleMounted()
              }
            }
          })
        } else {
          this.sandBox?.rebuildEffectSnapshot()
          try {
            this.handleMounted(this.umdHookMount!(microApp.getData(this.name, true)))
          } catch (e) {
            logError('An error occurred in window.mount \n', this.name, e)
          }
        }
      }
    }

    // TODO: any替换为iframe沙箱类型
    this.iframe ? (this.sandBox as any).sandboxReady.then(nextAction) : nextAction()
  }

  /**
   * handle for promise umdHookMount
   * @param umdHookMountResult result of umdHookMount
   */
  private handleMounted (umdHookMountResult?: unknown): void {
    const dispatchAction = () => {
      if (isPromise(umdHookMountResult)) {
        umdHookMountResult
          .then(() => this.dispatchMountedEvent())
          .catch(() => this.dispatchMountedEvent())
      } else {
        this.dispatchMountedEvent()
      }
    }

    if (this.isPrerender) {
      this.preRenderEvents?.push(dispatchAction)
      this.sandBox?.recordAndReleaseEffect({ isPrerender: true })
    } else {
      dispatchAction()
    }
  }

  /**
   * dispatch mounted event when app run finished
   */
  private dispatchMountedEvent (): void {
    if (!this.isUnmounted()) {
      this.setAppState(appStates.MOUNTED)
      // call window.onmount of child app
      execMicroAppGlobalHook(
        this.getMicroAppGlobalHook(microGlobalEvent.ONMOUNT),
        this.name,
        microGlobalEvent.ONMOUNT,
        microApp.getData(this.name, true)
      )

      // dispatch event mounted to parent
      dispatchLifecyclesEvent(
        this.container!,
        this.name,
        lifeCycles.MOUNTED,
      )

      /**
       * Hidden Keep-alive app during resource loading, render normally to ensure their liveliness (running in the background) characteristics.
       * Actions:
       *  1. Record & release all global events after mount
       */
      if (this.isHidden()) {
        this.sandBox?.recordAndReleaseEffect({ keepAlive: true })
      }
    }
    /**
     * TODO: 这里增加一个处理，如果渲染完成时已经卸载，则进行一些操作
     * 如果是默认模式：删除所有事件和定时器
     * 如果是umd模式：重新记录和清空事件
     * 补充：非必需，优先级低
     */
  }

  /**
   * unmount app
   * NOTE:
   *  1. do not add any params on account of unmountApp
   * @param destroy completely destroy, delete cache resources
   * @param clearData clear data of dateCenter
   * @param keepRouteState keep route state when unmount, default is false
   * @param unmountcb callback of unmount
   */
  public unmount ({
    destroy,
    clearData,
    keepRouteState,
    unmountcb,
  }: UnmountParam): void {
    destroy = destroy || this.state === appStates.LOAD_FAILED

    this.setAppState(appStates.UNMOUNT)

    let umdHookUnmountResult: unknown = null
    try {
      // call umd unmount hook before the sandbox is cleared
      umdHookUnmountResult = this.umdHookUnmount?.(microApp.getData(this.name, true))
    } catch (e) {
      logError('An error occurred in window.unmount \n', this.name, e)
    }

    // dispatch unmount event to micro app
    dispatchCustomEventToMicroApp(this, 'unmount')

    // call window.onunmount of child app
    execMicroAppGlobalHook(
      this.getMicroAppGlobalHook(microGlobalEvent.ONUNMOUNT),
      this.name,
      microGlobalEvent.ONUNMOUNT,
    )

    this.handleUnmounted({
      destroy,
      clearData,
      keepRouteState,
      unmountcb,
      umdHookUnmountResult,
    })
  }

  /**
   * handle for promise umdHookUnmount
   * @param destroy completely destroy, delete cache resources
   * @param clearData clear data of dateCenter
   * @param keepRouteState keep route state when unmount, default is false
   * @param unmountcb callback of unmount
   * @param umdHookUnmountResult result of umdHookUnmount
   */
  private handleUnmounted ({
    destroy,
    clearData,
    keepRouteState,
    unmountcb,
    umdHookUnmountResult,
  }: UnmountParam & {
    umdHookUnmountResult: unknown,
  }): void {
    const nextAction = () => this.actionsForUnmount({
      destroy,
      clearData,
      keepRouteState,
      unmountcb,
    })

    if (isPromise(umdHookUnmountResult)) {
      // async window.unmount will cause appName bind error in nest app
      removeDomScope()
      umdHookUnmountResult.then(nextAction).catch(nextAction)
    } else {
      nextAction()
    }
  }

  /**
   * actions for unmount app
   * @param destroy completely destroy, delete cache resources
   * @param clearData clear data of dateCenter
   * @param keepRouteState keep route state when unmount, default is false
   * @param unmountcb callback of unmount
   */
  private actionsForUnmount ({
    destroy,
    clearData,
    keepRouteState,
    unmountcb,
  }: UnmountParam): void {
    if (this.umdMode && this.container && !destroy) {
      cloneContainer(this.source.html as Element, this.container, false)
    }

    /**
     * this.container maybe contains micro-app element, stop sandbox should exec after cloneContainer
     * NOTE:
     * 1. if destroy is true, clear route state
     * 2. umd mode and keep-alive will not clear EventSource
     */
    this.sandBox?.stop({
      umdMode: this.umdMode,
      keepRouteState: keepRouteState && !destroy,
      destroy,
      clearData: clearData || destroy,
      useMemoryRouter: this.useMemoryRouter,
    })

    // dispatch unmount event to base app
    dispatchLifecyclesEvent(
      this.container!,
      this.name,
      lifeCycles.UNMOUNT,
    )

    this.clearOptions(destroy)

    unmountcb?.()
  }

  private clearOptions (destroy: boolean): void {
    this.container!.innerHTML = ''
    this.container = null
    this.isPrerender = false
    this.preRenderEvents = null
    this.setKeepAliveState(null)
    // in iframe sandbox & default mode, delete the sandbox & iframeElement
    if (this.iframe && !this.umdMode) this.sandBox = null
    if (destroy) this.actionsForCompletelyDestroy()
    removeDomScope()
  }

  // actions for completely destroy
  public actionsForCompletelyDestroy (): void {
    this.sandBox?.deleteIframeElement?.()
    sourceCenter.script.deleteInlineInfo(this.source.scripts)
    appInstanceMap.delete(this.name)
  }

  // hidden app when disconnectedCallback called with keep-alive
  public hiddenKeepAliveApp (callback?: CallableFunction): void {
    this.setKeepAliveState(keepAliveStates.KEEP_ALIVE_HIDDEN)

    /**
     * event should dispatch before clone node
     * dispatch afterHidden event to micro-app
     */
    dispatchCustomEventToMicroApp(this, 'appstate-change', {
      appState: 'afterhidden',
    })

    // dispatch afterHidden event to base app
    dispatchLifecyclesEvent(
      this.container!,
      this.name,
      lifeCycles.AFTERHIDDEN,
    )

    if (this.useMemoryRouter) {
      // called after lifeCyclesEvent
      this.sandBox?.removeRouteInfoForKeepAliveApp()
    }

    /**
     * Hidden app before the resources are loaded, then unmount the app
     */
    if (this.loadSourceLevel !== 2) {
      getRootContainer(this.container!).unmount()
    } else {
      this.container = cloneContainer(
        pureCreateElement('div'),
        this.container as Element,
        false,
      )

      this.sandBox?.recordAndReleaseEffect({ keepAlive: true })
    }

    callback?.()
  }

  // show app when connectedCallback called with keep-alive
  public showKeepAliveApp (container: HTMLElement | ShadowRoot): void {
    this.sandBox?.rebuildEffectSnapshot()

    // dispatch beforeShow event to micro-app
    dispatchCustomEventToMicroApp(this, 'appstate-change', {
      appState: 'beforeshow',
    })

    // dispatch beforeShow event to base app
    dispatchLifecyclesEvent(
      container,
      this.name,
      lifeCycles.BEFORESHOW,
    )

    this.setKeepAliveState(keepAliveStates.KEEP_ALIVE_SHOW)

    this.container = cloneContainer(
      container,
      this.container as Element,
      false,
    )

    /**
     * TODO:
     * 1. iframe沙箱在关闭虚拟路由系统时，重新展示时不更新浏览器地址，这样和with沙箱保持一致。
     *    但是iframe是可以做到重新展示时更新浏览器地址的，这里临时不支持，等待后续with沙箱也支持的时候再优化
     *    只需要去除 if (this.useMemoryRouter) 的判断即可
     */
    if (this.useMemoryRouter) {
      // called before lifeCyclesEvent
      this.sandBox?.setRouteInfoForKeepAliveApp()
    }

    // dispatch afterShow event to micro-app
    dispatchCustomEventToMicroApp(this, 'appstate-change', {
      appState: 'aftershow',
    })

    // dispatch afterShow event to base app
    dispatchLifecyclesEvent(
      this.container,
      this.name,
      lifeCycles.AFTERSHOW,
    )
  }

  /**
   * app rendering error
   * @param e Error
   */
  public onerror (e: Error): void {
    dispatchLifecyclesEvent(
      this.container!,
      this.name,
      lifeCycles.ERROR,
      e,
    )
  }

  /**
   * Scene:
   *  1. create app
   *  2. remount of default mode with iframe sandbox
   *    In default mode with iframe sandbox, unmount app will delete iframeElement & sandBox, and create sandBox when mount again, used to solve the problem that module script cannot be execute when append it again
   */
  private createSandbox (): void {
    if (this.useSandbox && !this.sandBox) {
      if (this.iframe) {
        this.sandBox = new IframeSandbox(this.name, this.url)
      } else {
        this.sandBox = new WithSandBox(this.name, this.url)
      }
    }
  }

  // set app state
  private setAppState (state: string): void {
    this.state = state
  }

  // get app state
  public getAppState (): string {
    return this.state
  }

  // set keep-alive state
  private setKeepAliveState (state: string | null): void {
    this.keepAliveState = state
  }

  // get keep-alive state
  public getKeepAliveState (): string | null {
    return this.keepAliveState
  }

  // is app unmounted
  public isUnmounted (): boolean {
    return appStates.UNMOUNT === this.state
  }

  // is app already hidden
  public isHidden (): boolean {
    return keepAliveStates.KEEP_ALIVE_HIDDEN === this.keepAliveState
  }

  // get umd library, if it not exist, return empty object
  private getUmdLibraryHooks (): Record<string, unknown> {
    // after execScripts, the app maybe unmounted
    if (!this.isUnmounted() && this.sandBox) {
      const libraryName = getRootContainer(this.container!).getAttribute('library') || `micro-app-${this.name}`

      const proxyWindow = this.sandBox.proxyWindow as Record<string, any>

      // compatible with pre versions
      if (isObject(proxyWindow[libraryName])) {
        return proxyWindow[libraryName]
      }

      return {
        mount: proxyWindow.mount,
        unmount: proxyWindow.unmount,
      }
    }

    return {}
  }

  private getMicroAppGlobalHook (eventName: string): Func | null {
    const listener = (this.sandBox?.proxyWindow as Record<string, any>)?.[eventName]
    return isFunction(listener) ? listener : null
  }

  public querySelector (selectors: string): Node | null {
    return this.container ? globalEnv.rawElementQuerySelector.call(this.container, selectors) : null
  }

  public querySelectorAll (selectors: string): NodeListOf<Node> {
    return this.container ? globalEnv.rawElementQuerySelectorAll.call(this.container, selectors) : []
  }
}

// iframe route mode
export function isIframeSandbox (appName: string): boolean {
  return appInstanceMap.get(appName)?.iframe ?? false
}
