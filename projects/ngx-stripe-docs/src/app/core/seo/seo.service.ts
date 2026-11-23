import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { NGSTR_DOCS_SITE, NGSTR_ELEMENTS } from '../elements/elements.data';

import {
  NGSTR_DEFAULT_DESCRIPTION,
  NGSTR_DEFAULT_TITLE,
  NGSTR_PAGE_DESCRIPTIONS,
  NGSTR_SOCIAL_IMAGE_PATH,
  NGSTR_TITLE_SUFFIX
} from './seo.data';

/**
 * Sets the title, description, canonical URL and social tags for the current page.
 * Runs during the build-time prerender too, which is what puts them in the static HTML.
 */
@Injectable({ providedIn: 'root' })
export class NgStrSeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update(url: string, routeTitle?: string): void {
    // The lane picker's `?lane=` and in-page anchors are views of the same page.
    const path = url.split(/[?#]/)[0].replace(/\/+$/, '') || '/';
    const title = routeTitle ? `${routeTitle} | ${NGSTR_TITLE_SUFFIX}` : NGSTR_DEFAULT_TITLE;
    const description = this.descriptionFor(path, routeTitle);
    const canonical = `${NGSTR_DOCS_SITE}${path}`;

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: canonical });
    this.meta.updateTag({ property: 'og:image', content: `${NGSTR_DOCS_SITE}${NGSTR_SOCIAL_IMAGE_PATH}` });
    this.setCanonical(canonical);
  }

  private descriptionFor(path: string, routeTitle?: string): string {
    const listed = NGSTR_PAGE_DESCRIPTIONS[path];
    if (listed) return listed;

    const element = NGSTR_ELEMENTS.find((el) => el.docsPath === path);
    if (element) return `${element.name} for Angular (${element.selector}). ${element.summary}`;

    if (routeTitle && path.startsWith('/docs/examples/')) {
      return `${routeTitle}: a working ngx-stripe example for Angular.`;
    }

    return NGSTR_DEFAULT_DESCRIPTION;
  }

  private setCanonical(href: string): void {
    let link = this.document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
