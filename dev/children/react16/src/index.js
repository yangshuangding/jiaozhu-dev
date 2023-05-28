/* eslint-disable */
// import './public-path'
// import 'babel-polyfill'
// import '@babel/polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
import './ant-custom.css'; // 自定义antd class前缀
import './index.css';
import Router from './router';
import { Modal, notification, ConfigProvider } from 'antd';
import subMicroApp from '@micro-zoe/micro-app';
// import './flexible';
// import '@alifd/next/dist/next.css';
// import { atan2 } from 'mathjs' // 卡死

// 循环内嵌
subMicroApp.start({
  tagName: 'micro-app-sub'
})

ConfigProvider.config({
  prefixCls: 'react16',
})

// 数据监听
window.microApp?.addDataListener((data) => {
  console.log('react16 来自基座应用的数据', data)
  notification.open({
    message: '来自基座应用的数据',
    description: JSON.stringify(data),
    duration: 1,
  })
  return { listen: 'from index.js' }
}, true)

function handleGlobalData(data) {
  console.log('子应用react16: 来自全局数据')
  Modal.info({
    title: '子应用react16: 来自全局数据',
    content: (
      <div>
        <p>{JSON.stringify(data)}</p>
      </div>
    ),
    onOk() {},
  });

  return {
    msg: '子应用接收全局数据成功'
  }
}

// 全局数据监听
window.microApp?.addGlobalDataListener(handleGlobalData);

// 监听keep-alive模式下的app状态
window.addEventListener('appstate-change', function (e) {
  console.log('子应用内部console.log -- keep-alive app 状态：', e.detail.appState);
})

/* ----------------------分割线-默认模式--------------------- */
// ReactDOM.render(
//   <React.StrictMode>
//     <ConfigProvider prefixCls="react16">
//       <Router />
//     </ConfigProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // 注册unmount函数，卸载时会自动执行
// window.unmount = () => {
//   ReactDOM.unmountComponentAtNode(document.getElementById('root'));
//   console.log('微应用react16卸载了 -- 默认模式');
// }

// console.timeEnd('react#16');

/* ----------------------分割线-umd模式--------------------- */
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = (data) => {
  ReactDOM.render(
    <React.StrictMode>
      {/* 自定义antd class前缀 */}
      <ConfigProvider prefixCls="react16">
        <Router />
      </ConfigProvider>
    </React.StrictMode>,
    document.getElementById('root')
  );
  console.log('微应用react16渲染了 -- UMD模式', data);
  console.timeEnd('react#16');
}

// 👇 将卸载操作放入 unmount 函数
window.unmount = (data) => {
  // 卸载时关闭弹窗
  notification.destroy()
  ReactDOM.unmountComponentAtNode(document.getElementById('root'));
  console.log('微应用react16卸载了 -- UMD模式', data);
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount()
}

/* ---------------------- micro-app 自定义全局事件 --------------------- */

window.onmount = (data) => {
  // throw new Error('sfsdfsf')
  console.log('子应用 window.onmount 事件', data)
}

window.onunmount = () => {
  // throw new Error('sfsdfsf')
  console.log('子应用 window.onunmount 事件')
}

/* ---------------------- 全局事件 --------------------- */
// document.addEventListener('click', function () {
//   console.log(`子应用${window.__MICRO_APP_NAME__}内部的document.addEventListener绑定`)
//   // console.log(this)
// }, false)

// document.onclick = function () {
//   console.log(`子应用${window.__MICRO_APP_NAME__}内部的document.onclick绑定`)
//   // console.log(this)
// }

// window.addEventListener('click', function () {
//   console.log(`子应用${window.__MICRO_APP_NAME__}内部的window.addEventListener绑定`)
//   // console.log(this)
// }, false)

// 测试主动卸载预渲染、隐藏keep-alive应用，事件快照重复执行的问题
// setTimeout(() => {
//   console.log('5秒钟倒计时结束')

//   window.addEventListener('click', function () {
//     console.log(`在定时器内部的window.addEventListener(click)`)
//   }, false)

//   document.addEventListener('click', function () {
//     console.log(`在定时器内部的document.addEventListener(click)`)
//   }, false)

//   document.onclick = '1111'

//   window.microApp?.addDataListener((data) => {
//     console.log('在定时器内部的数据监听函数：', data)
//   }, true)
// }, 5000);


/* ---------------------- 定时器 --------------------- */
// setInterval(() => {
//   console.log(`子应用${window.__MICRO_APP_NAME__}的setInterval`)
// }, 5000)

