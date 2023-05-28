import type { prefetchParamList, prefetchParam, globalAssetsType } from '@micro-app/types'
import type { SourceCenter as SourceCenterType } from './source/source_center'
import CreateApp, { appInstanceMap } from './create_app'
import {
  requestIdleCallback,
  formatAppURL,
  formatAppName,
  promiseStream,
  logError,
  isBrowser,
  isArray,
  isPlainObject,
  isString,
  isFunction,
  promiseRequestIdle,
  isNumber,
} from './libs/utils'
import { fetchSource } from './source/fetch'
import sourceCenter from './source/source_center'
import microApp from './micro_app'
import { PREFETCH_LEVEL } from './constants'

/**
 * preFetch([
 *  {
 *    name: string,
 *    url: string,
 *    iframe: boolean,
 *    inline: boolean,
 *    'disable-scopecss': boolean,
 *    'disable-sandbox': boolean,
 *    level: number,
 *    'default-page': string,
 *    'disable-patch-request': boolean,
 *  },
 *  ...
 * ])
 * Note:
 *  1: preFetch is async and is performed only when the browser is idle
 *  2: options of prefetch preferably match the config of the micro-app element, although this is not required
 * @param apps micro app options
 * @param delay delay time
 */
export default function preFetch (apps: prefetchParamList, delay?: number): void {
  if (!isBrowser) {
    return logError('preFetch is only supported in browser environment')
  }

  requestIdleCallback(() => {
    const delayTime = isNumber(delay) ? delay : microApp.options.prefetchDelay

    /**
     * TODO: remove setTimeout
     * Is there a better way?
     */
    setTimeout(() => {
      // releasePrefetchEffect()
      preFetchInSerial(apps)
    }, isNumber(delayTime) ? delayTime : 3000)
  })

  // const handleOnLoad = (): void => {
  //   releasePrefetchEffect()
  //   requestIdleCallback(() => {
  //     preFetchInSerial(apps)
  //   })
  // }

  // const releasePrefetchEffect = (): void => {
  //   window.removeEventListener('load', handleOnLoad)
  //   clearTimeout(preFetchTime)
  // }

  // window.addEventListener('load', handleOnLoad)
}

function preFetchInSerial (apps: prefetchParamList): void {
  isFunction(apps) && (apps = apps())

  if (isArray(apps)) {
    apps.reduce((pre, next) => pre.then(() => preFetchAction(next)), Promise.resolve())
  }
}

// sequential preload app
function preFetchAction (options: prefetchParam): Promise<void> {
  return promiseRequestIdle((resolve: PromiseConstructor['resolve']) => {
    if (isPlainObject(options) && navigator.onLine) {
      options.name = formatAppName(options.name)
      options.url = formatAppURL(options.url, options.name)
      if (options.name && options.url && !appInstanceMap.has(options.name)) {
        const app = new CreateApp({
          name: options.name,
          url: options.url,
          isPrefetch: true,
          scopecss: !(options['disable-scopecss'] ?? options.disableScopecss ?? microApp.options['disable-scopecss']),
          useSandbox: !(options['disable-sandbox'] ?? options.disableSandbox ?? microApp.options['disable-sandbox']),
          inline: options.inline ?? microApp.options.inline,
          iframe: options.iframe ?? microApp.options.iframe,
          prefetchLevel: options.level && PREFETCH_LEVEL.includes(options.level) ? options.level : microApp.options.prefetchLevel && PREFETCH_LEVEL.includes(microApp.options.prefetchLevel) ? microApp.options.prefetchLevel : 2,
        })

        const oldOnload = app.onLoad
        const oldOnLoadError = app.onLoadError
        app.onLoad = (html: HTMLElement): void => {
          resolve()
          oldOnload.call(app, html, options['default-page'], options['disable-patch-request'])
        }

        app.onLoadError = (...rests): void => {
          resolve()
          oldOnLoadError.call(app, ...rests)
        }
      } else {
        resolve()
      }
    } else {
      resolve()
    }
  })
}

/**
 * load global assets into cache
 * @param assets global assets of js, css
 */
export function getGlobalAssets (assets: globalAssetsType): void {
  if (isPlainObject(assets)) {
    requestIdleCallback(() => {
      fetchGlobalResources(assets.js, 'js', sourceCenter.script)
      fetchGlobalResources(assets.css, 'css', sourceCenter.link)
    })
  }
}

// TODO: requestIdleCallback for every file
function fetchGlobalResources (resources: string[] | void, suffix: string, sourceHandler: SourceCenterType['link'] | SourceCenterType['script']) {
  if (isArray(resources)) {
    const effectiveResource = resources!.filter((path) => isString(path) && path.includes(`.${suffix}`) && !sourceHandler.hasInfo(path))

    const fetchResourcePromise = effectiveResource.map((path) => fetchSource(path))

    // fetch resource with stream
    promiseStream<string>(fetchResourcePromise, (res: {data: string, index: number}) => {
      const path = effectiveResource[res.index]
      if (suffix === 'js') {
        if (!sourceHandler.hasInfo(path)) {
          sourceHandler.setInfo(path, {
            code: res.data,
            isExternal: false,
            appSpace: {},
          })
        }
      } else {
        if (!sourceHandler.hasInfo(path)) {
          (sourceHandler as SourceCenterType['link']).setInfo(path, {
            code: res.data,
            appSpace: {}
          })
        }
      }
    }, (err: {error: Error, index: number}) => {
      logError(err)
    })
  }
}
