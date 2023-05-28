import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  constructor(private router: Router, private ngZone: NgZone) {
    // 解决点击浏览器前进、返回按钮，上一个页面不卸载的问题
    if (window.__MICRO_APP_ENVIRONMENT__) {
      window.addEventListener('popstate', () => {
        const fullPath = location.pathname.replace('/micro-app/angular11', '') + location.search + location.hash
        this.ngZone.run(() => {
          this.router.navigateByUrl(fullPath)
        })
      })
    }
  }
  title = 'child-angular11';
}
