import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'taskDate'
})
export class TaskDatePipe extends DatePipe implements PipeTransform {

  transform(date: Date | string, format: string = 'mediumDate'): string {
    if (!date) {
      return 'No term';
    }

    date = new Date(date);

    if (date.getDate() === new Date().getDate()) {
      return 'today';
    }

    if (date.getDate() === new Date().getDate() - 1) {
      return 'yesterday';
    }

    if (date.getDate() === new Date().getDate() + 1) {
      return 'tomorrow';
    }

    return new DatePipe('en-US').transform(date, format);
  }

}
