declare module '@micro-app/types' {
  type AttrType = string | null

  type NormalKey = string | number

  type Func = (...rest: any[]) => void

  type microAppWindowType = Window & any

  type AppName = string

  type SourceAddress = string

  type AttrsType = Map<string, string>

  type RequestIdleCallbackOptions = {
    timeout: number
  }

  type RequestIdleCallbackInfo = {
    readonly didTimeout: boolean
    timeRemaining: () => number
  }

  type fiberTasks = Array<() => Promise<void>> | null

  type MicroEventListener = EventListenerOrEventListenerObject & Record<string, any>

  type timeInfo = {
    handler: TimerHandler,
    timeout?: number,
    args: any[],
  }

  interface MicroAppElementTagNameMap extends HTMLElementTagNameMap {
    'micro-app': any,
  }

  interface CommonEffectHook {
    reset(): void
    record(): void
    rebuild(): void
    release(clearTimer?: boolean): void
  }

  interface SandBoxStartParams {
    umdMode: boolean
    baseroute: string
    useMemoryRouter: boolean
    defaultPage: string
    disablePatchRequest: boolean
  }

  interface SandBoxStopParams {
    umdMode: boolean
    keepRouteState: boolean
    destroy: boolean
    clearData: boolean
    useMemoryRouter: boolean
  }

  interface releaseGlobalEffectParams {
    umdMode?: boolean,
    clearData?: boolean,
    isPrerender?: boolean,
    keepAlive?: boolean,
    destroy?: boolean,
  }

  interface WithSandBoxInterface {
    proxyWindow: WindowProxy
    microAppWindow: Window // Proxy target
    start (startParams: SandBoxStartParams): void
    stop (stopParams: SandBoxStopParams): void
    recordAndReleaseEffect (options: releaseGlobalEffectParams, preventRecord?: boolean): void
    // reset effect snapshot data
    resetEffectSnapshot(): void
    // record umd snapshot before the first execution of umdHookMount
    recordEffectSnapshot (): void
    // rebuild umd snapshot before remount umd app
    rebuildEffectSnapshot (): void
    releaseGlobalEffect (options: releaseGlobalEffectParams): void
    setRouteInfoForKeepAliveApp (): void
    removeRouteInfoForKeepAliveApp (): void
    setPreRenderState (state: boolean): void
    markUmdMode(state: boolean): void
    patchStaticElement (container: Element | ShadowRoot): void
    actionBeforeExecScripts (container: Element | ShadowRoot): void
    deleteIframeElement? (): void
  }

  interface SandBoxAdapter {
    // Variables that can only assigned to rawWindow
    escapeSetterKeyList: PropertyKey[]

    // Variables that can escape to rawWindow
    staticEscapeProperties: PropertyKey[]

    // Variables that scoped in child app
    staticScopeProperties: PropertyKey[]

    // adapter for react
    // injectReactHMRProperty (): void
  }

  type LinkSourceInfo = {
    code: string, // source code
    appSpace: Record<string, {
      attrs: Map<string, string>, // active element.attributes
      placeholder?: Comment | null, // placeholder comment
      parsedCode?: string, // parsed code
      prefix?: string, // micro-app[name=appName]
    }>
  }

  type ScriptSourceInfo = {
    code: string, // source code
    isExternal: boolean, // external script
    appSpace: Record<string, {
      async: boolean, // async script
      defer: boolean, // defer script
      module: boolean, // module type script
      inline: boolean, // run js with inline script
      pure: boolean, // pure script
      attrs: Map<string, string>, // element attributes
      parsedCode?: string, // bind code
      parsedFunction?: Function | null, // code to function
      sandboxType?: 'with' | 'iframe' | 'disable' // sandbox type (with, iframe, disable)
    }>
  }

  type sourceType = {
    html: HTMLElement | null, // html address
    links: Set<string>, // style/link address list
    scripts: Set<string>, // script address list
  }

  interface MountParam {
    container: HTMLElement | ShadowRoot // app container
    inline: boolean // run js in inline mode
    useMemoryRouter: boolean // use virtual router
    defaultPage: string // default page of virtual router
    baseroute: string // route prefix, default is ''
    disablePatchRequest: boolean // prevent rewrite request method of child app
    fiber: boolean // run js in fiber mode
    // hiddenRouter: boolean
  }

  interface UnmountParam {
    destroy: boolean, // completely destroy, delete cache resources
    clearData: boolean // clear data of dateCenter
    keepRouteState: boolean // keep route state when unmount, default is false
    unmountcb?: CallableFunction // callback of unmount
  }

