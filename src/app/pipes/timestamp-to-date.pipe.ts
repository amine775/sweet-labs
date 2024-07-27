import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'timestampToDate',
  standalone: true
})
export class TimestampToDatePipe implements PipeTransform {

  transform(value: Date | Timestamp, ...args: unknown[]): number {
    let timestamp = value as Timestamp
    return timestamp.seconds * 1000
  }

}
