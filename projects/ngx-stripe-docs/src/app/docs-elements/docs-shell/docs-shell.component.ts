import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NGX_STRIPE_VERSION } from 'ngx-stripe';

import { NgStrContentService } from '../../core';

@Component({
  selector: 'ngstr-docs-shell',
  templateUrl: './docs-shell.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class NgStrDocsShellComponent {
  readonly version = inject(NGX_STRIPE_VERSION);
  readonly content = inject(NgStrContentService);

  showMenu = false;
}
