import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html'
})

export class ErrorDialog {
  matDialogTitle: string;
  matDialogContent: string;

  constructor(public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.matDialogTitle = data.title;
    this.matDialogContent = data.content;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
