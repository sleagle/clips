import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
import firebase from 'firebase/compat/app'

@Pipe({
  name: 'fbTimestamp'
})
export class FbTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) { }

  transform(value: firebase.firestore.FieldValue) {
    const date = (value as firebase.firestore.Timestamp).toDate();

    return this.datePipe.transform(date, "mediumDate");
  }

}
