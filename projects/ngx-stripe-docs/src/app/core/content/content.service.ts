import { Injectable } from '@angular/core';

import { NgstMenuItem } from './menu-item.model';

@Injectable({ providedIn: 'root' })
export class NgstContentService {
  title = 'Ngx Stripe';
  logo = '/assets/img/ngx-stripe-logo.png';
  menu: NgstMenuItem[] = [
    { group: null, type: 'page', name: 'Introduction', icon: 'home', path: 'introduction' },
    { group: 'Getting Started', type: 'group', name: 'Getting Started' },
    { group: 'Getting Started', type: 'page', name: 'Installation', icon: 'home', path: 'installation' },
    { group: 'Getting Started', type: 'page', name: 'Setup Application', icon: 'home', path: 'setup-application' },
    { group: 'Core Concepts', type: 'group', name: 'Core Concepts' },
    { group: 'Core Concepts', type: 'page', name: 'Checkout', icon: 'home', path: 'checkout' },
    { group: 'Core Concepts', type: 'page', name: 'Payment Element', icon: 'home', path: 'payment-element' },
    { group: 'Core Concepts', type: 'page', name: 'Element Components', icon: 'home', path: 'element-components' },
    { group: 'Core Concepts', type: 'page', name: 'Identity', icon: 'home', path: 'identity' },
    { group: 'Core Concepts', type: 'page', name: 'Payment Request Button', icon: 'home', path: 'payment-request-button' },
    { group: 'Core Concepts', type: 'page', name: 'Service', icon: 'home', path: 'service' },
    { group: 'Core Concepts', type: 'page', name: 'Styling', icon: 'home', path: 'styling' },
    { group: 'Core Concepts', type: 'page', name: 'Service Factory', icon: 'home', path: 'service-factory' },
    { group: 'Core Concepts', type: 'page', name: 'Reference & Instance', icon: 'home', path: 'reference-instance' },
    { group: 'Core Concepts', type: 'page', name: 'Mount your Element', icon: 'home', path: 'manually-mount-your-element' },
    { group: 'Support', type: 'group', name: 'Support' },
    { group: 'Support', type: 'page', name: 'FAQS', icon: 'home', path: 'faqs' },
    { group: 'Support', type: 'page', name: 'Examples', icon: 'home', path: 'examples' },
    { group: 'Support', type: 'page', name: 'Migration', icon: 'home', path: 'migration' },
    { group: 'Examples', type: 'group', name: 'Examples' },
    { group: 'Examples', type: 'page', name: 'Test 01', icon: 'assessment', path: 'test-01' },
    { group: 'Examples', type: 'page', name: 'Test 02', icon: 'assessment', path: 'test-02' },
    { group: 'Examples', type: 'page', name: 'Test 03', icon: 'assessment', path: 'test-03' },
    { group: 'Examples', type: 'page', name: 'Test 04', icon: 'assessment', path: 'test-04' },
    { group: 'Examples', type: 'page', name: 'Test 05', icon: 'assessment', path: 'test-05' },
    { group: 'Examples', type: 'page', name: 'Test 06', icon: 'assessment', path: 'test-06' },
    { group: 'Examples', type: 'page', name: 'Test 07', icon: 'assessment', path: 'test-07' }
  ];

  getNavigationElements(path: string): { next: NgstMenuItem, previous: NgstMenuItem } {
    const current = this.menu.findIndex(element => element.type === 'page' && element.path === path);
    if (!current || current < 0) return { next: null, previous: null };

    const next = this.menu.slice(current + 1).find(element => element.type === 'page');
    const previous = this.menu.slice(0, current).reverse().find(element => element.type === 'page');

    return { next, previous };
  }
}
