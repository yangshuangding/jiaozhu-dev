import type {
  microAppWindowType,
  CommonEffectHook,
  MicroEventListener,
  timeInfo,
} from '@micro-app/types'
import globalEnv from '../../libs/global_env'
import { formatEventName } from '../adapter'

/**
 * Rewrite side-effect events
 * @param microAppWindow micro window
 */
export function patchWindowEffect (
  appName: string,
  microAppWindow: microAppWindowType,
): CommonEffectHook {
  const eventListenerMap = new Map<string, Set<MicroEventListener>>()
  const sstEventListenerMap = new Map<string, Set<MicroEventListener>>()
  const intervalIdMap = new Map<number, timeInfo>()
  const timeoutIdMap = new Map<number, timeInfo>()
  const {
    rawWindow,
    rawAddEventListener,
    rawRemoveEventListener,
    rawSetInterval,
    rawSetTimeout,
    rawClearInterval,
    rawClearTimeout,
  } = globalEnv

  // TODO: listener 是否需要绑定microAppWindow，否则函数中的this指向原生window
  // listener may be null, e.g test-passive
  microAppWindow.addEventListener = function (
    type: string,
    listener: MicroEventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    type = formatEventName(type, appName)
    const listenerList = eventListenerMap.get(type)
    if (listenerList) {
      listenerList.add(listener)
    } else {
      eventListenerMap.set(type, new Set([listener]))
    }
    listener && (listener.__MICRO_APP_MARK_OPTIONS__ = options)
    rawAddEventListener.call(rawWindow, type, listener, options)
  }

  microAppWindow.removeEventListener = function (
    type: string,
    listener: MicroEventListener,
    options?: boolean | AddEventListenerOptions,
  ): void {
    type = formatEventName(type, appName)
    const listenerList = eventListenerMap.get(type)
    if (listenerList?.size && listenerList.has(listener)) {
      listenerList.delete(listener)
    }
    rawRemoveEventListener.call(rawWindow, type, listener, options)
  }

  microAppWindow.setInterval = function (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): number {
    const intervalId = rawSetInterval.call(rawWindow, handler, timeout, ...args)
    intervalIdMap.set(intervalId, { handler, timeout, args })
    return intervalId
  }

  microAppWindow.setTimeout = function (
    handler: TimerHandler,
    timeout?: number,
    ...args: any[]
  ): number {
    const timeoutId = rawSetTimeout.call(rawWindow, handler, timeout, ...args)
    timeoutIdMap.set(timeoutId, { handler, timeout, args })
    return timeoutId
  }

  microAppWindow.clearInterval = function (intervalId: number) {
    intervalIdMap.delete(intervalId)
    rawClearInterval.call(rawWindow, intervalId)
  }

  microAppWindow.clearTimeout = function (timeoutId: number) {
    timeoutIdMap.delete(timeoutId)
    rawClearTimeout.call(rawWindow, timeoutId)
  }

  // reset snapshot data
  const reset = (): void => {
    sstEventListenerMap.clear()
  }

  /**
   * NOTE:
   *  1. about timer(events & properties should record & rebuild at all modes, exclude default mode)
   *  2. record maybe call twice when unmount prerender, keep-alive app manually with umd mode
   * 4 modes: default-mode、umd-mode、prerender、keep-alive
   * Solution:
   *  1. default-mode(normal): clear events & timers, not record & rebuild anything
   *  2. umd-mode(normal): not clear timers, record & rebuild events
   *  3. prerender/keep-alive(default, umd): not clear timers, record & rebuild events
   */
  const record = (): void => {
    // record window event
    eventListenerMap.forEach((listenerList, type) => {
      if (listenerList.size) {
        const cacheList = sstEventListenerMap.get(type) || []
        sstEventListenerMap.set(type, new Set([...cacheList, ...listenerList]))
      }
    })
  }

  // rebuild event and timer before remount app
  const rebuild = (): void => {
    // rebuild window event
    sstEventListenerMap.forEach((listenerList, type) => {
      for (const listener of listenerList) {
        microAppWindow.addEventListener(type, listener, listener?.__MICRO_APP_MARK_OPTIONS__)
      }
    })

    reset()
  }

  // release all event listener & interval & timeout when unmount app
  const release = (clearTimer: boolean): void => {
    // Clear window binding events
    if (eventListenerMap.size) {
      eventListenerMap.forEach((listenerList, type) => {
        for (const listener of listenerList) {
          rawRemoveEventListener.call(rawWindow, type, listener)
        }
      })
      eventListenerMap.clear()
    }

    // default mode(not keep-alive or isPrerender)
    if (clearTimer) {
      intervalIdMap.forEach((_, intervalId: number) => {
        rawClearInterval.call(rawWindow, intervalId)
      })

      timeoutIdMap.forEach((_, timeoutId: number) => {
        rawClearTimeout.call(rawWindow, timeoutId)
      })

      intervalIdMap.clear()
      timeoutIdMap.clear()
    }
  }

  return {
    reset,
    record,
    rebuild,
    release,
  }
}
