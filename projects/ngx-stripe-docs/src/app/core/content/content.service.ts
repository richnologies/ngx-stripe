import { Injectable } from '@angular/core';

import { NgStrMenuItem } from './menu-item.model';

@Injectable({ providedIn: 'root' })
export class NgStrContentService {
  title = 'Ngx Stripe';
  logo = '/assets/img/ngx-stripe-logo.png';
  menu: NgStrMenuItem[] = [
    { group: null, type: 'page', name: 'Introduction', path: 'introduction' },
    { group: 'Getting Started', type: 'group', name: 'Getting Started' },
    {
      group: 'Getting Started',
      type: 'page',
      name: 'Installation',
      path: 'installation'
    },
    {
      group: 'Getting Started',
      type: 'page',
      name: 'Setup Application',
      path: 'setup-application'
    },
    { group: 'Core Concepts', type: 'group', name: 'Core Concepts' },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Checkout',
      path: 'checkout'
    },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Payment Element',
      path: 'payment-element'
    },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Element Components',
      path: 'element-components'
    },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Identity',
      path: 'identity'
    },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Payment Request Button',
      path: 'payment-request-button'
    },
    { group: 'Core Concepts', type: 'page', name: 'Service', path: 'service' },
    { group: 'Core Concepts', type: 'page', name: 'Styling', path: 'styling' },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Service Factory',
      path: 'service-factory'
    },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Reference & Instance',
      path: 'reference-instance'
    },
    {
      group: 'Core Concepts',
      type: 'page',
      name: 'Mount your Element',
      path: 'manually-mount-your-element'
    },
    { group: 'Support', type: 'group', name: 'Support' },
    { group: 'Support', type: 'page', name: 'FAQS', path: 'faqs' },
    { group: 'Support', type: 'page', name: 'Examples', path: 'examples' },
    { group: 'Support', type: 'page', name: 'Migration', path: 'migration' }
    /* { group: 'Examples', type: 'group', name: 'Examples' },
    { group: 'Examples', type: 'page', name: 'Test 01', path: 'test-01' },
    { group: 'Examples', type: 'page', name: 'Test 02', path: 'test-02' },
    { group: 'Examples', type: 'page', name: 'Test 03', path: 'test-03' },
    { group: 'Examples', type: 'page', name: 'Test 04', path: 'test-04' },
    { group: 'Examples', type: 'page', name: 'Test 05', path: 'test-05' },
    { group: 'Examples', type: 'page', name: 'Test 06', path: 'test-06' },
    { group: 'Examples', type: 'page', name: 'Test 07', path: 'test-07' } */
  ];

  getNavigationElements(path: string): {
    next: NgStrMenuItem;
    previous: NgStrMenuItem;
  } {
    const current = this.menu.findIndex((element) => element.type === 'page' && element.path === path);
    if (!current || current < 0) return { next: null, previous: null };

    const next = this.menu.slice(current + 1).find((element) => element.type === 'page');
    const previous = this.menu
      .slice(0, current)
      .reverse()
      .find((element) => element.type === 'page');

    return { next, previous };
  }
}