// setTimeout(() => {
//   console.log(`子应用${window.__MICRO_APP_NAME__}的setTimeout`)
// }, 5000);


/* ---------------------- 创建元素 --------------------- */
// const dynamicScript1 = document.createElement('script')
// // dynamicScript1.setAttribute('type', 'module')
// // dynamicScript1.textContent = 'console.warn('inline module')'
// dynamicScript1.setAttribute('src', '//127.0.0.1:8080/js/test.js')
// dynamicScript1.onload = () => {
//   console.log('动态module加载完成了')
// }
// document.head.appendChild(dynamicScript1)

// const dynamicStyle = document.createElement('style')
// document.head.appendChild(dynamicStyle)
// dynamicStyle.textContent = '.test-class { color: red } '

// // test excludeAssetFilter
// const dynamicScript2 = document.createElement('script')
// dynamicScript2.setAttribute('src', 'http://127.0.0.1:8080/js/defer.js')
// dynamicScript2.setAttribute('defer', 'true')
// document.body.appendChild(dynamicScript2)

// const link1 = document.createElement('link')
// link1.setAttribute('href', 'http://127.0.0.1:8080/facefont.css')
// document.head.appendChild(link1)

// 测试 micro-app-body 顶层元素parentNode指向 document.body
// const dynamicDiv1 = document.createElement('div')
// dynamicDiv1.innerHTML = '测试parentNode'
// document.body.appendChild(dynamicDiv1)

// setTimeout(() => {
//   console.assert(dynamicDiv1.parentNode === document.body)
//   dynamicDiv1.parentNode.removeChild(dynamicDiv1)
// }, 5000);

// -- 测试 Element.prototype.insertAdjacentElement -- 开始
const dynamicStyle2 = document.createElement('style')
dynamicStyle2.textContent = '.test-insertAdjacentElement { color: red; }'
document.head.appendChild(dynamicStyle2)

const dynamicStyle3 = document.createElement('style')
dynamicStyle3.textContent = '.test-insertAdjacentElement { color: green; }'
dynamicStyle2.insertAdjacentElement('afterend', dynamicStyle3)

document.head.insertAdjacentElement('afterbegin', dynamicStyle3)

const dynamicScript3 = document.createElement('script')
dynamicScript3.setAttribute('inline', 'true')
dynamicScript3.textContent = `console.log('test insertAdjacentElement')`
dynamicStyle2.insertAdjacentElement('afterend', dynamicScript3)

document.head.insertAdjacentElement('afterbegin', dynamicScript3)
// -- 测试 Element.prototype.insertAdjacentElement -- 结束

// -- 测试 Element.prototype.append -- 开始
// document.body.append(1, '2', '<div>111</div>')
// document.body.prepend(1, '2', '<div>111</div>')
// -- 测试 Element.prototype.append -- 结束


/* ---------------------- 全局变量 --------------------- */
// console.log('__micro_app_environment__', window.__micro_app_environment__)
// console.log('__micro_app_name__', window.__micro_app_name__)
// console.log('__full_public_path__', window.__full_public_path__)
// console.log('baseurl', window.baseurl)


/* ---------------------- DOMParser --------------------- */
// // BUG TEST: https://github.com/micro-zoe/micro-app/issues/56
// const parser = new DOMParser()
// const htmlString = `
// <div>
//   <span id='parser-id'></span>
//   <span class='parser-class'></span>
//   <i name='parser-name'></i>
// </div>
// `

// const doc = parser.parseFromString(htmlString, 'text/html')

// console.log(
//   'DOMParser querySelector',
//   doc.querySelector('#parser-id') instanceof Node,
//   doc.querySelector('#parser-id'),
//   doc.getElementById('parser-id'),
//   doc.querySelectorAll('span'),
//   doc.getElementsByClassName('parser-class'),
//   doc.getElementsByTagName('span'),
//   doc.getElementsByName('parser-name'),
// )

// setTimeout(() => {
//   const d1 = doc.createElement('div')
//   const d2 = doc.createElementNS('http://www.w3.org/1999/xhtml', 'svg')
//   const d3 = doc.createDocumentFragment()

//   console.log('DOMParser createElement', d1, d2, d3)
// }, 3000)


/* ---------------------- Image --------------------- */
// const newImg = new Image()
// newImg.src = '/micro-app/react16/static/media/logo.6ce24c58.svg'
// document.body.appendChild(newImg)
// newImg.setAttribute('width', '50px')


