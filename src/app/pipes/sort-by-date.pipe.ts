import { Pipe, PipeTransform } from '@angular/core';
import { ContactRequest } from '../domains/contact-request';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'sortByDate',
  standalone: true
})
export class SortByDatePipe implements PipeTransform {

  transform(value: ContactRequest[], ...args: any[]): any {
    value = [...value];

    return value.map(request => {
      request.creationDate = request.creationDate as Timestamp
      return request;
    })
    .sort((a: ContactRequest, b: ContactRequest) => {
      let bTime = b.creationDate as Timestamp
      let aTime = a.creationDate as Timestamp
      return bTime.seconds - aTime.seconds
    });
  }

}
