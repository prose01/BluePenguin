import { Injectable } from '@angular/core';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { SnackbarComponent } from '../snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  messageText: string[];

  constructor(private snackBar: MatSnackBar) { }

  public openSnackBar(message, type, duration?, horizontalPosition?, verticalPosition?) {
    const _snackType = type !== undefined ? type : 'info';
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: duration || '',
      panelClass: ['mat-snack-bar'],
      horizontalPosition: horizontalPosition || 'center',
      verticalPosition: verticalPosition || 'top',
      data: { message: message, snackType: _snackType, snackBar: this.snackBar }
    });
  }
}
