import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dueDateFormat',
  standalone: false
})
export class DueDateFormatPipe implements PipeTransform {
  transform(value: string | Date): string {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
