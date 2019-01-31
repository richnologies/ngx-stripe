import {
  Directive,
  AfterViewInit,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel
} from '@angular/router';

@Directive({
  selector: '[appRoutingLoader]'
})
export class RoutingLoaderDirective implements AfterViewInit {
  loading = false;

  constructor(
    private router: Router,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngAfterViewInit() {
    this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        this.loading = true;
      } else if (
        ev instanceof NavigationEnd ||
        ev instanceof NavigationCancel
      ) {
        this.loading = false;
      }

      this.viewContainer.clear();
      if (this.loading) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
