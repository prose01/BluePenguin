import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'error-dialog',
  templateUrl: './error-dialog.component.html',
  styleUrls: ['./error-dialog.component.scss']
})

export class ErrorDialog {
  matDialogTitle: string = 'No title';
  matDialogContent: string = 'No content';

  constructor(public dialogRef: MatDialogRef<ErrorDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.matDialogTitle = data.title;
    this.matDialogContent = data.content;
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
