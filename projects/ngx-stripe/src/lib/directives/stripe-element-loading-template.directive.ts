import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngxStripeLoadingTemplate]'
})
export class NgxStripeElementLoadingTemplateDirective {
  constructor(public templateRef: TemplateRef<NgxStripeElementLoadingTemplateDirective>) {}
}
