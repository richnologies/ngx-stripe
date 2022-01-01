import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ngStrGroupName',
  pure: true
})
export class NgStrGroupNamePipe implements PipeTransform {
  transform(group: string, direction: 'next' | 'previous'): string {
    if (!group) return direction === 'next' ? 'Next' : 'Previous';
    return direction === 'next' ? `Next - ${group}` : `${group} - Previous`;
  }
}
