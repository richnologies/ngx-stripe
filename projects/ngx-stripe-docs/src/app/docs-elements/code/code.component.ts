import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  inject
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

import { HighlightJS } from 'ngx-highlightjs';

import { NgStrCodeFormatPipe } from './code-format.pipe';

@Component({
  selector: 'ngstr-code',
  template: `
    @if (!hidden) {
    <pre class="ngstr-code not-prose"><code class="hljs" [innerHTML]="highlighted"></code></pre>
    }
  `,
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule]
})
export class NgStrCodeComponent implements OnChanges {
  @Input() name?: string;
  @Input() code: string;

  highlighted: SafeHtml = '';

  private _hidden = false;
  private readonly hljs = inject(HighlightJS);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly format = new NgStrCodeFormatPipe();

  get hidden(): boolean {
    return this._hidden;
  }

  set hidden(value: boolean) {
    if (this._hidden === value) return;
    this._hidden = value;
    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['code'] || changes['name']) {
      void this.render();
    }
  }

  private async render() {
    const source = this.format.transform(this.code || '');
    if (!source.trim()) {
      this.highlighted = '';
      this.cdr.markForCheck();
      return;
    }

    const language = this.detectLanguage();
    try {
      const result = await firstValueFrom(
        this.hljs.highlight(source, { language, ignoreIllegals: true })
      );
      let html = result.value || '';
      if (language === 'typescript' || language === 'javascript') {
        html = await this.rehighlightEmbeddedHtml(html);
      }
      this.highlighted = this.sanitizer.bypassSecurityTrustHtml(html);
    } catch {
      this.highlighted = this.sanitizer.bypassSecurityTrustHtml(escapeHtml(source));
    }
    this.cdr.markForCheck();
  }

  private detectLanguage(): string {
    const n = (this.name || '').toLowerCase();
    if (n.endsWith('.html') || n.endsWith('.svg')) return 'xml';
    if (n.endsWith('.css') || n.endsWith('.scss')) return 'css';
    if (n.endsWith('.js') || n.endsWith('.mjs') || n.endsWith('.cjs') || n.endsWith('.json')) {
      return 'javascript';
    }
    return 'typescript';
  }

  /**
   * highlight.js treats Angular `template: \`...\`` as a plain string (entities escaped).
   * Decode those template literals and re-run XML highlighting so tags/attrs get colors.
   */
  private async rehighlightEmbeddedHtml(highlighted: string): Promise<string> {
    const stringSpan = /<span class="hljs-string">(`[\s\S]*?`)<\/span>/g;
    const parts: Array<string | Promise<string>> = [];
    let last = 0;
    let match: RegExpExecArray | null;

    while ((match = stringSpan.exec(highlighted))) {
      parts.push(highlighted.slice(last, match.index));
      const quoted = match[1];
      const inner = decodeHtmlEntities(quoted.slice(1, -1));
      last = match.index + match[0].length;

      if (/<\/?[a-zA-Z!]/.test(inner)) {
        parts.push(this.highlightTemplateLiteral(inner));
      } else {
        parts.push(match[0]);
      }
    }
    parts.push(highlighted.slice(last));

    return (await Promise.all(parts)).join('');
  }

  private async highlightTemplateLiteral(inner: string): Promise<string> {
    try {
      const result = await firstValueFrom(
        this.hljs.highlight(inner, { language: 'xml', ignoreIllegals: true })
      );
      return `<span class="hljs-string">\`</span>${result.value}<span class="hljs-string">\`</span>`;
    } catch {
      return `<span class="hljs-string">\`${escapeHtml(inner)}\`</span>`;
    }
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}