  // app instance
  interface AppInterface extends Pick<ParentNode, 'querySelector' | 'querySelectorAll'> {
    source: sourceType // source list
    // TODO: 去掉any
    sandBox: WithSandBoxInterface | null | any // sandbox
    name: string // app name
    url: string // app url
    scopecss: boolean // whether use css scoped, default is true
    useSandbox: boolean // whether use js sandbox, default is true
    inline: boolean //  whether js runs in inline script mode, default is false
    iframe: boolean // use iframe sandbox
    ssrUrl: string // html path in ssr mode
    container: HTMLElement | ShadowRoot | null // container maybe null, micro-app, shadowRoot, div(keep-alive)
    umdMode: boolean // is umd mode
    fiber: boolean // fiber mode
    useMemoryRouter: boolean // use virtual router
    isPrefetch: boolean // whether prefetch app, default is false
    isPrerender: boolean
    prefetchLevel?: number
    // defaultPage: string // default page when mount
    // baseroute: string // route prefix, default is ''
    // hiddenRouter: boolean // hide router info of child from browser url

    // Load resources
    loadSourceCode (): void

    // resource is loaded
    onLoad (html: HTMLElement, defaultPage?: string, disablePatchRequest?: boolean): void

    // Error loading HTML
    onLoadError (e: Error): void

    // mount app
    mount (mountParams: MountParam): void

    // unmount app
    unmount (unmountParam: UnmountParam): void

    // app rendering error
    onerror (e: Error): void

    // get app state
    getAppState (): string

    // get keep-alive state
    getKeepAliveState(): string | null

    // is app unmounted
    isUnmounted (): boolean

    // is app already hidden
    isHidden (): boolean

    // actions for completely destroy
    actionsForCompletelyDestroy (): void

    // hidden app when disconnectedCallback with keep-alive
    hiddenKeepAliveApp (callback?: CallableFunction): void

    // show app when connectedCallback with keep-alive
    showKeepAliveApp (container: HTMLElement | ShadowRoot): void
  }

  interface MicroAppElementType {
    appName: AttrType // app name
    appUrl: AttrType // app url

    // Hooks for element append to documents
    connectedCallback (): void

    // Hooks for element delete from documents
    disconnectedCallback (): void

    // Hooks for element attributes change
    attributeChangedCallback (a: 'name' | 'url', o: string, n: string): void
  }

  interface prefetchParam {
    name: string,
    url: string,
    // old config 👇
    disableScopecss?: boolean
    disableSandbox?: boolean
    // old config 👆
    'disable-scopecss'?: boolean
    'disable-sandbox'?: boolean
    inline?: boolean
    iframe?: boolean
    level?: number
    'default-page'?: string
    'disable-patch-request'?: boolean
  }

  // prefetch params
  type prefetchParamList = Array<prefetchParam> | (() => Array<prefetchParam>)

  // lifeCycles
  interface lifeCyclesType {
    created(e: CustomEvent): void
    beforemount(e: CustomEvent): void
    mounted(e: CustomEvent): void
    unmount(e: CustomEvent): void
    error(e: CustomEvent): void
    beforeshow(e: CustomEvent): void
    aftershow(e: CustomEvent): void
    afterhidden(e: CustomEvent): void
  }

  type AssetsChecker = (url: string) => boolean;

  type plugins = {
    // global plugin
    global?: Array<{
      // Scoped global Properties
      scopeProperties?: Array<PropertyKey>
      // Properties that can be escape to rawWindow
      escapeProperties?: Array<PropertyKey>
      // Exclude JS or CSS
      excludeChecker?: AssetsChecker
      // Ignore JS or CSS
      ignoreChecker?: AssetsChecker
      // options for plugin as the third parameter of loader
      options?: Record<string, unknown>
      // handle function
      loader?: (code: string, url: string) => string
      // html processor
      processHtml?: (code: string, url: string) => string
    }>

    // plugin for special app
    modules?: {
      [name: string]: Array<{
        // Scoped global Properties
        scopeProperties?: Array<PropertyKey>
        // Properties that can be escape to rawWindow
        escapeProperties?: Array<PropertyKey>
        // Exclude JS or CSS
        excludeChecker?: AssetsChecker
        // Ignore JS or CSS
        ignoreChecker?: AssetsChecker
        // options for plugin as the third parameter of loader
        options?: Record<string, unknown>
        // handle function
        loader?: (code: string, url: string) => string
        // html processor
        processHtml?: (code: string, url: string) => string
      }>
    }
  }

  type GetActiveAppsParam = {
    excludeHiddenApp?: boolean,
    excludePreRender?: boolean,
  }

  type fetchType = (url: string, options: Record<string, unknown>, appName: string | null) => Promise<string>

  type globalAssetsType = {
    js?: string[],
    css?: string[],
  }

  interface MicroAppConfig {
    shadowDOM?: boolean
    destroy?: boolean
    destory?: boolean
    inline?: boolean
    // old config 👇
    disableScopecss?: boolean
    disableSandbox?: boolean
    // old config 👆
    'disable-scopecss'?: boolean
    'disable-sandbox'?: boolean
    'disable-memory-router'?: boolean
    'disable-patch-request'?: boolean
    'keep-router-state'?: boolean
    'hidden-router'?: boolean
    'keep-alive'?: boolean
    'clear-data'?: boolean
    'router-mode'?: string
    iframe?: boolean
    ssr?: boolean
    fiber?: boolean
    prefetchLevel?: number
    prefetchDelay?: number
  }

