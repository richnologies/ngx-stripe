import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngStrCodeFormat',
  pure: true,
  standalone: true
})
export class NgStrCodeFormatPipe implements PipeTransform {
  transform(code: string): string {
    return code
      .split('\n')
      .filter((row, index, arr) => {
        if (index !== 0 && index !== arr.length - 1) return true;
        return row && row.trim().length > 0;
      })
      .map((row) => row.replace('    ', ''))
      .join('\n');
  }
}
