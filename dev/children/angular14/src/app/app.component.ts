import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private router: Router, private ngZone: NgZone) {
    if (window.__MICRO_APP_ENVIRONMENT__) {
      window.addEventListener('popstate', () => {
        const fullPath = location.pathname.replace('/micro-app/angular14', '') + location.search + location.hash
        this.ngZone.run(() => {
          this.router.navigateByUrl(fullPath)
        })
      })
    }
  }
}