  interface OptionsType extends MicroAppConfig {
    tagName?: string
    lifeCycles?: lifeCyclesType
    preFetchApps?: prefetchParamList
    plugins?: plugins
    fetch?: fetchType
    globalAssets?: globalAssetsType,
    excludeAssetFilter?: (assetUrl: string) => boolean
    getRootElementParentNode?: (node: Node, appName: AppName) => void
  }

  // MicroApp config
  interface MicroAppBaseType {
    tagName: string
    options: OptionsType
    preFetch(apps: prefetchParamList): void
    router: Router // eslint-disable-line
    start(options?: OptionsType): void
  }

  // special CallableFunction for interact
  type CallableFunctionForInteract = CallableFunction & { __APP_NAME__?: string, __AUTO_TRIGGER__?: boolean }

  type PopStateListener = (this: Window, e: PopStateEvent) => void
  type MicroPopStateEvent = PopStateEvent & { onlyForBrowser?: boolean }

  interface MicroLocation extends Location, URL {
    fullPath: string
    [key: string]: any
  }

  type MicroHistory = ProxyHandler<History>
  type MicroState = any
  type HistoryProxyValue =
    Pick<
    History,
    'length' |
    'scrollRestoration' |
    'state' |
    'back' |
    'forward' |
    'go' |
    'pushState' |
    'replaceState'
    > | CallableFunction
  interface MicroRouter {
    microLocation: MicroLocation
    microHistory: MicroHistory
  }
  type LocationQueryValue = string | null
  type LocationQueryObject = Record<
  string,
  LocationQueryValue | LocationQueryValue[]
  >

  type LocationQuery = {
    hashQuery?: LocationQueryObject,
    searchQuery?: LocationQueryObject
  }

  type GuardLocation = Record<keyof MicroLocation, any>

  type CurrentRoute = Map<string, GuardLocation>

  interface RouterTarget {
    name: string
    path: string
    state?: unknown
    replace?: boolean
  }

  type navigationMethod = (to: RouterTarget) => void

  interface AccurateGuard {
    [appName: string]: (to: GuardLocation, from: GuardLocation) => void
  }

  type GlobalNormalGuard = ((to: GuardLocation, from: GuardLocation, appName: string) => void)

  type RouterGuard = AccurateGuard | GlobalNormalGuard

  type SetDefaultPageOptions = {
    name: string,
    path: string,
  }

  type AttachAllToURLParam = {
    includeHiddenApp?: boolean,
    includePreRender?: boolean,
  }

  // Router API for developer
  interface Router {
    // current route of all apps
    readonly current: CurrentRoute
    /**
     * encodeURI of microApp path
     * @param path url path
     */
    encode(path: string): string
    /**
     * decodeURI of microApp path
     * @param path url path
     */
    decode(path: string): ReturnType<Router['encode']>
    /**
     * Navigate to a new URL by pushing an entry in the history
     * stack.
     * @param to - Route location to navigate to
     */
    push: navigationMethod
    /**
     * Navigate to a new URL by replacing the current entry in
     * the history stack.
     *
     * @param to - Route location to navigate to
     */
    replace: navigationMethod
    /**
     * Move forward or backward through the history. calling `history.go()`.
     *
     * @param delta - The position in the history to which you want to move,
     * relative to the current page
     */
    go: Func
    /**
     * Go back in history if possible by calling `history.back()`.
     */
    back: Func
    /**
     * Go forward in history if possible by calling `history.forward()`.
     */
    forward: Func
    /**
     * Add a navigation guard that executes before any navigation
     * @param guard global hook for
     */
    beforeEach(guard: RouterGuard): () => boolean
    /**
     * Add a navigation guard that executes after any navigation
     * @param guard global hook for
     */
    afterEach(guard: RouterGuard): () => boolean
    /**
     * Add defaultPage to control the first rendered page
     * @param options SetDefaultPageOptions
     */
    setDefaultPage(options: SetDefaultPageOptions): () => boolean
    /**
     * Clear data of defaultPage that set by setDefaultPage
     */
    removeDefaultPage(appName: string): boolean
    /**
     * Get defaultPage that set by setDefaultPage
     */
    getDefaultPage(key: PropertyKey): string | void
    /**
     * Attach specified active app router info to browser url
     */
    attachToURL(appName: string): void
    /**
     * Attach all active app router info to browser url
     */
    attachAllToURL(options: AttachAllToURLParam): void
    /**
     * Record base app router, let child app control base app navigation
     * It is global data
     * @param baseRouter router instance of base app
     */
    setBaseAppRouter(baseRouter: unknown): void
    /**
     * get baseRouter from cache
     */
    getBaseAppRouter(): unknown
  }

  // result of add/remove microApp path on browser url
  type HandleMicroPathResult = {
    fullPath: string,
    isAttach2Hash: boolean,
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'micro-app': any
  }
}

declare module '@micro-zoe/micro-app/polyfill/jsx-custom-event'

declare const __DEV__: boolean

declare const __TEST__: boolean
