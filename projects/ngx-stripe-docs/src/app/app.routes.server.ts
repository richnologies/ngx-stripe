import { RenderMode, ServerRoute } from '@angular/ssr';

/** The docs site is fully static: every route is rendered to HTML at build time. */
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