/* ---------------------- cloneNode --------------------- */
// var img2 = newImg.cloneNode(true)
// document.body.appendChild(img2)


/* ---------------------- requestAnimationFrame --------------------- */
// requestAnimationFrame(() => {
//   console.log(444444)
// })

/* ---------------------- 声明全局变量 --------------------- */
// window.abc222 = function () {
//   console.log(33333333, this)
// }

// window.abc222()

// abc222() // eslint-disable-line


/* ---------------------- window特有变量 --------------------- */
// console.log(
//   66666,
//   window.hasOwnProperty('microApp'),
//   window.top,
//   window.parent,
//   window.window,
//   window.self,
//   window.globalThis,
// )


/* ---------------------- 测试defineProperty定义全局变量(清空、恢复) --------------------- */
// Object.defineProperty(window, 'aaa', {
//   value: 111,
// })
// console.log(55555555, this, aaa) // eslint-disable-line


/* ---------------------- 接口相关 --------------------- */
/**
 * 基座和子应用都设置了/sugrec的代理，两者都可以正常拿到数据
 * 但是当走子应用的代理时，headers信息只能拿到 content-length 和 content-type
 * 走基座的代理时，可以拿到所有的headers头信息
 * 子应用：/sugrec，默认补全为 http://localhost:3001/sugrec
 * 主应用：http://localhost:3000/sugrec
 */
if (process.env.NODE_ENV !== 'production') {
  fetch('/sugrec').then((res) => {
    res.headers.forEach(function(val, key) { console.log('response.headers: ', key + ': ' + val) })
    return res.json()
  }).then((data) => {
    console.log('proxy代理 https://www.baidu.com/sugrec 返回数据', data)
  })
}


/* ---------------------- 插件相关 --------------------- */
window.scopeKey1 = 'scopeKey1'
window.scopeKey2 = 'scopeKey2'
window.scopeKey3 = 'scopeKey3'
window.scopeKey4 = 'scopeKey4'
window.scopeKey5 = 'scopeKey5'
window.scopeKey6 = 'scopeKey6'

window.escapeKey1 = 'escapeKey1'
window.escapeKey2 = 'escapeKey2'
window.escapeKey3 = 'escapeKey3'
window.escapeKey4 = 'escapeKey4'
window.escapeKey5 = 'escapeKey5' // should be undefined in rawWindow
window.escapeKey6 = 'escapeKey6' // should be undefined in rawWindow


// console.log('scopeProperties scopeKeySpe: ', scopeKeySpe)
// console.log('scopeProperties window.scopeKeySpe: ', window.scopeKeySpe)

// console.log('scopeProperties Vue: ', Vue)
// console.log('scopeProperties window.Vue: ', window.Vue)

// window.Vue = Vue ? Vue : 'child Vue'

// console.log('scopeProperties Vue: ', Vue)
// console.log('scopeProperties window.Vue: ', window.Vue)



/* ---------------------- pureCreateElement & removeDomScope --------------------- */
if (window.__MICRO_APP_ENVIRONMENT__) {
  const unBoundDom1 = window.microApp.pureCreateElement('div')
  unBoundDom1.innerHTML = 'unBoundDom1'
  document.body.appendChild(unBoundDom1)

  const createElement = document.createElement
  const rawDocument = window.rawDocument
  window.microApp.removeDomScope()
  const unBoundDom2 = createElement.call(rawDocument, 'div')
  unBoundDom2.innerHTML = 'unBoundDom2'
  document.body.appendChild(unBoundDom2)
}


/* ---------------------- 获取原生window 和 document --------------------- */
// 注意：！！！！ 无论任何使用window.xx的情况都会重新触发元素绑定
// const _window = new Function('return window')()

// setTimeout(() => {
//   // window.microApp.removeDomScope()
//   console.log(_window.document.getElementById('root'))
// }, 0);


