import { Directive, AfterViewInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel } from '@angular/router';

@Directive({
  selector: '[appRoutingLoader]',
  standalone: true
})
export class RoutingLoaderDirective implements AfterViewInit {
  loading = false;

  private readonly router = inject(Router);
  private readonly templateRef = inject(TemplateRef);
  private readonly viewContainer = inject(ViewContainerRef);

  ngAfterViewInit() {
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationStart) {
        this.loading = true;
      } else if (ev instanceof NavigationEnd || ev instanceof NavigationCancel) {
        this.loading = false;
      }

      this.viewContainer.clear();
      if (this.loading) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }
    });
  }
}
