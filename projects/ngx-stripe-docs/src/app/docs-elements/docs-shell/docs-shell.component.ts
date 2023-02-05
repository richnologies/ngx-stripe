import { Component, Inject } from '@angular/core';

import { NGX_STRIPE_VERSION } from 'ngx-stripe';

import { NgStrContentService } from '../../core';

@Component({
  selector: 'ngstr-docs-shell',
  templateUrl: './docs-shell.component.html'
})
export class NgStrDocsShellComponent {
  showMenu = false;

  constructor(@Inject(NGX_STRIPE_VERSION) public version: string, public content: NgStrContentService) {}
}
