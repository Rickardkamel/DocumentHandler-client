import {Component, ViewContainerRef} from '@angular/core';


@Component({
  selector: 'app-root',
  template: `
  <app-header>
  </app-header>
  <router-outlet></router-outlet>
  `,
})

export class AppComponent {

  public constructor(private viewContainerRef: ViewContainerRef) {
  }
}
