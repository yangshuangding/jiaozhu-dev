import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import {VERSION as CDK_VERSION} from '@angular/cdk';
import {VERSION as MAT_VERSION} from '@angular/material/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

declare global {
  interface Window {
    microApp: any
    mount: CallableFunction
    unmount: CallableFunction
    __MICRO_APP_ENVIRONMENT__: string
  }
}

if (environment.production) {
  enableProdMode();
}

/* eslint-disable no-console */
console.info('Angular CDK version', CDK_VERSION.full);
console.info('Angular Material version', MAT_VERSION.full);

// ----------分割线---默认模式------两种模式任选其一-----放开注释即可运行------- //
// let app: void | NgModuleRef<AppModule>
// platformBrowserDynamic()
//   .bootstrapModule(AppModule)
//   .then((res: NgModuleRef<AppModule>) => {
//     app = res
//   })
//   .catch(err => console.error(err));


// console.log('微应用child-angular14渲染了 -- 默认模式');

// // 监听卸载操作
// window.unmount = () => {
//   app?.destroy();
//   app = undefined;
//   console.log('微应用child-angular14卸载了 --- 默认模式');
// }

// ----------分割线---umd模式------两种模式任选其一-------------- //
let app: void | NgModuleRef<AppModule>
// 👇 将渲染操作放入 mount 函数，子应用初始化时会自动执行
window.mount = () => {
  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then((res: NgModuleRef<AppModule>) => {
      app = res
    })
    .catch(err => console.error(err));

  console.log('微应用child-angular14渲染了 -- UMD模式');
}

// 👇 将卸载操作放入 unmount 函数
window.unmount = () => {
  // app?.destroy();
  app = undefined;
  console.log('微应用child-angular14卸载了 --- UMD模式');
}

// 如果不在微前端环境，则直接执行mount渲染
if (!window.__MICRO_APP_ENVIRONMENT__) {
  window.mount();
}

// -------------------分割线-------------------- //
