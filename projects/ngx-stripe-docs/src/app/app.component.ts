import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { NgStrGoogleTagManagerService } from './core';

@Component({
  standalone: true,
  selector: 'ngstr-root',
  template: `<router-outlet></router-outlet>`,
  imports: [RouterModule]
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private titleService: Title, private gtag: NgStrGoogleTagManagerService) {}

  ngOnInit() {
    this.gtag.setup();
    this.router.events
      .pipe(
        filter((ev) => ev instanceof NavigationEnd),
        map((ev: NavigationEnd) => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return { title: routeTitle, ev };
        })
      )
      .subscribe(({ title, ev }) => {
        this.titleService.setTitle(title ? `${title} - Ngx Stripe` : 'Ngx Stripe');
        if (ev) this.gtag.pageView(ev.urlAfterRedirects);
      });
  }
}
