import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  messageText: string[];

  constructor(private snackBar: MatSnackBar) { }

  public openSnackBar(message, type, duration?, horizontalPosition?, verticalPosition?) {
    const _snackType = type !== undefined ? type : 'success';
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: duration || '',
      horizontalPosition: horizontalPosition || 'center',
      verticalPosition: verticalPosition || 'top',
      data: { message: message, snackType: _snackType, snackBar: this.snackBar }
    });
  }


  //public openSnackBar(message: string, action: string, snackType?: snackType) {
  //  const _snackType: snackType =
  //    snackType !== undefined ? snackType : 'Success';

  //  this.snackBar.openFromComponent(SnackbarComponent, {
  //    duration: 2000,
  //    horizontalPosition: 'end',
  //    verticalPosition: 'top',
  //    data: { message: message, snackType: _snackType }
  //  });
  //}
}