/* ---------------------- location 跳转 --------------------- */
// 依次放开每个注释来，尽可能覆盖所有场景
setTimeout(() => {
  // window.location.href = 'https://www.baidu.com/' // origin不同，直接跳转页面
  // window.location.href = 'http://localhost:3001/micro-app/react16/page2' // path改变，刷新浏览器
  // window.location.href = 'http://localhost:3001/micro-app/react16/page2#abc' // path不变，hash改变，不刷新浏览器，发送popstate、hashchange事件
  // window.location.href = 'http://localhost:3001/micro-app/react16/page2/' // hash从有到无，刷新浏览器
  // window.location.href = 'http://localhost:3001/micro-app/react16'
  // window.location.href = 'http://localhost:3001/micro-app/react16/' // path相同，刷新浏览器
  // window.location.href = 'http://localhost:3001/micro-app/react16/?a=1' // search变化，刷新浏览器


  // window.location.pathname = '/micro-app/react16/page2' // path改变，刷新浏览器
  // window.location.pathname = '/micro-app/react16/page2#hash1' // 无法直接通过pathname修改hash的值，这里的写法是错误的，而且会导致浏览器刷新，需要完善一下
  // window.location.pathname = '/micro-app/react16/page2?b=2'

  // window.location.search = '?c=3' // search改变，刷新浏览器
  // window.location.search = '?c=3' // search不变，刷新浏览器

  // window.location.hash = '#a' // hash改变，不刷新浏览器
  // window.location.hash = '#a' // hash不变，不刷新浏览器


  // window.location.assign('http://localhost:3001/micro-app/react16/page2') // path改变，刷新浏览器
  // window.location.assign('http://localhost:3001/micro-app/react16/page2#abc') // path不变，hash改变，不刷新浏览器，发送popstate、hashchange事件

  // window.location.replace('http://localhost:3001/micro-app/react16/page2') // 同上
  // window.location.replace('http://localhost:3001/micro-app/react16/page2#abc') // 同上
  // console.log(111111, window.location)

  // window.history.scrollRestoration = 'manual'
}, 5000);


/* ---------------------- popstate 和 hashchange --------------------- */
window.addEventListener('popstate', (e) => {
  console.log('子应用 popstate', e)
})

window.addEventListener('hashchange', (e) => {
  console.log('子应用 hashchange', e, e.newURL, e.oldURL)
})


/* ---------------------- 选择器 -- Document原型方法绑定ProxyDocument --------------------- */
// console.log('querySelectorAll: ', Document.prototype.querySelectorAll.call(document, 'span'))
// console.log('querySelectorAll head: ', Document.prototype.querySelectorAll.call(document, 'head'))
// console.log('querySelector: ', Document.prototype.querySelector.call(document, 'div'))
// console.log('querySelector head: ', Document.prototype.querySelector.call(document, 'head'))
// console.log('createElement: ', Document.prototype.createElement.call(document, 'div'))
// console.log('createElementNS: ', Document.prototype.createElementNS.call(document, 'http://www.w3.org/2000/svg', 'svg'))
// console.log('createDocumentFragment: ', Document.prototype.createDocumentFragment.call(document))
// console.log('getElementById: ', Document.prototype.getElementById.call(document, '1abc'))
// console.log('getElementsByClassName: ', Document.prototype.getElementsByClassName.call(document, '1abc'))
// console.log('getElementsByTagName: ', Document.prototype.getElementsByTagName.call(document, '1abc'))
// console.log('getElementsByName: ', Document.prototype.getElementsByName.call(document, '1abc'))

// console.log('Document.prototype.createAttribute: ', Document.prototype.createAttribute.call(document, 'abc'))
// console.log('document.createAttribute: ', document.createAttribute.call(document, 'abc'))
// console.log('document instanceof Document', document instanceof Document)
// console.log('new Document() ', new Document())
// console.log('document.defaultView ', document.defaultView)

/* ---------------------- eval作用域 --------------------- */
// TODO: window.eval 作用域
// window.eval('console.log("window.eval -- ", window)') // window
// eval('console.log("eval -- ", window)') // proxyWindow


/* ---------------------- body, head, title, meta --------------------- */
// console.log('document.body: ', document.body)
// console.log(`document.querySelector('body'): `, document.querySelector('body'))
// console.log(`document.getElementsByTagName('body')[0]: `, document.getElementsByTagName('body')[0])

// console.log('document.head: ', document.head)
// console.log(`document.querySelector('head'): `, document.querySelector('head'))
// console.log(`document.getElementsByTagName('head')[0]: `, document.getElementsByTagName('head')[0])

// console.log('document.title: ', document.title)
// console.log(`document.querySelector('title'): `, document.querySelector('title'))
// console.log(`document.getElementsByTagName('title')[0]: `, document.getElementsByTagName('title')[0])

// document.title = '子应用react16'

// console.log('document.meta: ', document.meta)
// console.log(`document.querySelector('meta'): `, document.querySelector('meta'))
// console.log(`document.getElementsByTagName('meta')[0]: `, document.getElementsByTagName('meta')[0])

// console.log('document.firstElementChild: ', document.firstElementChild)

console.log('console === parent.console: ', console === parent.console)
