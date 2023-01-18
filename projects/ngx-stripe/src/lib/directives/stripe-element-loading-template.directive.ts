import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxStripeLoadingTemplate]',
  standalone: true
})
export class NgxStripeElementLoadingTemplateDirective {
  constructor(public templateRef: TemplateRef<NgxStripeElementLoadingTemplateDirective>) {}
}
