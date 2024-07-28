import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'timestampToDate',
  standalone: true
})
export class TimestampToDatePipe implements PipeTransform {

  transform(value: Date | Timestamp | undefined, ...args: unknown[]): number {
    if (value ===undefined || value === null)
      return 0
    let timestamp = value as Timestamp
    return timestamp.seconds * 1000
  }

}
