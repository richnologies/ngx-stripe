import { Component, Input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngstr-subheader',
  template: `
    <h3 class="ngstr-subheader" [id]="link" (mouseenter)="showHashLink = true" (mouseleave)="showHashLink = false">
      <span>{{ subheader }}</span>
      @if (showHashLink && link && link.length > 0) {
      <a [href]="url + '#' + link" class="ngstr-link-hash" title="Direct link to heading">#</a>
      }
    </h3>
  `,
  styles: [
    `
      h3.ngstr-subheader {
        font-size: 2rem;
        margin-top: 2rem;
        margin-bottom: 1.25rem;
        font-weight: 600;
      }
      a.ngstr-link-hash {
        cursor: pointer;
        margin-left: 0.5rem;
        text-decoration: none;
        color: var(--tw-prose-headings);
      }
    `
  ],
  standalone: true
})
export class NgStrSubheaderComponent {
  private readonly router = inject(Router);

  @Input() subheader: string;
  @Input() link: string;
  showHashLink = false;

  get url() {
    return this.router.url.split('#')[0];
  }
}
