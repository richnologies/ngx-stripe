import { Directive, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { filter } from 'rxjs/operators';

@Directive({
  selector: '[appCloseOnNav]'
})
export class CloseOnNavDirective implements OnInit {
  constructor(private router: Router, private sidenav: MatSidenav) {}

  ngOnInit() {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => {
        if (this.sidenav.mode === 'over') {
          this.sidenav.close();
        }
      });
  }
}
