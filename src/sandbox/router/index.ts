import type {
  MicroRouter,
  MicroLocation,
} from '@micro-app/types'
import globalEnv from '../../libs/global_env'
import {
  getMicroPathFromURL,
  setMicroPathToURL,
  removeMicroPathFromURL,
  removeMicroState,
  setMicroState,
} from './core'
import {
  createMicroLocation,
  updateMicroLocation,
  autoTriggerNavigationGuard,
} from './location'
import {
  createMicroHistory,
  attachRouteToBrowserURL,
} from './history'
import { createURL } from '../../libs/utils'
import { clearRouterWhenUnmount } from './api'
export { router } from './api'
export { addHistoryListener } from './event'
export { getNoHashMicroPathFromURL } from './core'
export { patchHistory, releasePatchHistory } from './history'

/**
 * TODO: 关于关闭虚拟路由系统的临时笔记
 * 1. with沙箱关闭虚拟路由最好和iframe保持一致
 * 2. default-page无法使用，但是用基座的地址可以实现一样的效果
 * 3. keep-router-state功能失效，因为始终为true
 * 4. 基座控制子应用跳转地址改变，正确的值为：baseRoute + 子应用地址，这要在文档中说明，否则很容易出错，确实也很难理解
 * 5. 是否需要发送popstate事件，为了减小对基座的影响，现在不发送
 * 6. 关闭后导致的vue3路由冲突问题需要在文档中明确指出(2处：在关闭虚拟路由系统的配置那里着重说明，在vue常见问题中说明)
 */
/**
 * The router system has two operations: read and write
 * Read through location and write through history & location
 * @param appName app name
 * @param url app url
 * @returns MicroRouter
 */
export function createMicroRouter (appName: string, url: string): MicroRouter {
  const microLocation = createMicroLocation(appName, url)
  return {
    microLocation,
    microHistory: createMicroHistory(appName, microLocation),
  }
}

/**
 * When the sandbox executes start, or the hidden keep-alive application is re-rendered, the location is updated according to the browser url or attach router info to browser url
 * @param appName app.name
 * @param microLocation MicroLocation for sandbox
 * @param defaultPage default page
 */
export function initRouteStateWithURL (
  appName: string,
  microLocation: MicroLocation,
  defaultPage?: string,
): void {
  const microPath = getMicroPathFromURL(appName)
  if (microPath) {
    updateMicroLocation(appName, microPath, microLocation, 'auto')
  } else {
    updateBrowserURLWithLocation(appName, microLocation, defaultPage)
  }
}

/**
 * initialize browser information according to microLocation
 * Scenes:
 *  1. sandbox.start
 *  2. reshow of keep-alive app
 */
export function updateBrowserURLWithLocation (
  appName: string,
  microLocation: MicroLocation,
  defaultPage?: string,
): void {
  // update microLocation with defaultPage
  if (defaultPage) updateMicroLocation(appName, defaultPage, microLocation, 'prevent')
  // attach microApp route info to browser URL
  attachRouteToBrowserURL(
    appName,
    setMicroPathToURL(appName, microLocation),
    setMicroState(
      appName,
      null,
    ),
  )
  // trigger guards after change browser URL
  autoTriggerNavigationGuard(appName, microLocation)
}

/**
 * In any case, microPath & microState will be removed from browser, but location will be initialized only when keep-router-state is false
 * @param appName app name
 * @param url app url
 * @param microLocation location of microApp
 * @param keepRouteState keep-router-state is only used to control whether to clear the location of microApp
 */
export function clearRouteStateFromURL (
  appName: string,
  url: string,
  microLocation: MicroLocation,
  keepRouteState: boolean,
): void {
  if (!keepRouteState) {
    const { pathname, search, hash } = createURL(url)
    updateMicroLocation(appName, pathname + search + hash, microLocation, 'prevent')
  }
  removePathFromBrowser(appName)
  clearRouterWhenUnmount(appName)
}

/**
 * remove microState from history.state and remove microPath from browserURL
 * called on sandbox.stop or hidden of keep-alive app
 */
export function removePathFromBrowser (appName: string): void {
  attachRouteToBrowserURL(
    appName,
    removeMicroPathFromURL(appName),
    removeMicroState(appName, globalEnv.rawWindow.history.state),
  )
}
