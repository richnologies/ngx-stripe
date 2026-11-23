import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

import { NgStrGoogleTagManagerService, NgStrSeoService } from './core';

@Component({
  standalone: true,
  selector: 'ngstr-root',
  template: `<router-outlet></router-outlet>`,
  imports: [RouterModule]
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly seo = inject(NgStrSeoService);
  private readonly gtag = inject(NgStrGoogleTagManagerService);

  ngOnInit() {
    this.gtag.setup();
    this.router.events.pipe(filter((ev): ev is NavigationEnd => ev instanceof NavigationEnd)).subscribe((ev) => {
      let route: ActivatedRoute = this.router.routerState.root;
      while (route.firstChild) {
        route = route.firstChild;
      }

      // Title first: the page view reports it.
      this.seo.update(ev.urlAfterRedirects, route.snapshot.data['title']);
      this.gtag.pageView(ev.urlAfterRedirects);
    });
  }
}
