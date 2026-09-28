import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngStrCodeFormat',
  pure: true,
  standalone: true
})
export class NgStrCodeFormatPipe implements PipeTransform {
  transform(code: string): string {
    const rows = code.split('\n').filter((row, index, arr) => {
      if (index !== 0 && index !== arr.length - 1) return true;
      return row && row.trim().length > 0;
    });

    const indents = rows
      .filter((row) => row.trim().length > 0)
      .map((row) => row.match(/^[ \t]*/)?.[0].length ?? 0);
    const trim = indents.length ? Math.min(...indents) : 0;

    return rows.map((row) => (row.trim().length ? row.slice(trim) : row)).join('\n');
  }
}
